import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, FileText, Plus } from 'lucide-react';
import EditQuestionModal from "./EditQuestionModal";
const QuestionsPreview = ({ questions, onQuestionClick }) => {
    const [showQuestionsPreview, setShowQuestionsPreview] = useState(false);
    const [openEditQuestionModal, setOpenQuestionModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(questions)
    }, [])


    const handleSaveQuestions = async (updatedQuestions) => {
        try {
            // API call to update questions in database
            const response = await fetch('/api/questions/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questions: updatedQuestions })
            });

            if (response.ok) {
                // Refresh your questions data
                // Show success message
            }
        } catch (error) {
            console.error('Error updating questions:', error);
        }
    };
    return (
        <div>
            {questions.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-black dark:text-white">Questions Overview</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage your test questions</p>
                        </div>
                        <button onClick={() => setOpenQuestionModal(true)} className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200">
                            Edit Questions
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

                    {showQuestionsPreview && (
                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <div key={question.id || index} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm dark:bg-white dark:text-black">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-800 leading-relaxed dark:text-gray-200">
                                                {question.question || question.text || 'Question text not available'}
                                            </p>
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
                        onClick={() => setOpenQuestionModal(true)}
                        className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add First Question
                    </button>
                </div>
            )}
        </div>

    );
}

export default QuestionsPreview;