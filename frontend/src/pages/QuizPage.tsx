import { useEffect, useState } from "react";
import { getQuiz, submitQuiz } from "../api/api";

interface QuizData {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const { data } = await getQuiz();
      setQuiz(data);
      setSelected(null);
      setResult("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (selected === null || !quiz) return;
    try {
        const { data } = await submitQuiz(quiz.id, selected);
        setResult(data.correct ? "✅ Correct Answer!" : "❌ Wrong Answer!");
    } catch (err) {
        console.error(err);
    }
    };


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🌱 Plant Quiz</h2>

        {!quiz ? (
          <p className="text-gray-500">Loading quiz...</p>
        ) : (
          <>
            <p className="text-lg font-semibold mb-4">{quiz.question}</p>
            <div className="flex flex-col gap-3">
              {quiz.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => setSelected(index)}
                  className={`p-3 rounded-xl border transition ${
                    selected === index
                      ? "bg-green-500 text-white border-green-600"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleSubmit}
                disabled={selected === null}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 disabled:bg-gray-400"
              >
                Submit
              </button>
              <button
                onClick={fetchQuiz}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                Next Quiz
              </button>
            </div>

            {result && (
              <p
                className={`mt-4 text-lg font-bold ${
                  result.includes("Correct") ? "text-green-600" : "text-red-600"
                }`}
              >
                {result}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
