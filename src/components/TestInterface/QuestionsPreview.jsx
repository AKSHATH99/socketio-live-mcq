import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, Plus, CheckCircle } from 'lucide-react';
import EditQuestionModal from "./EditQuestionModal";
import AddQuestionModal from "./AddQuestionModal";

const QuestionsPreview = ({ questions: initialQuestions, onQuestionClick, onQuestionsUpdate,testId }) => {
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
    const [openEditQuestionModal, setOpenQuestionModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', or null
    const [openAddQuestionModal, setOpenAddQuestionModal] = useState(false)

    // Update questions when initialQuestions prop changes
    useEffect(() => {
        setQuestions(initialQuestions || []);
    }, [initialQuestions]);

    const handleSaveQuestions = async (updatedQuestions) => {
        setLoading(true);
        setSaveStatus(null);

        try {
            const response = await fetch('/api/update-questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: updatedQuestions })
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state with the returned questions
                setQuestions(data.questions);
                setSaveStatus('success');

                // Call parent component callback if provided
                if (onQuestionsUpdate) {
                    onQuestionsUpdate(data.questions);
                }

                // Show success message temporarily
                setTimeout(() => setSaveStatus(null), 3000);

                console.log('Questions updated successfully:', data.summary);
            } else {
                throw new Error(data.error || 'Failed to update questions');
            }
        } catch (error) {
            console.error('Error updating questions:', error);
            setSaveStatus('error');
            // Hide error message after 5 seconds
            setTimeout(() => setSaveStatus(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Save Status Notification */}
            {saveStatus && (
                <div className={`mb-4 p-4 rounded-lg border ${saveStatus === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300'
                        : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
                    }`}>
                    <div className="flex items-center gap-2">
                        {saveStatus === 'success' ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Questions updated successfully!</span>
                            </>
                        ) : (
                            <>
                                <span className="font-medium">Failed to update questions. Please try again.</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {questions.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-black dark:text-white">Questions Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Review and manage your test questions ({questions.length} question{questions.length !== 1 ? 's' : ''})
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setOpenQuestionModal(true)}
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                {loading ? 'Saving...' : 'Edit Questions'}
                            </button>
                            <button
                                onClick={() => setShowQuestionsPreview(!showQuestionsPreview)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                            >
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {showQuestionsPreview ? 'Collapse' : 'Expand'}
                                </span>
                                {showQuestionsPreview ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {showQuestionsPreview && (
                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <div key={question.id || index} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm dark:bg-white dark:text-black">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 leading-relaxed dark:text-gray-200 mb-2">
                                                {question.question || question.text || 'Question text not available'}
                                            </p>
                                            {question.timer && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Time limit: {question.timer} seconds
                                                </p>
                                            )}
                                            {question.options && question.options.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    {question.options.map((option, optIndex) => (
                                                        <div key={optIndex} className={`text-sm px-2 py-1 rounded ${option === question.answer
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                : 'text-gray-600 dark:text-gray-400'
                                                            }`}>
                                                            {String.fromCharCode(65 + optIndex)}. {option}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {openEditQuestionModal && (
                <EditQuestionModal
                    questions={questions}
                    onSave={handleSaveQuestions}
                    onClose={() => setOpenQuestionModal(false)}
                />
            )}

            {openAddQuestionModal && <AddQuestionModal onClose={() => setOpenAddQuestionModal(false)} testid={testId} />}

            {/* No Questions State */}
            {questions.length === 0 && !loading && (
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 dark:bg-gray-800">
                        <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2 dark:text-white">No Questions Added</h3>
                    <p className="text-gray-500 text-base mb-8 max-w-md mx-auto dark:text-gray-400">
                        Start building your test by adding questions. Questions will appear here once added.
                    </p>
                    <button
                        onClick={() => setOpenAddQuestionModal(true)}
                        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Question
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-gray-700 dark:text-gray-300">Saving questions...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionsPreview;