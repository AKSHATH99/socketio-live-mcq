import { useState, useEffect } from "react";

export default function LiveQuestion({fetchStudentDetailsById, question, onAnswer, studentId, studentName,TestEnded ,openLiveTestModal , setOpenLiveTestModal }) {
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

  // useEffect(()=>{
  //   setOpenLiveTestModal(false);
  // },[TestEnded])

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

  useEffect(()=>{
    console.log("test ended",TestEnded)
  },[TestEnded])
  if (!question) return null;

  return (
    <>
      {/* Modal Backdrop with Blur */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all duration-300 scale-100">
          
        {!TestEnded ?
        (
          <div>
          <div className="bg-black text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Quiz Question</h2>
              <div className="flex items-center space-x-2">
                <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  <span className="text-sm font-semibold">⏱️ {timer}s</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${timer > 5 ? 'bg-white' : timer > 2 ? 'bg-gray-400' : 'bg-gray-600'} animate-pulse`}></div>
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
                      ? "bg-black text-white border-black shadow-lg"
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
                        ? "bg-white text-black border-white"
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
              <div className="mt-6 p-4 rounded-lg bg-gray-50 border-l-4 border-black">
                <div className="flex items-center">
                  <div className="mr-3">
                    {selected !== null ? (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
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

        </div>):
       // Test Ended Modal Component - Now consistent with main modal
        <div>
          {/* Modal Header - Consistent with main modal */}
          <div className="bg-black text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Test Session Ended</h2>
              {/* X Close Button in top right */}
              <button 
                onClick={() => {
                  setOpenLiveTestModal(false);
                  fetchStudentDetailsById();
                }}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Modal Content - Consistent padding and styling */}
          <div className="p-6">
            <div className="text-center">
              {/* Icon and main message */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Session Complete
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your test session has been completed and all responses have been recorded. 
                  You can review your performance and results in the dashboard.
                </p>
              </div>

              {/* Results Info Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">Results Available</p>
                </div>
                <p className="text-xs text-gray-500">
                  Performance metrics and detailed analysis can be viewed in your dashboard
                </p>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => {
                  setOpenLiveTestModal(false);
                  fetchStudentDetailsById();
                }}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Modal Footer - Consistent with main modal */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Student: {studentName}</span>
              <span>Session terminated by instructor</span>
            </div>
          </div>
        </div>
          }

        </div>
      </div>
    </>
  );
}