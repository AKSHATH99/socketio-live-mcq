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

    const handleQuestionChange = (index, value) => {
        const updated = [...questions];
        updated[index].question = value;
        setQuestions(updated);
    };

    const handleOptionChange = (qIndex, optIndex, value) => {
        const updated = [...questions];
        updated[qIndex].options[optIndex] = value;
        setQuestions(updated);
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
            // Validate that all questions have required fields
            const incompleteQuestions = questions.filter(q => 
                !q.question.trim() || 
                !q.answer.trim() || 
                q.options.every(opt => !opt.trim())
            );

            if (incompleteQuestions.length > 0) {
                alert('Please fill in all required fields for each question (question text, at least one option, and correct answer).');
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

                const response = await fetch('http://localhost:3000/api/add-question', {
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Create your quiz</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                
                <div className="space-y-6">
                    {questions.map((q, i) => (
                        <InputBox
                            key={i}
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
                        />
                    ))}
                </div>
                
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button 
                        onClick={addNewQuestion} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        + Add Question
                    </button>
                    <button 
                        onClick={handleDone} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create Test  
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionModal;