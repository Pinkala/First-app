import React, { useState, useEffect, useRef } from "react";
import { 
  Check, X, Award, Timer, RefreshCw, BarChart2, 
  Sparkles, ShieldCheck, Zap, AlertTriangle 
} from "lucide-react";
import { MCQQuestion, SubjectCategory, DifficultyLevel, UserProgress } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface MCQSectionProps {
  questions: MCQQuestion[];
  progress: UserProgress;
  onUpdateScore: (points: number) => void;
  onLoggedActivity: (title: string, meta: string) => void;
  onTriggerAISuggestion: (category: SubjectCategory) => Promise<MCQQuestion | null>;
  preferredLanguage: string;
}

export default function MCQSection({
  questions,
  progress,
  onUpdateScore,
  onLoggedActivity,
  onTriggerAISuggestion,
  preferredLanguage
}: MCQSectionProps) {
  // Quiz states
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>(SubjectCategory.SCIENCE);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [activeQuestions, setActiveQuestions] = useState<MCQQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Timer settings: 20 seconds per question
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizScore, setQuizScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isQuizRunning, setIsQuizRunning] = useState(false);

  // AI Generated state
  const [aiGenerating, setAiGenerating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load subject-wise MCQ list
  const startQuiz = () => {
    // Filter static questions
    const pool = questions.filter(
      (q) => q.category === selectedCategory && q.difficulty === selectedDifficulty
    );
    if (pool.length === 0) {
      alert("No questions in this category. Generate one with AI suggestions!");
      return;
    }
    
    // Sort randomly
    const randomized = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    setActiveQuestions(randomized);
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setTimeLeft(20);
    setQuizScore(0);
    setShowSummary(false);
    setIsQuizRunning(true);
  };

  const startAIQuiz = async () => {
    setAiGenerating(true);
    try {
      const generated = await onTriggerAISuggestion(selectedCategory);
      if (generated) {
        setActiveQuestions([generated]);
        setCurrentIdx(0);
        setSelectedOptionIdx(null);
        setIsAnswered(false);
        setTimeLeft(30); // More time for exciting AI conceptual queries
        setQuizScore(0);
        setShowSummary(false);
        setIsQuizRunning(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  // Timer Tick Trigger
  useEffect(() => {
    if (isQuizRunning && !isAnswered && !showSummary) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Auto fail question on timeout
            clearInterval(timerRef.current!);
            handleOptionSelect(-1); // Force failure flag
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isQuizRunning, isAnswered, currentIdx, showSummary]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOptionIdx(idx);
    setIsAnswered(true);

    const correctIdx = activeQuestions[currentIdx]?.correctIndex;
    if (idx === correctIdx) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
      setTimeLeft(20);
    } else {
      // Quiz finished
      setShowSummary(true);
      const totalPoints = quizScore * 20; // 20 points per correct answer
      onUpdateScore(totalPoints);
      
      const isPerfect = quizScore === activeQuestions.length;
      onLoggedActivity(
        `${selectedCategory} Quiz completed`, 
        `Score: ${quizScore}/${activeQuestions.length} (${isPerfect ? "Perfect" : "Normal"})`
      );
    }
  };

  const activeQuestion = activeQuestions[currentIdx];

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
      
      {!isQuizRunning && !showSummary ? (
        <div className="flex flex-col gap-4">
          
          {/* Dashboard Header */}
          <div className="bg-[#f472b6]/15 text-slate-950 rounded-xl p-4.5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5 font-display text-slate-900">
              <Zap className="h-5 w-5 text-yellow-500 fill-yellow-400 animate-pulse stroke-[2.5]" />
              Interactive MCQs Hub
            </h2>
            <p className="text-[11px] text-slate-700 font-extrabold mt-1">
              Test your knowledge, unlock achievement badges, and climb the leaderboard!
            </p>
          </div>

          {/* Selector grid */}
          <div className="bg-white p-4.5 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4">
            
            {/* Subject Select */}
            <div>
              <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider font-mono">
                Select Subject
              </label>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {Object.values(SubjectCategory).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2 px-1 rounded-xl font-black text-center border-2 truncate cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? "bg-[#fbbf24] text-slate-950 border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block text-[10px] font-black text-slate-900 mb-2 uppercase tracking-wider font-mono">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {Object.values(DifficultyLevel).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficulty(lvl)}
                    className={`py-2 px-3 rounded-xl font-black text-center border-2 cursor-pointer transition-all ${
                      selectedDifficulty === lvl
                        ? "bg-slate-900 text-white border-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2.5 text-[11px]">
              {/* Trigger standard Quiz */}
              <button
                onClick={startQuiz}
                className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider rounded-xl text-center cursor-pointer border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                Start Quiz (5 MCQs)
              </button>

              {/* Gemini Suggested AI Quiz */}
              <button
                onClick={startAIQuiz}
                disabled={aiGenerating}
                className="py-3 px-4 bg-[#a78bfa] hover:bg-[#906df0] text-slate-950 font-black uppercase tracking-tight rounded-xl flex items-center justify-center gap-1 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="h-4.5 w-4.5 stroke-[2.5]" />
                {aiGenerating ? "Generating..." : "AI Gemini MCQ"}
              </button>
            </div>

          </div>

          {/* Quick Performance Chart Visual */}
          <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-mono">
              <BarChart2 className="h-4.5 w-4.5 text-indigo-650 stroke-[2.5]" />
              Practice Analytics Stats
            </h3>
            
            <div className="flex justify-around text-center py-2.5 border-b-2 border-dashed border-slate-200 bg-[#faf9f5] border border-slate-900 p-2 rounded-xl">
              <div>
                <span className="text-[9px] text-slate-600 block font-black uppercase">XP Score</span>
                <span className="text-sm font-black text-slate-950 font-mono">🏆 {progress.score} PTS</span>
              </div>
              <div className="border-l-2 border-slate-900 h-8 self-center"></div>
              <div>
                <span className="text-[9px] text-slate-600 block font-black uppercase">Quizzes Completed</span>
                <span className="text-sm font-black text-slate-950 font-mono">✅ {progress.completedQuizzesCount}</span>
              </div>
            </div>

            {/* Custom SVG performance bar chart */}
            <div className="mt-4">
              <span className="text-[9px] uppercase font-mono text-slate-700 font-extrabold block mb-2">Subject Performance Analysis</span>
              <div className="flex gap-2 items-end justify-between h-20 pt-4 px-3 bg-indigo-50/40 rounded-xl border-2 border-slate-900">
                <div className="flex flex-col items-center gap-1 w-10">
                  <div className="w-5 bg-teal-300 border border-slate-900 rounded-t-sm" style={{ height: "45%" }}></div>
                  <span className="text-[9px] font-black uppercase text-slate-600">Science</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-10">
                  <div className="w-5 bg-indigo-400 border border-slate-900 rounded-t-sm" style={{ height: "65%" }}></div>
                  <span className="text-[9px] font-black uppercase text-slate-600">Math</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-10">
                  <div className="w-5 bg-pink-400 border border-slate-900 rounded-t-sm" style={{ height: "30%" }}></div>
                  <span className="text-[9px] font-black uppercase text-slate-600">English</span>
                </div>
                <div className="flex flex-col items-center gap-1 w-10">
                  <div className="w-5 bg-[#a78bfa] border border-slate-900 rounded-t-sm" style={{ height: "75%" }}></div>
                  <span className="text-[9px] font-black uppercase text-[#8b5cf6]">AI Gen</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : showSummary ? (
        /* Summary view */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl border-2 border-slate-900 text-center flex flex-col items-center gap-4.5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"
        >
          <div className="w-16 h-16 bg-yellow-100 text-slate-900 border-2 border-slate-900 flex items-center justify-center rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <Award className="h-9 w-9 stroke-[2.5] animate-bounce" />
          </div>

          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Quiz Completed!</h2>
          
          <div className="p-4 bg-yellow-100 border-2 border-slate-900 rounded-xl w-full">
            <span className="text-[10px] text-slate-800 block font-black uppercase tracking-wider font-mono">Answers breakdown</span>
            <span className="text-lg font-black text-slate-950 font-mono mt-1 block">
              💡 {quizScore} / {activeQuestions.length} Correct Answers
            </span>
            <span className="text-xs text-indigo-700 font-extrabold block mt-2 font-mono">
              ★ Score gain: +{quizScore * 20} Student Points!
            </span>
          </div>

          <p className="text-xs text-slate-600 font-bold leading-normal px-2">
            Excellent! Consistent quiz practices build great reflex questions answering routines before primary tests.
          </p>

          <button
            onClick={() => {
              setIsQuizRunning(false);
              setShowSummary(false);
            }}
            className="w-full py-3 bg-[#fbbf24] hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer mt-2"
          >
            Back to Select Screen
          </button>
        </motion.div>
      ) : (
        /* Questionnaire active screen */
        <div className="flex flex-col gap-4">
          
          {/* Header tracker */}
          <div className="flex justify-between items-center bg-[#faf9f5] border-2 border-slate-900 p-3.5 rounded-xl text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <span className="text-slate-800 text-[11px]">
              Question <strong className="bg-[#fbbf24] border border-slate-900 px-2 py-0.5 rounded-sm">{currentIdx + 1}</strong> of {activeQuestions.length}
            </span>
            
            {/* Timer circle/progress */}
            <div className="flex items-center gap-1.5 text-slate-900 font-black font-mono text-xs">
              <Timer className={`h-4.5 w-4.5 stroke-[2.5] ${timeLeft <= 5 ? "text-rose-500 animate-spin" : "text-slate-900"}`} />
              <span className={timeLeft <= 5 ? "text-rose-600 bg-rose-100 border border-slate-900 px-1.5 py-0.2 rounded-xs" : ""}>{timeLeft}S</span>
            </div>
          </div>

          {/* Time Out overlay warning */}
          {timeLeft === 0 && (
            <div className="p-3 bg-rose-100 border-2 border-slate-900 rounded-xl text-rose-950 text-xs font-black flex items-center gap-1.5 animate-pulse">
              <AlertTriangle className="h-4.5 w-4.5 stroke-[2.5]" />
              Question timed out! Marked wrong automatically.
            </div>
          )}

          {/* Question Text */}
          <div className="bg-slate-900 text-white p-5 border-2 border-slate-950 rounded-xl min-h-[100px] flex items-center shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xs font-black uppercase tracking-wide leading-relaxed">{activeQuestion?.question}</h3>
          </div>

          {/* Answer Option List */}
          <div className="flex flex-col gap-3">
            {activeQuestion?.options.map((opt, idx) => {
              const correctIdx = activeQuestion.correctIndex;
              const isSelected = selectedOptionIdx === idx;
              
              // Color parameters
              let cardStyle = "border-slate-900 bg-white text-slate-900 hover:bg-slate-50";
              let iconElement = null;

              if (isAnswered) {
                if (correctIdx === idx) {
                  // highlight the right one green
                  cardStyle = "border-emerald-500 bg-emerald-100 text-emerald-950 shadow-none font-black translate-x-[1px] translate-y-[1px]";
                  iconElement = <Check className="h-4 w-4 text-emerald-700 stroke-[3]" />;
                } else if (isSelected) {
                  // highlight the selected wrong one red
                  cardStyle = "border-rose-500 bg-rose-100 text-rose-950 shadow-none font-black translate-x-[1px] translate-y-[1px]";
                  iconElement = <X className="h-4 w-4 text-rose-700 stroke-[3]" />;
                } else {
                  cardStyle = "border-slate-200 bg-white/70 text-slate-400 opacity-60 shadow-none";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleOptionSelect(idx)}
                  className={`w-full p-3.5 border-2 rounded-xl flex justify-between items-center text-xs text-left cursor-pointer transition-all shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-0.5px] font-extrabold ${cardStyle}`}
                >
                  <span>{opt}</span>
                  {iconElement}
                </button>
              );
            })}
          </div>

          {/* Interactive instant explanation block */}
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-yellow-50 rounded-xl border-2 border-slate-900 text-xs font-bold text-slate-900"
            >
              <h4 className="font-extrabold text-slate-950 flex items-center gap-1 mb-1 font-mono uppercase tracking-tight">
                <ShieldCheck className="h-4 w-4 text-emerald-750 stroke-[2.5]" />
                Answer Explanation:
              </h4>
              <p className="text-slate-700 leading-normal">
                {activeQuestion?.explanation || "This answer is verified based on modern syllabus curriculum guidelines."}
              </p>
            </motion.div>
          )}

          {/* Continue button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 bg-[#a78bfa] hover:bg-[#906df0] text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#000] cursor-pointer transition-all"
            >
              {currentIdx === activeQuestions.length - 1 ? "Finish quiz" : "Next question"}
            </button>
          )}

        </div>
      )}

    </div>
  );
}
