import React, { useState } from "react";
import { 
  Flame, Award, BookOpen, MessageSquareCode, 
  ChevronRight, Calendar, ArrowUpRight, GraduationCap, 
  BellRing, BellOff, CheckCircle2, History 
} from "lucide-react";
import { UserProfile, UserProgress, SavedActivity, SubjectCategory } from "../types";
import { motion } from "motion/react";

interface HomeDashboardProps {
  profile: UserProfile;
  progress: UserProgress;
  recentActivities: SavedActivity[];
  onSelectCategory: (category: SubjectCategory) => void;
  onNavigateToTab: (tabName: string) => void;
  onTriggerQuickQuiz: () => void;
}

export default function HomeDashboard({
  profile,
  progress,
  recentActivities,
  onSelectCategory,
  onNavigateToTab,
  onTriggerQuickQuiz
}: HomeDashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Real-time motivational greeting based on hour
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return profile.preferredLanguage === "Nepali" ? "शुभ प्रभात ☀️" : "Good Morning,";
    if (hr < 17) return profile.preferredLanguage === "Nepali" ? "शुभ दिउँसो 🌤️" : "Good Afternoon,";
    return profile.preferredLanguage === "Nepali" ? "शुभ साँझ 🌙" : "Good Evening,";
  };

  const categories = [
    { name: SubjectCategory.SCIENCE, count: "2 notes • 3 quizzes", color: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50", emoji: "🔬" },
    { name: SubjectCategory.MATH, count: "2 notes • 3 quizzes", color: "from-blue-500 to-indigo-600", bgLight: "bg-blue-50", emoji: "📐" },
    { name: SubjectCategory.COMPUTER, count: "2 notes • 3 quizzes", color: "from-fuchsia-500 to-pink-600", bgLight: "bg-fuchsia-50", emoji: "💻" },
    { name: SubjectCategory.ENGLISH, count: "1 notes • 3 quizzes", color: "from-amber-500 to-orange-600", bgLight: "bg-amber-50", emoji: "🔤" },
    { name: SubjectCategory.GK, count: "1 notes • 3 quizzes", color: "from-violet-500 to-purple-600", bgLight: "bg-violet-50", emoji: "🌏" },
  ];

  const suggestedDailyGoalPct = Math.min(Math.round((progress.studyTimeMinutes / profile.dailyGoalMinutes) * 100), 100);

  // Simulated dynamic education system alerts
  const appNotifications = [
    { id: "not-1", text: "🔥 You are on a study streak! Keep it active today.", time: "Just now" },
    { id: "not-2", text: "📚 Admin added new note: 'Ecosystems and Geography of Nepal'", time: "2 hrs ago" },
    { id: "not-3", text: "🧠 Practice Quiz Suggestion based on your errors is ready.", time: "1 day ago" }
  ];

  return (
    <div className="flex flex-col gap-5 p-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none bg-[#faf9f5]">
      
      {/* Alert Ribbon / System notification toggle */}
      <div className="flex items-center justify-between bg-emerald-100 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-900 animate-pulse"></span>
          <span className="font-extrabold tracking-tight">
            {profile.preferredLanguage === "Nepali" 
              ? "स्मार्ट अध्ययन हबमा स्वागत छ!" 
              : "SMART STUDY SYSTEM ONLINE"
            }
          </span>
        </div>
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-1 bg-white hover:bg-slate-100 border border-slate-900 rounded-md transition-colors cursor-pointer"
        >
          <BellRing className="h-4 w-4 text-slate-900" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 border border-slate-900 animate-bounce"></span>
        </button>
      </div>

      {/* Notifications Drawer Toggle */}
      {showNotifications && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-slate-900 rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-2"
        >
          <div className="flex justify-between items-center pb-2 border-b-2 border-slate-100">
            <span className="font-black text-xs text-slate-950 flex items-center gap-1.5 uppercase tracking-tight">
              <span className="bg-yellow-300 px-1.5 py-0.5 rounded-xs border border-slate-900">🔔</span> Alerts Ledger
            </span>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-[10px] bg-rose-200 border border-slate-900 text-slate-900 font-extrabold px-1.5 py-0.5 rounded-sm hover:bg-rose-300"
            >
              CLOSE
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {appNotifications.map((not) => (
              <div key={not.id} className="py-2 text-[11px] text-slate-800">
                <p className="font-bold">{not.text}</p>
                <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{not.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* User Greeting & Quick Stats */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10.5px] text-indigo-600 bg-indigo-50 border border-slate-900 px-2 py-0.5 rounded-full font-black tracking-tighter uppercase font-mono block w-fit">
            {getGreeting()}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none mt-2">
            {profile.name} <span className="inline-block animate-wave">👋</span>
          </h2>
          <span className="text-[10px] bg-slate-900 border border-slate-900 px-2 py-0.5 rounded-sm text-yellow-300 font-black uppercase tracking-wider inline-block mt-1 font-mono">
            SCHOOL: {profile.schoolName}
          </span>
        </div>

        {/* Study Streak Counter Widget */}
        <div className="bg-amber-300 border-2 border-slate-900 rounded-xl px-3 py-1.5 text-slate-900 flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
          <Flame className="h-5 w-5 text-red-600 fill-red-600 animate-pulse stroke-[2]" />
          <div className="text-right">
            <span className="text-[8.5px] uppercase font-black tracking-widest block text-slate-900 leading-none">Streak</span>
            <span className="text-xs font-black font-mono text-slate-900">{progress.streakDays} DAYS</span>
          </div>
        </div>
      </div>

      {/* Daily Study Goal Tracker */}
      <div className="bg-slate-900 text-white rounded-xl p-4 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-pink-400 stroke-[2.5]" />
            {profile.preferredLanguage === "Nepali" ? "दैनिक लक्ष्य" : "DAILY LEARNING GOAL"}
          </span>
          <span className="text-xs font-black font-mono text-pink-400 bg-white/10 px-2 py-0.5 rounded-sm border border-white/20">
            {progress.studyTimeMinutes} / {profile.dailyGoalMinutes} MIN
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-950 mb-3">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: `${suggestedDailyGoalPct}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-linear-to-r from-pink-500 via-rose-500 to-amber-400 rounded-full"
          />
        </div>

        <div className="flex justify-between text-[11px] font-extrabold text-slate-200">
          <span className="font-mono tracking-tight text-white uppercase bg-pink-600 px-1.5 py-0.2 text-[9.5px] border border-slate-950">{suggestedDailyGoalPct}% Completed</span>
          <button 
            onClick={() => onNavigateToTab("notes")}
            className="text-yellow-300 font-extrabold hover:underline flex items-center gap-0.5 cursor-pointer uppercase text-[10px] tracking-tight"
          >
            Study Notes <ChevronRight className="h-3 w-3 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* Educational Categories */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">
            {profile.preferredLanguage === "Nepali" ? "अध्ययन विषयहरू" : "Browse Subject Notes"}
          </h3>
          <span className="text-[9.5px] text-slate-900 font-black bg-yellow-300 border border-slate-900 px-2 py-0.5 rounded-md">5 SUBJECTS</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => (
            <motion.div
              whileHover={{ y: -1 }}
              key={idx}
              onClick={() => onSelectCategory(cat.name)}
              className="bg-white p-3 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] rounded-xl hover:bg-slate-50 cursor-pointer flex flex-col justify-between h-24 transition-all"
            >
              <div className="flex justify-between items-start">
                <span className="text-lg bg-yellow-100 p-1 rounded-md border border-slate-900 font-bold">{cat.emoji}</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-800 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-[11.5px] font-black text-slate-950 tracking-tighter uppercase leading-none">{cat.name}</h4>
                <p className="text-[9px] text-slate-500 font-extrabold font-mono mt-1 uppercase">{cat.count}</p>
              </div>
            </motion.div>
          ))}
          
          {/* AI generated practice card */}
          <div 
            onClick={onTriggerQuickQuiz}
            className="col-span-2 bg-[#f472b6]/10 hover:bg-[#f472b6]/15 border-2 border-slate-900 rounded-xl p-3.5 flex items-center justify-between cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl bg-white p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 flex items-center justify-center">🧠</span>
              <div>
                <h4 className="text-xs font-black text-slate-950 uppercase tracking-tight group-hover:text-indigo-650 transition-colors">
                  AI Practice Spark Suggester
                </h4>
                <p className="text-[9.5px] text-slate-700 font-bold mt-0.5">
                  Generate adaptive MCQ suggestions with Gemini AI
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-4.5 w-4.5 text-slate-900 stroke-[3] font-black" />
          </div>
        </div>
      </div>

      {/* Main Stats Hub Quick Summary */}
      <div className="bg-white p-4 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-3 font-mono flex items-center gap-1.5">
          <Award className="h-4.5 w-4.5 text-indigo-600 stroke-[2.5]" /> Student Scorecard
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-yellow-100 border border-slate-900 rounded-lg">
            <span className="text-[9px] text-slate-700 block font-black uppercase tracking-tight">MCQ SCORE</span>
            <span className="text-xs font-black text-slate-950 font-mono">🏆 {progress.score} PTS</span>
          </div>
          <div className="p-2 bg-emerald-100 border border-slate-900 rounded-lg">
            <span className="text-[9px] text-slate-700 block font-black uppercase tracking-tight">QUIZZES</span>
            <span className="text-xs font-black text-slate-950 font-mono">✅ {progress.completedQuizzesCount}</span>
          </div>
          <div className="p-2 bg-pink-100 border border-slate-900 rounded-lg">
            <span className="text-[9px] text-slate-700 block font-black uppercase tracking-tight">BADGES</span>
            <span className="text-xs font-black text-slate-950 font-mono">🏅 {progress.badges.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="bg-white p-4 border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex justify-between items-center pb-2 border-b-2 border-slate-950 mb-3">
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-tight flex items-center gap-1.5 font-sans">
            <History className="h-3.5 w-3.5 text-indigo-600 stroke-[2.5]" />
            {profile.preferredLanguage === "Nepali" ? "भर्खरको गतिविधि" : "Study Log Ledger"}
          </h3>
          <span className="text-[9px] bg-slate-900 text-yellow-300 font-mono font-extrabold px-1.5 py-0.5 rounded-xs">PAST 4</span>
        </div>

        {recentActivities.length === 0 ? (
          <div className="text-center py-4 text-xs font-bold text-slate-500">
            No study sessions logged yet. Pick any note above to learn!
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {recentActivities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="flex justify-between items-center text-xs pb-1.5 border-b border-dashed border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 stroke-[2.5] shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-[11px] truncate max-w-[150px]">
                      {activity.title}
                    </span>
                    <span className="text-[9px] bg-slate-100 border border-slate-200 px-1 py-0.2 uppercase font-black text-slate-600 font-mono">
                      {activity.type.toLowerCase()} • {activity.meta}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-500">{activity.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
