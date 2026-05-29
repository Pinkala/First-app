import React, { useState } from "react";
import { 
  PlusCircle, BookOpen, Video, HelpCircle, Users, Check, AlertCircle, 
  Wrench, Save, RefreshCw, BarChart2, Award, ArrowRight 
} from "lucide-react";
import { SubjectCategory, DifficultyLevel } from "../types";
import { motion } from "motion/react";

interface AdminPanelProps {
  onInsertCustomNote: (n: any) => Promise<boolean>;
  onInsertCustomQuiz: (q: any) => Promise<boolean>;
  onInsertCustomVideo: (v: any) => Promise<boolean>;
}

export default function AdminPanel({
  onInsertCustomNote,
  onInsertCustomQuiz,
  onInsertCustomVideo
}: AdminPanelProps) {
  const [activeSegment, setActiveSegment] = useState<"notes" | "mcqs" | "videos" | "students">("notes");
  const [statusMsg, setStatusMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Form states - Notes
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCategory, setNoteCategory] = useState<SubjectCategory>(SubjectCategory.SCIENCE);
  const [noteTime, setNoteTime] = useState<number>(5);
  const [noteContent, setNoteContent] = useState("");

  // Form states - MCQ
  const [mcqCategory, setMcqCategory] = useState<SubjectCategory>(SubjectCategory.SCIENCE);
  const [mcqDiff, setMcqDiff] = useState<DifficultyLevel>(DifficultyLevel.EASY);
  const [mcqQuestion, setMcqQuestion] = useState("");
  const [mcqOptions, setMcqOptions] = useState<string[]>(["", "", "", ""]);
  const [mcqCorrectIdx, setMcqCorrectIdx] = useState<number>(0);
  const [mcqExpl, setMcqExpl] = useState("");

  // Form states - Video
  const [vidTitle, setVidTitle] = useState("");
  const [vidCategory, setVidCategory] = useState<SubjectCategory>(SubjectCategory.SCIENCE);
  const [vidYoutubeId, setVidYoutubeId] = useState("");
  const [vidDuration, setVidDuration] = useState("5:00");
  const [vidThumb, setVidThumb] = useState("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop");
  const [vidDesc, setVidDesc] = useState("");

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) {
      alert("Please fill in both the title and text of your study note.");
      return;
    }
    
    setIsSaving(true);
    const newNote = {
      id: "custom-note-" + Date.now(),
      title: noteTitle,
      category: noteCategory,
      content: noteContent,
      readingTimeMinutes: noteTime
    };

    const success = await onInsertCustomNote(newNote);
    setIsSaving(false);

    if (success) {
      setNoteTitle("");
      setNoteContent("");
      setStatusMsg("Study note uploaded successfully! Persisted on central hub database.");
      setTimeout(() => setStatusMsg(""), 4000);
    }
  };

  const handleSaveMCQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcqQuestion || mcqOptions.some(o => !o)) {
      alert("Please specify the question prompt and supply all 4 choice options.");
      return;
    }

    setIsSaving(true);
    const newQuiz = {
      id: "custom-mcq-" + Date.now(),
      category: mcqCategory,
      difficulty: mcqDiff,
      question: mcqQuestion,
      options: mcqOptions,
      correctIndex: mcqCorrectIdx,
      explanation: mcqExpl || "Synthesized practice topic answered verified."
    };

    const success = await onInsertCustomQuiz(newQuiz);
    setIsSaving(false);

    if (success) {
      setMcqQuestion("");
      setMcqOptions(["", "", "", ""]);
      setMcqExpl("");
      setStatusMsg("Practice MCQ Quiz loaded successfully! Live for all student dashboards.");
      setTimeout(() => setStatusMsg(""), 4000);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidYoutubeId) {
      alert("Please specify the educational video title and provide a Youtube ID.");
      return;
    }

    setIsSaving(true);
    const newVideo = {
      id: "custom-vid-" + Date.now(),
      title: vidTitle,
      category: vidCategory,
      youtubeId: vidYoutubeId,
      duration: vidDuration,
      thumbnailUrl: vidThumb,
      description: vidDesc || "Pre-vetted study companion lesson video."
    };

    const success = await onInsertCustomVideo(newVideo);
    setIsSaving(false);

    if (success) {
      setVidTitle("");
      setVidYoutubeId("");
      setVidDesc("");
      setStatusMsg("Curriculum video mapped! Included in appropriate video category section.");
      setTimeout(() => setStatusMsg(""), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
      
      {/* Admin header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#a5b4fc] font-mono">Teacher Console</span>
          <h2 className="text-sm font-extrabold flex items-center gap-1.5 mt-0.5">
            <Wrench className="h-4.5 w-4.5 text-indigo-400" />
            Curriculum Manager
          </h2>
        </div>
        <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-mono font-bold tracking-wide">
          Admin Portal
        </span>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-pulse">
          <Check className="h-4 w-4 text-emerald-600" />
          {statusMsg}
        </div>
      )}

      {/* Admin Segment Tabs */}
      <div className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl border text-[10px]">
        <button
          onClick={() => setActiveSegment("notes")}
          className={`py-1.5 font-bold rounded-lg cursor-pointer ${
            activeSegment === "notes" ? "bg-white text-slate-800 font-extrabold shadow-3xs" : "text-slate-500"
          }`}
        >
          Notes Form
        </button>
        <button
          onClick={() => setActiveSegment("mcqs")}
          className={`py-1.5 font-bold rounded-lg cursor-pointer ${
            activeSegment === "mcqs" ? "bg-white text-slate-800 font-extrabold shadow-3xs" : "text-slate-500"
          }`}
        >
          Add MCQ
        </button>
        <button
          onClick={() => setActiveSegment("videos")}
          className={`py-1.5 font-bold rounded-lg cursor-pointer ${
            activeSegment === "videos" ? "bg-white text-slate-800 font-extrabold shadow-3xs" : "text-slate-500"
          }`}
        >
          Add Video
        </button>
        <button
          onClick={() => setActiveSegment("students")}
          className={`py-1.5 font-bold rounded-lg cursor-pointer ${
            activeSegment === "students" ? "bg-white text-slate-800 font-extrabold shadow-3xs" : "text-slate-500"
          }`}
        >
          Student Roster
        </button>
      </div>

      {/* Segment Views */}
      <div className="bg-white p-4 rounded-xl border">
        {activeSegment === "notes" && (
          <form onSubmit={handleSaveNote} className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1 pb-1.5 border-b border-slate-100">
              <BookOpen className="h-4 w-4 text-indigo-500" /> Issue Custom Note Module
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g. Chemical Bonds and Valence Electrons"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject</label>
                <select
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as SubjectCategory)}
                >
                  {Object.values(SubjectCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Est. Reading Time (min)</label>
                <input
                  type="number"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={noteTime}
                  onChange={(e) => setNoteTime(parseInt(e.target.value) || 5)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Note Markdown Content</label>
                <textarea
                  rows={4}
                  placeholder="Markdown Supported. Note stage details, formulas, equations..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Deploy Notes to Student Hub"}
            </button>
          </form>
        )}

        {activeSegment === "mcqs" && (
          <form onSubmit={handleSaveMCQ} className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1 pb-1.5 border-b border-slate-100">
              <HelpCircle className="h-4 w-4 text-indigo-500" /> Create Multiple-Choice MCQ
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Category</label>
                <select
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={mcqCategory}
                  onChange={(e) => setMcqCategory(e.target.value as SubjectCategory)}
                >
                  {Object.values(SubjectCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Difficulty level</label>
                <select
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={mcqDiff}
                  onChange={(e) => setMcqDiff(e.target.value as DifficultyLevel)}
                >
                  {Object.values(DifficultyLevel).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Question Prompt</label>
                <input
                  type="text"
                  placeholder="e.g. Which logic gate reverses input state?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  value={mcqQuestion}
                  onChange={(e) => setMcqQuestion(e.target.value)}
                />
              </div>

              {/* Options mapping */}
              {mcqOptions.map((opt, i) => (
                <div key={i}>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">Choice Option {i + 1}</label>
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...mcqOptions];
                      updated[i] = e.target.value;
                      setMcqOptions(updated);
                    }}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Correct Choice Index</label>
                <select
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={mcqCorrectIdx}
                  onChange={(e) => setMcqCorrectIdx(parseInt(e.target.value) || 0)}
                >
                  <option value={0}>Option 1 (index 0)</option>
                  <option value={1}>Option 2 (index 1)</option>
                  <option value={2}>Option 3 (index 2)</option>
                  <option value={3}>Option 4 (index 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Explanation</label>
                <input
                  type="text"
                  placeholder="Why is this answer correct?"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={mcqExpl}
                  onChange={(e) => setMcqExpl(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2 bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save practice MCQ
            </button>
          </form>
        )}

        {activeSegment === "videos" && (
          <form onSubmit={handleSaveVideo} className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1 pb-1.5 border-b border-slate-100">
              <Video className="h-4 w-4 text-indigo-500" /> Link Video Lecture
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Video Title</label>
                <input
                  type="text"
                  placeholder="e.g. Polynomial Division and Factor Theorems"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Subject Tag</label>
                <select
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={vidCategory}
                  onChange={(e) => setVidCategory(e.target.value as SubjectCategory)}
                >
                  {Object.values(SubjectCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">YouTube Video ID</label>
                <input
                  type="text"
                  placeholder="e.g. sQK3Yr4Sc_k"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  value={vidYoutubeId}
                  onChange={(e) => setVidYoutubeId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Duration (MM:SS)</label>
                <input
                  type="text"
                  placeholder="e.g. 7:45"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={vidDuration}
                  onChange={(e) => setVidDuration(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  placeholder="Unsplash / local placeholder URL"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={vidThumb}
                  onChange={(e) => setVidThumb(e.target.value)}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Provide brief outline summary of what students discover in this video."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={vidDesc}
                  onChange={(e) => setVidDesc(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              Save Lesson Video mapping
            </button>
          </form>
        )}

        {activeSegment === "students" && (
          <div className="space-y-3.5 text-xs">
            <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1 pb-1.5 border-b border-slate-100">
              <Users className="h-4 w-4 text-indigo-500" /> Simulated Class Roster Log
            </h3>
            
            <p className="text-[10px] text-slate-400">
              Administrators view live active Student accounts, track total XP points completed, and review subject progress.
            </p>

            <div className="divide-y divide-slate-100">
              <div className="py-2 flex justify-between items-center bg-slate-50/50 p-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">PA</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Priscilla Adhikari (Active)</span>
                    <span className="text-[10px] text-slate-400 font-mono">priscilla.adhikari@gmail.com</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">840 pts</span>
              </div>

              <div className="py-2 flex justify-between items-center bg-slate-50/50 p-2 rounded-lg mt-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">RS</div>
                  <div>
                    <span className="font-bold text-slate-800 block">Ramesh Shrestha</span>
                    <span className="text-[10px] text-slate-400 font-mono">ramesh.nepal@school.edu</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">310 pts</span>
              </div>
            </div>
            
            <div className="p-3 bg-indigo-50 border border-indigo-100 text-[10px] rounded-lg">
              🔒 Standard GCP identity validation maps users in true Firebase Auth instances instantly when hosted on production endpoints.
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
