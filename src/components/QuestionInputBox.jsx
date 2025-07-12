'use client'
import { useState } from "react";

const TimerBox = ({ time, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-center border gap-2 rounded-lg px-2 py-1 hover:cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-black hover:border-gray-600 hover:bg-gray-50'
      }`}
    >
      <img src='/Timer--Streamline-Phosphor.svg' />
      <p className={isSelected ? 'text-blue-700 font-medium' : ''}>{time}s</p>
    </div>
  )
}

export default function InputBox({ index, question, options, onQuestionChange, onOptionChange, timer, onTimerChange, answer, onAnswerChange, onSubmit }) {
  const [openCustomTimer, setOpenCustomTimer] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const timerValues = [5, 10, 15, 20];
  
  const handleTimerSelect = (selectedTime) => {
    onTimerChange(index, selectedTime);
    setOpenCustomTimer(false);
  };

  const handleCustomTimerClick = () => {
    setOpenCustomTimer(true);
    onTimerChange(index, '');
  };

  const handleAnswerSelect = (optionIndex, optionValue) => {
    if (optionValue.trim() === '') return;
    
    setSelectedAnswerIndex(optionIndex);
    onAnswerChange(index, optionValue);
  };

  return (
    <div className="bg-white w-full max-w-4xl mx-auto p-8 mb-8 border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow">

      {/* Question Section */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Question {index + 1}
        </label>
        <input
          className="w-full h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-lg"
          placeholder="Enter your question here..."
          value={question}
          onChange={(e) => onQuestionChange(index, e.target.value)}
        />
      </div>

      {/* Timer Section */}
      <label className="block text-lg font-semibold text-gray-700 mb-3">
        Time Limit
      </label>
      <div className="flex flex-row gap-7">
        {timerValues.map((time) => {
          return (
            <TimerBox 
              key={time}
              time={time} 
              isSelected={timer === time}
              onClick={() => handleTimerSelect(time)}
            />
          )
        })}

        <div 
          onClick={handleCustomTimerClick} 
          className={`flex items-center justify-center border gap-2 rounded-lg px-2 py-1 hover:cursor-pointer transition-all ${
            openCustomTimer || (timer && !timerValues.includes(timer))
              ? 'border-blue-500 bg-blue-50 shadow-md' 
              : 'border-black hover:border-gray-600 hover:bg-gray-50'
          }`}
        >
          <img src='/Timer--Streamline-Phosphor.svg' />
          <p className={
            openCustomTimer || (timer && !timerValues.includes(timer))
              ? 'text-blue-700 font-medium' 
              : ''
          }>
            Custom Timer
          </p>
        </div>
      </div>

      {openCustomTimer && (
        <div className="my-8">
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="0"
              className="w-32 h-12 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-lg"
              value={timer || ''}
              onChange={(e) => onTimerChange(index, parseInt(e.target.value) || '')}
              placeholder="30"
            />
            <span className="text-gray-600 font-medium">seconds</span>
          </div>
        </div>
      )}

      {/* Options Section */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 my-3">
          Answer Options
        </label>
        <p className="text-sm text-gray-500 mb-2">Write down options and click on the green tick to mark the answer to the question</p>
        <div className="grid grid-cols-1 gap-4">
          {options.map((opt, j) => (
            <div key={j} className={`relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
              selectedAnswerIndex === j && opt.trim() !== '' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300'
            }`}>
              <span className="text-gray-500 font-medium min-w-[20px]">
                {String.fromCharCode(65 + j)}.
              </span>
              <input
                placeholder={`Option ${String.fromCharCode(65 + j)}`}
                className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 focus:outline-none transition-all"
                value={opt}
                onChange={(e) => onOptionChange(index, j, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleAnswerSelect(j, opt)}
                disabled={opt.trim() === ''}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedAnswerIndex === j && opt.trim() !== ''
                    ? 'border-green-500 bg-green-500 text-white'
                    : opt.trim() !== ''
                    ? 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                }`}
              >
                {selectedAnswerIndex === j && opt.trim() !== '' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
        {selectedAnswerIndex !== null && options[selectedAnswerIndex]?.trim() && (
          <p className="text-sm text-green-600 mt-2 font-medium">
            ✓ Correct answer: {String.fromCharCode(65 + selectedAnswerIndex)}. {options[selectedAnswerIndex]}
          </p>
        )}
      </div>
    </div>
  );
}