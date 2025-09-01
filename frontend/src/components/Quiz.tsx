"use client";

import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

export function Quiz({ questions }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const handleAnswerSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const getButtonClass = (questionIndex: number, option: string) => {
    const isSelected = selectedAnswers[questionIndex] === option;
    const correctAnswer = questions[questionIndex].answer;
    const hasBeenAnswered = selectedAnswers[questionIndex] !== undefined;

    if (!hasBeenAnswered) {
      return "bg-gray-700 hover:bg-gray-600";
    }
    if (option === correctAnswer) {
      return "bg-green-500/50 border-green-500";
    }
    if (isSelected && option !== correctAnswer) {
      return "bg-red-500/50 border-red-500";
    }
    return "bg-gray-700 opacity-50";
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Test Your Knowledge</h2>
      <div className="space-y-8">
        {questions.map((q, index) => (
          <div key={index}>
            <p className="font-semibold text-lg mb-3">
              {index + 1}. {q.question}
            </p>
            <div className="space-y-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswerSelect(index, option)}
                  disabled={!!selectedAnswers[index]}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-300 flex justify-between items-center disabled:cursor-not-allowed ${getButtonClass(
                    index,
                    option
                  )}`}
                >
                  {option}
                  {selectedAnswers[index] === option && (
                    <span className="text-xl">
                      {option === q.answer ? "✅" : "❌"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
