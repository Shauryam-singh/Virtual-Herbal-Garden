import { useEffect, useState } from "react";
import { getQuiz, submitQuiz } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaLeaf, FaArrowRight, FaRedo, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface QuizData {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<"correct" | "wrong" | "">("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await getQuiz();
      setQuiz(data);
      setSelected(null);
      setResult("");
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (selected === null || !quiz || result) return;
    try {
      const { data } = await submitQuiz(quiz.id, selected);
      setResult(data.correct ? "correct" : "wrong");
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <FaLeaf className="absolute top-10 left-10 text-9xl text-green-200 -rotate-12" />
        <FaLeaf className="absolute bottom-20 right-10 text-8xl text-green-300 rotate-45" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl shadow-slate-200 rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl relative z-10 border border-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Botanical Challenge</span>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              Plant <span className="text-green-600">Quiz</span>
            </h2>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <FaLeaf size={24} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-20 text-center"
            >
              <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Growing Question...</p>
            </motion.div>
          ) : quiz && (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
                {quiz.question}
              </h3>

              <div className="grid gap-4 mb-10">
                {quiz.options.map((opt, index) => {
                  const isSelected = selected === index;
                  const isCorrect = result === "correct" && isSelected;
                  const isWrong = result === "wrong" && isSelected;

                  return (
                    <button
                      key={index}
                      onClick={() => !result && setSelected(index)}
                      disabled={!!result}
                      className={`group relative p-5 rounded-2xl border-2 text-left font-bold transition-all duration-300 flex items-center justify-between ${
                        isSelected 
                          ? result === "correct" ? "bg-green-50 border-green-500 text-green-700"
                            : result === "wrong" ? "bg-red-50 border-red-500 text-red-700"
                            : "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200 scale-[1.02]"
                          : "bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                          isSelected ? "bg-white/20" : "bg-white text-slate-400"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {opt}
                      </span>
                      
                      {isCorrect && <FaCheckCircle className="text-green-500" />}
                      {isWrong && <FaTimesCircle className="text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Footer */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!result ? (
                  <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all disabled:bg-slate-200 flex items-center justify-center gap-2 group"
                  >
                    Submit Answer <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="flex-1 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase text-sm tracking-widest ${
                      result === "correct" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {result === "correct" ? "Master Botanist! ✅" : "Keep Learning! ❌"}
                    </div>
                    <button
                      onClick={fetchQuiz}
                      className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      Next Quiz <FaRedo size={14} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}