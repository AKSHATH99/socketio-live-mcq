"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
                console.log("✅ fetched results", data);
                setStudents(data.students);
            } catch (err) {
                console.error(err);
            }
        };

        if (testId) fetchResults();
    }, [testId]);


    return (
<div className="p-8 text-black dark:text-white bg-white dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Test Results</h1>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {students.map((s, idx) => {
                            const rank = idx + 1;
                            const isTop3 = rank <= 3;
                            
                            return (
                                <tr key={s.student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm font-medium ${
                                            isTop3 
                                                ? rank === 1 
                                                    ? 'text-yellow-600 dark:text-yellow-400 font-bold' 
                                                    : rank === 2 
                                                        ? 'text-gray-600 dark:text-gray-300 font-bold'
                                                        : 'text-amber-600 dark:text-amber-400 font-bold'
                                                : 'text-gray-900 dark:text-gray-100'
                                        }`}>
                                            {s.student.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {s.totalCorrect}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => setSelectedStudent(s)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium underline transition-colors"
                                        >
                                            View Answers
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full relative border dark:border-gray-700">
                        <button
                            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            onClick={() => setSelectedStudent(null)}
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 pr-8">
                            {selectedStudent.student.name}'s Answers
                        </h2>
                        
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {selectedStudent.answers.map((ans, idx) => (
                                <div
                                    key={idx}
                                    className={`border rounded-lg p-4 ${
                                        ans.isCorrect 
                                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                                            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                    }`}
                                >
                                    <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        Q{idx + 1}: {ans.question}
                                    </p>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Correct Answer:</span>{" "}
                                            <span className="font-semibold text-green-700 dark:text-green-400">
                                                {ans.correctAnswer}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            <span className="font-medium">Student's Answer:</span>{" "}
                                            <span
                                                className={`font-semibold ${
                                                    ans.isCorrect 
                                                        ? "text-green-700 dark:text-green-400" 
                                                        : "text-red-700 dark:text-red-400"
                                                }`}
                                            >
                                                {ans.selectedAnswer}
                                            </span>
                                        </p>
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
