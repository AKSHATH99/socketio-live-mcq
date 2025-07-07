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
        <div className="p-6 text-black">
            <h1 className="text-2xl font-bold mb-4">Test Results</h1>

            <table className="border-collapse border w-full text-left">
                <thead>
                    <tr className="border bg-gray-100">
                        <th className="p-2">#</th>
                        <th className="p-2">Student</th>
                        <th className="p-2">Score</th>
                        <th className="p-2">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s, idx) => (
                        <tr key={s.student.id} className="border">
                            <td className="p-2">{idx + 1}</td>
                            <td className="p-2">{s.student.name}</td>
                            <td className="p-2">{s.totalCorrect}</td>
                            <td className="p-2">
                                <button
                                    onClick={() => setSelectedStudent(s)}
                                    className="text-blue-600 underline"
                                >
                                    View Answers
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-xl w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
                            onClick={() => setSelectedStudent(null)}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            {selectedStudent.student.name}'s Answers
                        </h2>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {selectedStudent.answers.map((ans, idx) => (
                                <div
                                    key={idx}
                                    className={`border p-2 rounded ${ans.isCorrect ? "bg-green-100" : "bg-red-100"
                                        }`}
                                >
                                    <p className="font-semibold">{ans.question}</p>
                                    <p>
                                        Correct: <strong>{ans.correctAnswer}</strong>
                                    </p>
                                    <p>
                                        Your Answer:{" "}
                                        <strong
                                            className={
                                                ans.isCorrect ? "text-green-700" : "text-red-700"
                                            }
                                        >
                                            {ans.selectedAnswer}
                                        </strong>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
