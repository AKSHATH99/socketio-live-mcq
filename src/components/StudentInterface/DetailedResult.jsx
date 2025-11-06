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

    if (loading)
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-200 dark:border-gray-600 text-center">
                <p className="text-gray-600 dark:text-gray-400">Loading test details...</p>
            </div>
        );

    return (
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm p-6 space-y-5">

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Your Test Breakdown
                </h2>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                    Correct: {data?.totalCorrect} / {data?.answers?.length}
                </p>
            </div>

            {/* SCROLL CONTAINER */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {data?.answers?.map((a, index) => (
                    <div
                        key={index}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-3">
                            Q{index + 1}: {a.question.toUpperCase()}
                        </h3>

                        <p className="text-sm text-slate-700 mb-1">
                            <span className="font-medium">Correct Answer:</span>{" "}
                            <span className="font-semibold text-emerald-600">
                                {a.correctAnswer}
                            </span>
                        </p>

                        <p className="text-sm text-slate-700">
                            <span className="font-medium">Student&apos;s Answer:</span>{" "}
                            <span className="font-semibold text-emerald-600">
                                {a.selectedAnswer}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
