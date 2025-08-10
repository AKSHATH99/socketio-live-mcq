import { useState } from "react";
import InputBox from "../QuestionInputBox";

const AddQuestionModal = ({ testid, onClose }) => {
    const [questions, setQuestions] = useState([
        {
            question: "",
            options: ["", "", "", ""],
            timer: "",
            answer: ""
        }
    ]);
    const [validationErrors, setValidationErrors] = useState({});

    const handleQuestionChange = (index, value) => {
        const updated = [...questions];
        updated[index].question = value;
        setQuestions(updated);
    };

    const hasDuplicateOptions = (options) => {
        const filledOptions = options.filter(opt => opt.trim() !== '');
        const uniqueOptions = [...new Set(filledOptions.map(opt => opt.trim().toLowerCase()))];
        return filledOptions.length !== uniqueOptions.length;
    };

    const getDuplicateOptions = (options) => {
        const filledOptions = options.filter(opt => opt.trim() !== '');
        const optionCounts = {};
        const duplicates = [];

        filledOptions.forEach(opt => {
            const normalizedOpt = opt.trim().toLowerCase();
            optionCounts[normalizedOpt] = (optionCounts[normalizedOpt] || 0) + 1;
        });

        Object.keys(optionCounts).forEach(opt => {
            if (optionCounts[opt] > 1) {
                duplicates.push(opt);
            }
        });

        return duplicates;
    };


    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);

        const newErrors = { ...validationErrors };

        if (value.trim() && hasDuplicateOptions(updated[qIndex].options)) {
            const duplicates = getDuplicateOptions(updated[qIndex].options);
            newErrors[qIndex] = `Duplicate options detected: "${duplicates.join('", "')}"`;
        } else {
            delete newErrors[qIndex];
        }

        setValidationErrors(newErrors);
    };

    const handleTimerChange = (index, value) => {
        const updated = [...questions];
        updated[index].timer = value ? parseInt(value) : '';
        setQuestions(updated);
    };

    const handleAnswerChange = (index, value) => {
        const updated = [...questions];
        updated[index].answer = value;
        setQuestions(updated);
    };

    const addNewQuestion = () => {
        setQuestions(prev => [...prev, { question: "", options: ["", "", "", ""], timer: "", answer: "" }]);
    };

    const handleDone = async () => {
        try {
            setValidationErrors({});

            const errors = [];

            // Validate each question
            questions.forEach((q, index) => {
                // Check for incomplete questions
                if (!q.question.trim()) {
                    errors.push(`Question ${index + 1}: Missing question text`);
                }
                if (!q.answer.trim()) {
                    errors.push(`Question ${index + 1}: Missing correct answer`);
                }
                if (q.options.every(opt => !opt.trim())) {
                    errors.push(`Question ${index + 1}: No options provided`);
                }

                // Check for duplicate options
                if (hasDuplicateOptions(q.options)) {
                    const duplicates = getDuplicateOptions(q.options);
                    errors.push(`Question ${index + 1}: Duplicate options - "${duplicates.join('", "')}"`);
                }

                // Check if the correct answer exists in options
                const filledOptions = q.options.filter(opt => opt.trim() !== '');
                if (q.answer.trim() && !filledOptions.some(opt => opt.trim().toLowerCase() === q.answer.trim().toLowerCase())) {
                    errors.push(`Question ${index + 1}: Correct answer "${q.answer}" is not among the options`);
                }
            });

            if (errors.length > 0) {
                alert(`Please fix the following issues:\n\n${errors.join('\n')}`);
                return;
            }

            // Send all questions to the database
            const promises = questions.map(async (question, index) => {
                const questionData = {
                    testId: testid,
                    question: question.question,
                    options: question.options,
                    answer: question.answer,
                    timer: question.timer || 0
                };

                const response = await fetch('/api/add-question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(questionData)
                });

                if (!response.ok) {
                    throw new Error(`Failed to add question ${index + 1}`);
                }

                return response.json();
            });

            // Wait for all questions to be added
            const results = await Promise.all(promises);
            console.log('All questions added successfully:', results);

            // Close the modal after successful submission
            onClose();
            alert(`${questions.length} question(s) added successfully!`);
        } catch (error) {
            console.error('Error adding questions:', error);
            alert('Failed to add questions. Please try again.');
        }
    };

    return (
<div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create your quiz</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="space-y-6">
                    {questions.map((q, i) => (
                        <div key={i}>
                            <InputBox
                                index={i}
                                question={q.question}
                                options={q.options}
                                answer={q.answer}
                                onQuestionChange={handleQuestionChange}
                                onOptionChange={handleOptionChange}
                                onAnswerChange={handleAnswerChange}
                                onSubmit={handleDone}
                                timer={q.timer}
                                onTimerChange={handleTimerChange}
                                validationError={validationErrors[i]}
                            />
                            {/* Display validation error for this question */}
                            {validationErrors[i] && (
                                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
                                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                                         {validationErrors[i]}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={addNewQuestion}
                        className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Add Question
                    </button>
                    <button
                        onClick={handleDone}
                        className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionModal;