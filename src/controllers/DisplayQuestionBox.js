import { useEffect, useState } from "react";

export default function LiveQuestion({ question }) {
  const [timer, setTimer] = useState(question?.timer || 10);
  const [selected, setSelected] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setTimer(question?.timer || 10);
    setSelected(null);
    setDisabled(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisabled(true);
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
            className={`p-2 border ${
              selected === idx ? "bg-blue-500 text-white" : "bg-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
            onClick={() => setSelected(idx)}
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
