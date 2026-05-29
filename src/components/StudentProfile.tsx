import React, { useState } from "react";
import { 
  User, Award, Flame, BookOpen, Clock, CheckSquare, Sparkles, 
  Mic, MicOff, Search, ChevronRight, CheckCircle2 
} from "lucide-react";
import { UserProfile, UserProgress } from "../types";
import { STUDY_BADGES } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";

interface StudentProfileProps {
  profile: UserProfile;
  progress: UserProgress;
  onVoiceStudyTrigger: (resolvedTerm: string) => void;
  preferredLanguage: string;
}

export default function StudentProfile({
  profile,
  progress,
  onVoiceStudyTrigger,
  preferredLanguage
}: StudentProfileProps) {
  const [isListening, setIsListening] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [listeningFeedback, setListeningFeedback] = useState("");

  const handleTriggerVoiceCap = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice speech recognition is not supported in this browser. Try Chrome/Edge or type your study term.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = preferredLanguage === "Nepali" ? "ne-NP" : "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningFeedback("Listening closely... Speak your subject query (e.g., Photosynthesis)");
    };

    recognition.onerror = (e: any) => {
      console.error(e);
      setListeningFeedback("Could not recognize. Please try again in an area with low background noise.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const vocalStr = event.results[0][0].transcript;
      setVoiceQuery(vocalStr);
      setListeningFeedback(`Synthesized speaking: "${vocalStr}"`);
      setTimeout(() => {
        onVoiceStudyTrigger(vocalStr);
      }, 1000);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
      
      {/* Student Profile Card Header */}
      <div className="bg-linear-to-tr from-indigo-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md flex items-center gap-4 border border-indigo-950">
        <img 
          src={profile.profilePic || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Priscilla"} 
          alt={profile.name} 
          className="w-14 h-14 rounded-full bg-indigo-800 p-1 shrink-0 border border-indigo-700 shadow-inner"
          referrerPolicy="no-referrer"
        />

        <div>
          <h2 className="text-base font-extrabold tracking-tight">{profile.name}</h2>
          <span className="text-[10px] text-indigo-300 font-mono tracking-wider block mt-0.5">{profile.email}</span>
          <span className="text-[10px] bg-indigo-900/60 text-indigo-200 border border-indigo-850 px-2 py-0.5 rounded-md inline-block mt-1.5 font-medium">
            🏫 {profile.schoolName}
          </span>
        </div>
      </div>

      {/* Voice Assistant Module */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
          <Mic className="h-4 w-4 text-indigo-500 animate-pulse" />
          Smart Voice Study Search
        </h3>
        
        <p className="text-[10px] text-slate-500 mb-3">
          Too tired to type? Tap the microphone and say **Newton**, **Photosynthesis**, or **Math** to find matching notes instantly!
        </p>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={handleTriggerVoiceCap}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-3xs ${
              isListening 
                ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? "Listening..." : "Speak Study Query"}
          </button>

          {voiceQuery && (
            <div className="flex-1 bg-slate-50 p-2 border rounded-lg text-[11px] text-slate-700 font-semibold truncate">
              📢 Found word: "{voiceQuery}"
            </div>
          )}
        </div>

        {listeningFeedback && (
          <span className="text-[9px] text-slate-400 block mt-2 font-mono">
            {listeningFeedback}
          </span>
        )}
      </div>

      {/* Cumulative Stats Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner shrink-0">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] block text-slate-400">Total Streak</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{progress.streakDays} Days</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] block text-slate-400">XP Points</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{progress.score} pts</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] block text-slate-400">Read Modules</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{progress.completedNotesCount} Modules</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] block text-slate-400">Study Time</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{progress.studyTimeMinutes} min</span>
          </div>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5 pb-2 border-b border-slate-100">
          <Award className="h-4.5 w-4.5 text-indigo-600" />
          Unlocked Achievement Badges ({progress.badges.length})
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {STUDY_BADGES.map((b) => {
            const isUnlocked = progress.badges.some((ub) => ub.id === b.id);
            return (
              <div 
                key={b.id}
                className={`p-2.5 border rounded-xl flex gap-2.5 items-center transition-all ${
                  isUnlocked 
                    ? "border-emerald-200 bg-emerald-50/40 text-slate-700" 
                    : "border-slate-100 bg-slate-50 opacity-55 text-slate-400"
                }`}
              >
                {/* Visual badge token lock screen representation */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                  isUnlocked 
                    ? "bg-emerald-600 text-white border-emerald-500" 
                    : "bg-slate-200 text-slate-400 border-slate-300"
                }`}>
                  <Award className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-extrabold truncate leading-tight">{b.title}</h4>
                  <p className="text-[8px] text-slate-500 mt-0.5 truncate">{b.description}</p>
                  {isUnlocked && (
                    <span className="text-[7px] text-emerald-600 font-bold block font-mono mt-0.5">Unlocked!</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
