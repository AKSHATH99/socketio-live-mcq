import { useState, useEffect } from "react";

export default function LiveQuestion({ question, onAnswer }) {
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
        studentId: "31e96375-fd44-42e1-a675-48c6a45d65a2"
      });
      setLastSubmittedAnswer(selectedIdx);
    }
  };

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
              studentId: "31e96375-fd44-42e1-a675-48c6a45d65a2"
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [question]);

  if (!question) return <div>No question received yet</div>;

  return (
    <div className="p-6 border border-gray-300 w-[400px] rounded text-black">
      <p className="font-bold mb-2">⏱️ Time Left: {timer}s</p>
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>

      <div className="flex flex-col gap-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`p-2 border ${selected === idx ? "bg-blue-500 text-white" : "bg-white"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            disabled={disabled}
            onClick={() => submitAnswer(idx)}
          >
            {opt}
          </button>
        ))}
      </div>

      {disabled && (
        <div className="mt-4 text-green-700 font-semibold">
          {selected !== null
            ? `You selected: ${question.options[selected]}`
            : "⛔ Time's up. No answer selected."}
        </div>
      )}
    </div>
  );
}
