/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, BookOpen, Award, Tv, MessageSquare, 
  Settings as SettingsIcon, User, Signal, Wifi, Battery, Menu, Bell
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { 
  SubjectCategory, MCQQuestion, StudyNote, EducationalVideo, 
  UserProfile, UserProgress, SavedActivity 
} from "./types";

import { 
  INITIAL_STUDY_NOTES, INITIAL_MCQS, INITIAL_VIDEOS, 
  INITIAL_LEADERBOARD, STUDY_BADGES 
} from "./data/mockData";

import SplashView from "./components/SplashView";
import LoginView from "./components/LoginView";
import HomeDashboard from "./components/HomeDashboard";
import NotesSection from "./components/NotesSection";
import MCQSection from "./components/MCQSection";
import VideoSection from "./components/VideoSection";
import AIChatBot from "./components/AIChatBot";
import AdminPanel from "./components/AdminPanel";
import StudentProfile from "./components/StudentProfile";
import SettingsView from "./components/SettingsView";

export default function App() {
  // Application phase control states
  const [showSplash, setShowSplash] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");

  // Dynamic lists from mock merged with custom Persisted state
  const [notes, setNotes] = useState<StudyNote[]>(INITIAL_STUDY_NOTES);
  const [quizzes, setQuizzes] = useState<MCQQuestion[]>(INITIAL_MCQS);
  const [videos, setVideos] = useState<EducationalVideo[]>(INITIAL_VIDEOS);

  // Student specific logged parameters
  const [userProgress, setUserProgress] = useState<UserProgress>({
    score: 180,
    studyTimeMinutes: 5,
    completedQuizzesCount: 2,
    completedNotesCount: 1,
    streakDays: 2,
    badges: [STUDY_BADGES[0], STUDY_BADGES[1]] // unlocked basic badges early
  });

  const [bookmarkedNoteIds, setBookmarkedNoteIds] = useState<string[]>([]);
  const [favoriteVideoIds, setFavoriteVideoIds] = useState<string[]>([]);
  const [watchedVideoIds, setWatchedVideoIds] = useState<string[]>([]);
  const [recentActivities, setRecentActivities] = useState<SavedActivity[]>([]);

  // Filtering shortcuts
  const [activeNoteCategoryFilter, setActiveNoteCategoryFilter] = useState<SubjectCategory | null>(null);

  // Synchronize state from API server of admin custom notes on mount
  useEffect(() => {
    async function syncCustomData() {
      try {
        const res = await fetch("/api/custom-data");
        if (res.ok) {
          const data = await res.json();
          
          if (data.customNotes && data.customNotes.length > 0) {
            setNotes((prev) => [...data.customNotes, ...prev]);
          }
          if (data.customQuizzes && data.customQuizzes.length > 0) {
            setQuizzes((prev) => [...data.customQuizzes, ...prev]);
          }
          if (data.customVideos && data.customVideos.length > 0) {
            setVideos((prev) => [...data.customVideos, ...prev]);
          }
          if (data.studentActivities && data.studentActivities.length > 0) {
            setRecentActivities(data.studentActivities);
          }
        }
      } catch (err) {
        console.warn("API server loading deferred. Relying on baseline datasets.", err);
      }
    }
    syncCustomData();
  }, []);

  // Sync user completed action of saving logs to backend
  const logStudentActivity = async (title: string, meta: string, type: "quiz" | "note" | "video") => {
    const act: SavedActivity = {
      id: "act-" + Date.now(),
      type,
      title,
      meta,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setRecentActivities((prev) => [act, ...prev].slice(0, 30));

    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(act)
      });
    } catch (e) {
      console.warn("Storage syncing is maintained locally.", e);
    }
  };

  // Triggering score mutations
  const handleScoreMutation = async (pointsEarned: number) => {
    if (!profile) return;
    
    setUserProgress((prev) => {
      const incrementedScore = prev.score + pointsEarned;
      const completedNotesCount = prev.completedNotesCount;
      const quizzesIncremented = prev.completedQuizzesCount + 1;
      const streakDays = prev.streakDays;

      // Unlocking badges based on score limits
      let unlocked = [...prev.badges];
      
      const perfectCheck = STUDY_BADGES[2]; // Brainiac
      if (pointsEarned === 100 && !unlocked.some(b => b.id === perfectCheck.id)) {
        unlocked.push(perfectCheck);
      }

      const noteDevourerBadge = STUDY_BADGES[3]; // Note Devourer
      if (completedNotesCount >= 3 && !unlocked.some(b => b.id === noteDevourerBadge.id)) {
        unlocked.push(noteDevourerBadge);
      }

      return {
        ...prev,
        score: incrementedScore,
        completedQuizzesCount: quizzesIncremented,
        badges: unlocked
      };
    });

    // Notify backend
    try {
      await fetch("/api/update-leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: profile.uid,
          name: profile.name,
          score: userProgress.score + pointsEarned
        })
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const logReadModule = (noteId: string, title: string) => {
    setUserProgress((prev) => {
      const updatedNotesCount = prev.completedNotesCount + 1;
      const studyTime = prev.studyTimeMinutes + 5; // Adds static 5 minutes per note read
      return {
        ...prev,
        completedNotesCount: updatedNotesCount,
        studyTimeMinutes: studyTime
      };
    });
    logStudentActivity(`Read Notes: ${title}`, "5 min Study Session", "note");
  };

  const logWatchedLesson = (videoId: string, title: string) => {
    if (!watchedVideoIds.includes(videoId)) {
      setWatchedVideoIds((prev) => [...prev, videoId]);
    }
    logStudentActivity(`Watched Video: ${title}`, "Lesson Player Session", "video");
  };

  // Injections for Admin custom content persistence
  const handleInsertCustomNote = async (newNote: StudyNote): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-data/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote)
      });
      if (res.ok) {
        setNotes((prev) => [newNote, ...prev]);
        logStudentActivity(`Admin added note: ${newNote.title}`, "Curriculum Update", "note");
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback if offline
    setNotes((prev) => [newNote, ...prev]);
    return true;
  };

  const handleInsertCustomQuiz = async (newQuiz: MCQQuestion): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-data/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuiz)
      });
      if (res.ok) {
        setQuizzes((prev) => [newQuiz, ...prev]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback if offline
    setQuizzes((prev) => [newQuiz, ...prev]);
    return true;
  };

  const handleInsertCustomVideo = async (newVideo: EducationalVideo): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-data/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo)
      });
      if (res.ok) {
        setVideos((prev) => [newVideo, ...prev]);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback if offline
    setVideos((prev) => [newVideo, ...prev]);
    return true;
  };

  const handleTriggerAISuggestion = async (category: SubjectCategory): Promise<MCQQuestion | null> => {
    try {
      const res = await fetch("/api/gemini/suggest-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          currentScore: userProgress.score,
          language: profile?.preferredLanguage || "English"
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          const generatedQuiz: MCQQuestion = {
            id: "ai-mcq-" + Date.now(),
            category,
            difficulty: "Medium" as any,
            question: data.question.question,
            options: data.question.options,
            correctIndex: data.question.correctIndex,
            explanation: data.question.explanation
          };
          
          setUserProgress((prev) => {
            const list = [...prev.badges];
            if (!list.some(b => b.id === "badge-ai-help")) {
              list.push(STUDY_BADGES[4]); // Curious Minds badge unlocked for AI usage!
            }
            return { ...prev, badges: list };
          });

          return generatedQuiz;
        }
      }
    } catch (e) {
      console.warn("AI suggesting error: ", e);
    }
    return null;
  };

  // Navigating to corresponding Notes section when clicked in Home Dashboard
  const handleCategoryShortcut = (categoryName: SubjectCategory) => {
    setActiveNoteCategoryFilter(categoryName);
    setActiveTab("notes");
  };

  // Voice Recognition search trigger in Profile Roster
  const handleVoiceQueryActivation = (searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    
    if (term.includes("science") || term.includes("bio") || term.includes("photo")) {
      setActiveNoteCategoryFilter(SubjectCategory.SCIENCE);
      setActiveTab("notes");
    } else if (term.includes("math") || term.includes("formula") || term.includes("quadratic")) {
      setActiveNoteCategoryFilter(SubjectCategory.MATH);
      setActiveTab("notes");
    } else if (term.includes("code") || term.includes("computer") || term.includes("dbms")) {
      setActiveNoteCategoryFilter(SubjectCategory.COMPUTER);
      setActiveTab("notes");
    } else if (term.includes("english") || term.includes("grammar") || term.includes("voice")) {
      setActiveNoteCategoryFilter(SubjectCategory.ENGLISH);
      setActiveTab("notes");
    } else if (term.includes("nepal") || term.includes("gk") || term.includes("geography")) {
      setActiveNoteCategoryFilter(SubjectCategory.GK);
      setActiveTab("notes");
    } else {
      setActiveTab("notes");
    }
  };

  // Safety net reset
  const handleResetProgressData = () => {
    setUserProgress({
      score: 0,
      studyTimeMinutes: 0,
      completedQuizzesCount: 0,
      completedNotesCount: 0,
      streakDays: 1,
      badges: [STUDY_BADGES[0]]
    });
    setBookmarkedNoteIds([]);
    setFavoriteVideoIds([]);
    setWatchedVideoIds([]);
    setRecentActivities([]);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-linear-to-tr from-slate-900 via-indigo-950 to-slate-900 p-0 sm:p-4 select-none">
      
      {/* Outer Phone Frame bezel container */}
      <div className="relative bg-black w-full h-full sm:max-w-[412px] sm:max-h-[824px] sm:rounded-[36px] sm:shadow-2xl overflow-hidden flex flex-col border-4 border-slate-800">
        
        {/* Notch / Speaker mesh overlay representation */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 bg-black h-5 w-32 rounded-b-xl z-50">
          <div className="w-10 h-1 bg-neutral-800 mx-auto rounded-full mt-1"></div>
        </div>

        {/* Dynamic Mobile OS status panel bar */}
        <div className="bg-slate-950 text-white text-[10px] px-5 pt-3.5 pb-1 flex justify-between items-center select-none font-mono font-bold tracking-wide z-10">
          <span>09:41 AM</span>
          <div className="flex items-center gap-1.5 opacity-85">
            <Signal className="h-3 w-3 text-emerald-400" />
            <Wifi className="h-3 w-3 text-emerald-400" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px]">92%</span>
              <Battery className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen/Bezel Frame content canvas wrapper */}
        <div className="flex-1 bg-slate-50 relative flex flex-col overflow-hidden">
          
          <AnimatePresence mode="wait">
            {showSplash ? (
              <motion.div 
                key="splash" 
                initial={{ opacity: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-45"
              >
                <SplashView onDismiss={() => setShowSplash(false)} />
              </motion.div>
            ) : !profile ? (
              <motion.div 
                key="login" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40"
              >
                <LoginView onLoginSuccess={(prof) => setProfile(prof)} />
              </motion.div>
            ) : (
              <motion.div 
                key="main-app" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col h-full bg-slate-50"
              >
                {/* Header Banner representing the Android Navigation brand line */}
                <header className="bg-[#fbbf24] px-4 py-3 text-slate-900 flex justify-between items-center border-b-[2.5px] border-slate-900 select-none">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5.5 w-5.5 text-slate-900 stroke-[2.5]" />
                    <span className="font-black text-sm tracking-tighter uppercase font-display text-slate-900">Smart Study Hub</span>
                  </div>
                  
                  {/* Quick Shortcut toggle */}
                  <span className="text-[9.5px] bg-slate-900 text-white font-extrabold px-2.5 py-0.5 rounded-sm uppercase tracking-wider font-mono border border-slate-900">
                    Nepali/Eng App
                  </span>
                </header>

                {/* Sub routing screen panel router */}
                <div className="flex-1 overflow-hidden">
                  {activeTab === "home" && (
                    <HomeDashboard
                      profile={profile}
                      progress={userProgress}
                      recentActivities={recentActivities}
                      onSelectCategory={handleCategoryShortcut}
                      onNavigateToTab={(tab) => setActiveTab(tab)}
                      onTriggerQuickQuiz={() => setActiveTab("mcq")}
                    />
                  )}

                  {activeTab === "notes" && (
                    <NotesSection
                      profile={profile}
                      notes={notes}
                      bookmarkedIds={bookmarkedNoteIds}
                      onToggleBookmark={(id) => {
                        setBookmarkedNoteIds((prev) => 
                          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                        );
                      }}
                      onLoggedRead={logReadModule}
                      selectedCategoryName={activeNoteCategoryFilter}
                      onClearCategoryFilter={() => setActiveNoteCategoryFilter(null)}
                    />
                  )}

                  {activeTab === "mcq" && (
                    <MCQSection
                      questions={quizzes}
                      progress={userProgress}
                      onUpdateScore={handleScoreMutation}
                      onLoggedActivity={(t, m) => logStudentActivity(t, m, "quiz")}
                      onTriggerAISuggestion={handleTriggerAISuggestion}
                      preferredLanguage={profile.preferredLanguage}
                    />
                  )}

                  {activeTab === "video" && (
                    <VideoSection
                      profile={profile}
                      videos={videos}
                      favoriteIds={favoriteVideoIds}
                      watchHistory={watchedVideoIds}
                      onToggleFavoriteVideo={(id) => {
                        setFavoriteVideoIds((prev) => 
                          prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                        );
                      }}
                      onLoggedWatch={logWatchedLesson}
                    />
                  )}

                  {activeTab === "ai-tutor" && (
                    <AIChatBot
                      preferredLanguage={profile.preferredLanguage}
                      score={userProgress.score}
                      onLoggedActivity={(t, m) => logStudentActivity(t, m, "note")}
                      onInsertCustomQuiz={handleInsertCustomQuiz}
                    />
                  )}

                  {activeTab === "admin" && (
                    <AdminPanel
                      onInsertCustomNote={handleInsertCustomNote}
                      onInsertCustomQuiz={handleInsertCustomQuiz}
                      onInsertCustomVideo={handleInsertCustomVideo}
                    />
                  )}

                  {activeTab === "profile" && (
                    <StudentProfile
                      profile={profile}
                      progress={userProgress}
                      onVoiceStudyTrigger={handleVoiceQueryActivation}
                      preferredLanguage={profile.preferredLanguage}
                    />
                  )}

                  {activeTab === "settings" && (
                    <SettingsView
                      profile={profile}
                      onChangeLanguage={(lang) => {
                        const updated = { ...profile, preferredLanguage: lang };
                        setProfile(updated);
                      }}
                      onResetProgress={handleResetProgressData}
                    />
                  )}
                </div>

                {/* Android Standard style bottom tabbed controller bar */}
                <nav className="bg-white border-t-[2.5px] border-slate-900 px-1 py-1.5 flex justify-around items-center select-none z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
                  <button
                    onClick={() => setActiveTab("home")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "home" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <GraduationCap className={`h-5 w-5 ${activeTab === "home" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Home</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("notes")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "notes" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <BookOpen className={`h-5 w-5 ${activeTab === "notes" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Notes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mcq")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "mcq" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <Award className={`h-5 w-5 ${activeTab === "mcq" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Practice</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("video")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "video" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <Tv className={`h-5 w-5 ${activeTab === "video" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Videos</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("ai-tutor")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "ai-tutor" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <MessageSquare className={`h-5 w-5 ${activeTab === "ai-tutor" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Tutor</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "profile" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <User className={`h-5 w-5 ${activeTab === "profile" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("admin")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "admin" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <SettingsIcon className={`h-5 w-5 ${activeTab === "admin" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">Admin</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex flex-col items-center p-1.5 rounded-md cursor-pointer transition-all ${
                      activeTab === "settings" 
                        ? "text-indigo-600 font-extrabold translate-y-[-1px] scale-102" 
                        : "text-slate-500 font-bold hover:text-slate-800"
                    }`}
                  >
                    <Menu className={`h-5 w-5 ${activeTab === "settings" ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                    <span className="text-[8.5px] mt-0.5 tracking-tight">More</span>
                  </button>
                </nav>

                {/* Developer Footer */}
                <div className="bg-slate-950 text-[#faf9f5] py-2 px-4 text-center text-[7.5px] sm:text-[8px] uppercase font-black tracking-widest font-mono select-none border-t-2 border-slate-900">
                  Developed by <span className="text-[#fbbf24] font-bold">Unite Network Technology PVT. LTD.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Android Solid navigational line mockup representation in bottom bezel margin */}
        <div className="hidden sm:block bg-black h-4 pb-1.5">
          <div className="w-24 h-1 bg-white/70 mx-auto rounded-full"></div>
        </div>

      </div>

    </div>
  );
}
