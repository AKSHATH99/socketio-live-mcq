'use client'
export default function InputBox({ index, question, options, onQuestionChange, onOptionChange }) {
  return (
    <div className="bg-gray-100 w-max p-4 ml-10 mb-6 border border-gray-300 rounded shadow">
      <div className="mb-4">
        <input
          className="border w-full h-[40px] border-black px-2"
          placeholder="Type Question here"
          value={question}
          onChange={(e) => onQuestionChange(index, e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt, j) => (
          <input
            key={j}
            placeholder={`Option ${j + 1}`}
            className="border border-black px-2 py-1"
            value={opt}
            onChange={(e) => onOptionChange(index, j, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
}
