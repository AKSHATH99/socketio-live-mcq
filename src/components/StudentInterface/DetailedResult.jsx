"use client";
import { useEffect, useState } from "react";

export default function SingleStudentTestResultDetails({ testId, studentId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/get-single-student-test-results-detailed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ testId, studentId })
            });

            const json = await res.json();
            setData(json);
        } catch (err) {
            console.error("error getting student details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (testId && studentId) fetchDetails();
    }, [testId, studentId]);

    if (!testId || !studentId) return null;

    if (loading) {
        return (
            <div className="animate-pulse space-y-2">
                {[0, 1, 2].map((row) => (
                    <div
                        key={row}
                        className="h-16 rounded-lg bg-slate-100 dark:bg-gray-800"
                    />
                ))}
            </div>
        );
    }

    const answers = data?.answers || [];

    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Your answers
                </h3>
                <span className="text-xs text-slate-400 dark:text-gray-500">
                    {data?.totalCorrect ?? 0} of {answers.length} correct
                </span>
            </div>

            {answers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400 dark:border-gray-800 dark:text-gray-500">
                    No answer details available.
                </p>
            ) : (
                <div className="max-h-[360px] overflow-y-auto rounded-xl border border-slate-200 dark:border-gray-800">
                    <div className="divide-y divide-slate-100 dark:divide-gray-800">
                        {answers.map((answer, index) => {
                            const isCorrect = answer.selectedAnswer === answer.correctAnswer;

                            return (
                                <div key={index} className="px-4 py-3.5">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                        <span className="mr-1.5 text-slate-400 dark:text-gray-500">
                                            Q{index + 1}.
                                        </span>
                                        {answer.question}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            <span className="font-medium">Correct</span>
                                            {answer.correctAnswer}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 ${
                                                isCorrect
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                            }`}
                                        >
                                            <span className="font-medium">Your answer</span>
                                            {answer.selectedAnswer || "Not answered"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
