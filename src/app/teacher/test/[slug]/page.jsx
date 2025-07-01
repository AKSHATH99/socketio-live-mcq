'use client'
import { useEffect, useState } from "react";
import { use } from "react";
import AddQuestionModal from "@/components/TestInterface/AddQuestionModal";


export default function Test({ params }) {
    const unwrappedParams = use(params);
    const testId = unwrappedParams.slug;
    const [testdata, setTestdata] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openQuestionModal , setOpenQuestionModal] = useState(false);

    const fetchTestDetails = async () => {
        try {
            const res = await fetch(`/api/get-test`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: testId })
            });
            const data = await res.json();
            console.log(data);
            setTestdata(data);
        } catch (error) {
            console.error("Error fetching test details:", error);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`/api/fetch-test-questions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ testId })
            });
            const data = await res.json();
            console.log(data);
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
        fetchTestDetails();
    }, [testId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading test...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Test Header */}
                {testdata && (
                    <div className="bg-white rounded-lg p-6 mb-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h1 className="text-2xl font-bold text-black mb-2">{testdata.title}</h1>
                            <p className="text-gray-700 mb-3">{testdata.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Test ID: {testdata.id}</span>
                                <span>Created: {new Date(testdata.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{questions.length}</span> questions
                            </div>
                            <button disabled={questions.length === 0} className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors">
                                Start Test
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    <button onClick={() => setOpenQuestionModal(true)} className="bg-gray-200 px-6 my-5 py-2 rounded hover:bg-gray-300 transition-colors">
                       + Add Question
                    </button>
                    {openQuestionModal &&
                     <AddQuestionModal onClose={() => setOpenQuestionModal(false)} testid={testId} />
                    }
                </div>
                {/* Questions Preview */}
                {questions.length > 0 && (
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-black mb-4">Questions Preview</h2>
                        <div className="space-y-3">
                            {questions.map((question, index) => (
                                <div key={question.id || index} className="p-3 bg-gray-50 rounded border-l-4 border-black">
                                    <div className="flex items-start gap-3">
                                        <span className="text-sm font-medium text-gray-500 mt-1">
                                            {index + 1}.
                                        </span>
                                        <p className="text-gray-800 flex-1">
                                            {question.question || question.text || 'Question text not available'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Questions State */}
                {questions.length === 0 && !loading && (
                    <div className="bg-white rounded-lg p-8 text-center">
                        <p className="text-gray-500 text-lg mb-2">No questions available</p>
                        <p className="text-gray-400 text-sm">Questions will appear here once they are added to this test</p>
                    </div>
                )}
            </div>
        </div>
    );
}