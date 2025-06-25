'use client'
import { useState } from "react"
import InputBox from "./QuestionInputBox"

export default function QuestionsInput() {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""] },
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

  const addNewQuestion = () => {
    setQuestions(prev => [...prev, { question: "", options: ["", "", "", ""] }]);
  };

  const handleDone = () => {
    console.log("✅ Final Questions", questions);
    // Later, call a prop to pass it up or emit via socket
  };

  return (
    <div className="text-black mt-20 p-4">
      <h2 className="text-xl font-bold mb-4">Create your quiz</h2>

      {questions.map((q, i) => (
        <InputBox
          key={i}
          index={i}
          question={q.question}
          options={q.options}
          onQuestionChange={handleQuestionChange}
          onOptionChange={handleOptionChange}
        />
      ))}

      <button onClick={addNewQuestion} className="bg-blue-600 text-white px-4 py-2 rounded mr-4">
        + Add Question
      </button>

      <button onClick={handleDone} className="bg-black text-white px-4 py-2 rounded">
        ✅ Done
      </button>
    </div>
  );
}
