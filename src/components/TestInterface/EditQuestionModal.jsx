import { useState, useEffect } from "react";
import { X, Save, Trash2, Plus, Timer } from "lucide-react";

// TimerBox Component
const TimerBox = ({ time, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center border rounded-lg px-3 py-2 hover:cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md'
          : 'border-black dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <p className={`font-medium ${
        isSelected 
          ? 'text-blue-700 dark:text-blue-300' 
          : 'text-gray-900 dark:text-gray-100'
      }`}>
        {time}s
      </p>
    </div>
  );
};

const EditQuestionModal = ({ questions, onClose, onSave }) => {
    const [editedQuestions, setEditedQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCustomTimer, setOpenCustomTimer] = useState({});
    
    const timerValues = [5, 10, 15, 30, 45, 60];

    useEffect(() => {
        // Initialize edited questions with current data
        setEditedQuestions(questions.map(q => ({ ...q })));
    }, [questions]);

    const updateQuestion = (index, field, value) => {
        const updated = [...editedQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setEditedQuestions(updated);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const updated = [...editedQuestions];
        const newOptions = [...updated[questionIndex].options];
        newOptions[optionIndex] = value;
        updated[questionIndex] = { ...updated[questionIndex], options: newOptions };
        setEditedQuestions(updated);
    };

    const handleAnswerSelect = (questionIndex, optionIndex, optionValue) => {
        if (optionValue.trim() === '') return;
        updateQuestion(questionIndex, 'answer', optionValue);
    };

    const handleTimerSelect = (questionIndex, time) => {
        updateQuestion(questionIndex, 'timer', time);
        setOpenCustomTimer(prev => ({ ...prev, [questionIndex]: false }));
    };

    const handleCustomTimerClick = (questionIndex) => {
        setOpenCustomTimer(prev => ({ ...prev, [questionIndex]: !prev[questionIndex] }));
    };

    const deleteQuestion = (index) => {
        const updated = editedQuestions.filter((_, i) => i !== index);
        setEditedQuestions(updated);
        // Clean up custom timer state
        const newCustomTimer = { ...openCustomTimer };
        delete newCustomTimer[index];
        setOpenCustomTimer(newCustomTimer);
    };

    const addNewQuestion = () => {
        const newQuestion = {
            id: `temp-${Date.now()}`,
            testId: editedQuestions[0]?.testId || "",
            question: "",
            options: ["", "", "", ""],
            answer: "",
            timer: 10,
            createdAt: new Date().toISOString()
        };
        setEditedQuestions([...editedQuestions, newQuestion]);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Validate questions
            const isValid = editedQuestions.every(q => 
                q.question.trim() !== "" && 
                q.options.every(opt => opt.trim() !== "") &&
                q.answer.trim() !== "" &&
                q.options.includes(q.answer)
            );

            if (!isValid) {
                alert("Please fill in all fields and ensure the answer matches one of the options.");
                setIsLoading(false);
                return;
            }

            await onSave(editedQuestions);
            onClose();
        } catch (error) {
            console.error("Error saving questions:", error);
            alert("Failed to save questions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Your Questions</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={addNewQuestion}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Questions List */}
                <div className="p-6 space-y-8">
                    {editedQuestions.map((question, questionIndex) => (
                        <div key={question.id} className="bg-white dark:bg-gray-800 w-full max-w-4xl mx-auto p-8 mb-8 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            
                            {/* Question Header with Delete Button */}
                            <div className="flex justify-between items-start mb-8">
                                <div></div>
                                <button
                                    onClick={() => deleteQuestion(questionIndex)}
                                    className="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                    title="Delete Question"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Question Section */}
                            <div className="mb-8">
                                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    Question {questionIndex + 1}
                                </label>
                                <input
                                    className="w-full h-12 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                    placeholder="Enter your question here..."
                                    value={question.question}
                                    onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                />
                            </div>

                            {/* Timer Section */}
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                Time Limit
                            </label>
                            <div className="flex flex-row gap-7">
                                {timerValues.map((time) => (
                                    <TimerBox 
                                        key={time}
                                        time={time} 
                                        isSelected={question.timer === time}
                                        onClick={() => handleTimerSelect(questionIndex, time)}
                                    />
                                ))}

                                <div 
                                    onClick={() => handleCustomTimerClick(questionIndex)} 
                                    className={`flex items-center justify-center border gap-2 rounded-lg px-2 py-1 hover:cursor-pointer transition-all ${
                                        openCustomTimer[questionIndex] || (question.timer && !timerValues.includes(question.timer))
                                            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md' 
                                            : 'border-black dark:border-gray-500 hover:border-gray-600 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Timer className="dark:text-white" height={12} width={12} />
                                    <p className={
                                        openCustomTimer[questionIndex] || (question.timer && !timerValues.includes(question.timer))
                                            ? 'text-blue-700 dark:text-blue-300 font-medium' 
                                            : 'text-gray-900 dark:text-gray-100'
                                    }>
                                        Custom Timer
                                    </p>
                                </div>
                            </div>

                            {openCustomTimer[questionIndex] && (
                                <div className="my-8">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-32 h-12 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                            value={question.timer || ''}
                                            onChange={(e) => updateQuestion(questionIndex, 'timer', parseInt(e.target.value) || '')}
                                            placeholder="30"
                                        />
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">seconds</span>
                                    </div>
                                </div>
                            )}

                            {/* Options Section */}
                            <div className="mb-8">
                                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200 my-3">
                                    Answer Options
                                </label>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Write down options and click on the green tick to mark the answer to the question
                                </p>
                                <div className="grid grid-cols-1 gap-4">
                                    {question.options.map((opt, j) => {
                                        const isSelectedAnswer = question.answer === opt && opt.trim() !== '';
                                        return (
                                            <div key={j} className={`relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                                                isSelectedAnswer
                                                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30' 
                                                    : 'border-gray-300 dark:border-gray-600'
                                            }`}>
                                                <span className="text-gray-500 dark:text-gray-400 font-medium min-w-[20px]">
                                                    {String.fromCharCode(65 + j)}.
                                                </span>
                                                <input
                                                    placeholder={`Option ${String.fromCharCode(65 + j)}`}
                                                    className="flex-1 h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-200 dark:focus:ring-blue-800 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                                    value={opt}
                                                    onChange={(e) => updateOption(questionIndex, j, e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAnswerSelect(questionIndex, j, opt)}
                                                    disabled={opt.trim() === ''}
                                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                                        isSelectedAnswer
                                                            ? 'border-green-500 dark:border-green-400 bg-green-500 dark:bg-green-500 text-white'
                                                            : opt.trim() !== ''
                                                            ? 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-600 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {isSelectedAnswer && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {question.answer && question.answer.trim() && (
                                    <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                                        ✓ Correct answer: {String.fromCharCode(65 + question.options.findIndex(opt => opt === question.answer))}. {question.answer}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {editedQuestions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No questions yet</p>
                            <button
                                onClick={addNewQuestion}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors mx-auto"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Question
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditQuestionModal;