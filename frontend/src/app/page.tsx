"use client";

import { useState } from "react";
import axios from "axios";
import { Quiz } from "@/components/Quiz";
import { UrlForm } from "@/components/UrlForm";
import { Loader } from "@/components/Loader";

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export default function HomePage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");
    setSummary("");
    setQuiz([]);
    setShowQuiz(false);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/process-video",
        { video_url: videoUrl }
      );
      setSummary(response.data.summary);
      setQuiz(JSON.parse(response.data.quiz).questions);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please check the URL or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 pt-20 md:p-24 bg-gray-900 text-white">
      <div className="w-full max-w-3xl space-y-10">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            VideoNote
          </h1>
          <p className="text-lg text-gray-400">
            Your AI-powered video summarizer and quiz generator.
          </p>
        </div>

        <UrlForm
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          isLoading={isLoading}
          handleGenerate={handleGenerate}
        />

        {error && (
          <p className="text-red-400 text-center bg-red-500/10 p-3 rounded-lg">
            {error}
          </p>
        )}

        {isLoading && <Loader />}

        {!isLoading && summary && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h2 className="text-3xl font-bold mb-4">Summary</h2>
              <div className="prose prose-invert text-gray-300 whitespace-pre-line">
                {summary}
              </div>
            </div>

            {!showQuiz && quiz.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-8 py-3 bg-green-600 font-semibold rounded-lg hover:bg-green-700 transition-transform hover:scale-105 duration-300"
                >
                  Take Quiz
                </button>
              </div>
            )}

            {showQuiz && <Quiz questions={quiz} />}
          </div>
        )}
      </div>
    </main>
  );
}
