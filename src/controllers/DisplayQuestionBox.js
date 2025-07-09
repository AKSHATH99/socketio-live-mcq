import { useState, useEffect } from "react";

export default function LiveQuestion({ question, onAnswer, studentId, studentName,TestEnded }) {
  const [timer, setTimer] = useState(question?.timer || 10);
  const [selected, setSelected] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState(null);

  const submitAnswer = (selectedIdx) => {
    if (disabled) return;
    
    setSelected(selectedIdx);
    
    const selectedAnswer = question.options[selectedIdx];
    // Only submit if the answer has changed
    if (lastSubmittedAnswer !== selectedIdx) {
      onAnswer({
        questionId: question.id,
        selectedAnswer,
        testId: question.testId,
        studentId: studentId,
        studentName: studentName
      });
      setLastSubmittedAnswer(selectedIdx);
    }
  };

  useEffect(() => {
    console.log("studentid in question box", studentId);
    console.log("studentname in question box", studentName);
  }, []);

  useEffect(() => {
    setTimer(question?.timer || 10);
    setSelected(null);
    setDisabled(false);
    setLastSubmittedAnswer(null);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisabled(true);
          // Submit final answer when timer runs out
          if (selected !== null && lastSubmittedAnswer === selected) {
            onAnswer({
              questionId: question.id,
              selectedAnswer: null,
              testId: question.testId,
              studentId: studentId,
              studentName: studentName
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [question]);

  if (!question) return null;

  return (
    <>
      {/* Modal Backdrop with Blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 scale-100">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quiz Question</h2>
              <div className="flex items-center space-x-2">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">⏱️ {timer}s</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${timer > 5 ? 'bg-green-400' : timer > 2 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt, idx) => (
                <button
                  key={idx}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 transform hover:scale-[1.02] ${
                    selected === idx
                      ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
                  } ${
                    disabled
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : "hover:shadow-md"
                  }`}
                  disabled={disabled}
                  onClick={() => submitAnswer(idx)}
                >
                  <div className="flex items-center">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-sm font-bold ${
                      selected === idx
                        ? "bg-white text-blue-500 border-white"
                        : "border-gray-400"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Result Message */}
            {disabled && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="mr-3">
                    {selected !== null ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">⛔</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {selected !== null
                        ? "Answer Submitted!"
                        : "Time's Up!"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selected !== null
                        ? `You selected: ${question.options[selected]}`
                        : "No answer was selected."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Student: {studentName}</span>
              <span>Question ID: {question.id}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}