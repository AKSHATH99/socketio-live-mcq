"use client";

import { useEffect, useState } from "react";
import { BarChart3, X } from "lucide-react";

export default function TestResult({ testId }) {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('/api/get-test-results-detailed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ testId })
                });
                const data = await res.json();
                setStudents(data.students || []);
            } catch (err) {
                console.error(err);
            }
        };

        if (testId) fetchResults();
    }, [testId]);

    return (
        <div className="text-slate-900 dark:text-white">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Student results
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                        Scores are updated as students submit their answers.
                    </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-gray-800 dark:text-gray-400">
                    {students.length} {students.length === 1 ? "student" : "students"}
                </span>
            </div>

            {students.length === 0 ? (
                <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-gray-800">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-400 dark:bg-gray-800 dark:text-gray-500">
                        <BarChart3 className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
                        No results yet
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-gray-400">
                        Results will appear here once students complete the test.
                    </p>
                </div>
            ) : (
                <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-gray-800">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-800/50">
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                    Rank
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                    Student
                                </th>
                                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                    Score
                                </th>
                                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-gray-500">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                            {students.map((student, index) => {
                                const rank = index + 1;

                                return (
                                    <tr
                                        key={student.student.id}
                                        className="transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="px-4 py-3">
                                            <span
                                                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                                                    rank === 1
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-slate-100 text-slate-600 dark:bg-gray-800 dark:text-gray-300"
                                                }`}
                                            >
                                                {rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                            {student.student.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm tabular-nums text-slate-700 dark:text-gray-300">
                                            {student.totalCorrect}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedStudent(student)}
                                                className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                            >
                                                View answers
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm dark:bg-black/60">
                    <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
                        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 dark:border-gray-800">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {selectedStudent.student.name}&apos;s answers
                                </h2>
                                <p className="mt-0.5 text-xs text-slate-400 dark:text-gray-500">
                                    {selectedStudent.totalCorrect} correct
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudent(null)}
                                aria-label="Close"
                                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto dark:divide-gray-800">
                            {selectedStudent.answers.map((answer, index) => (
                                <div key={index} className="px-5 py-4">
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
                                                answer.isCorrect
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                    : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                                            }`}
                                        >
                                            <span className="font-medium">Answered</span>
                                            {answer.selectedAnswer || "Not answered"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
