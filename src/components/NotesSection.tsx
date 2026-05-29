import React, { useState } from "react";
import { 
  BookOpen, Bookmark, BookmarkCheck, ArrowLeft, Download, 
  Volume2, VolumeX, Eye, Moon, Sun, Search, CheckCircle2 
} from "lucide-react";
import { StudyNote, SubjectCategory, UserProfile } from "../types";
import { motion } from "motion/react";

interface NotesSectionProps {
  profile: UserProfile;
  notes: StudyNote[];
  bookmarkedIds: string[];
  onToggleBookmark: (noteId: string) => void;
  onLoggedRead: (noteId: string, title: string) => void;
  selectedCategoryName?: SubjectCategory | null;
  onClearCategoryFilter: () => void;
}

export default function NotesSection({
  profile,
  notes,
  bookmarkedIds,
  onToggleBookmark,
  onLoggedRead,
  selectedCategoryName,
  onClearCategoryFilter
}: NotesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  const [readerDarkMode, setReaderDarkMode] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filter notes based on search & active subject category
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryName ? n.category === selectedCategoryName : true;
    return matchesSearch && matchesCategory;
  });

  const handleReadAloud = (noteContent: string) => {
    if ("speechSynthesis" in window) {
      if (isReadingAloud) {
        window.speechSynthesis.cancel();
        setIsReadingAloud(false);
      } else {
        // Strip markdown lines for speech
        const cleanText = noteContent
          .replace(/#+/g, "")
          .replace(/\*+/g, "")
          .replace(/\$+/g, "")
          .replace(/`+/g, "")
          .substring(0, 800); // reasonable chunk limit

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        
        utterance.onend = () => {
          setIsReadingAloud(false);
        };
        utterance.onerror = () => {
          setIsReadingAloud(false);
        };

        setIsReadingAloud(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      alert("Text-to-Speech is not supported in this browser environment.");
    }
  };

  const handleDownload = (note: StudyNote) => {
    try {
      // Generate actual downloadable TXT file containing materials
      const fileContent = `=========================================\n${note.title.toUpperCase()}\nSubject: ${note.category}\nLanguage: ${profile.preferredLanguage}\nReadiness Time: ${note.readingTimeMinutes} min\nSmart Study Hub material - Offline study copy\n=========================================\n\n${note.content}`;
      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${note.title.toLowerCase().replace(/\s+/g, "_")}_study_notes.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(note.id);
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const closeReader = () => {
    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
    }
    setSelectedNote(null);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
      
      {/* Subject Filter Indicator */}
      {selectedCategoryName && (
        <div className="flex items-center justify-between bg-yellow-100 border-2 border-slate-900 px-3.5 py-2.5 rounded-xl text-xs text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <span className="font-extrabold uppercase">
            Topic Filter: <strong className="bg-yellow-300 px-1 py-0.2 border border-slate-900 text-slate-950">{selectedCategoryName}</strong>
          </span>
          <button 
            onClick={onClearCategoryFilter}
            className="text-[9.5px] bg-slate-900 hover:bg-slate-850 text-white px-2.5 py-1 rounded-md font-black uppercase cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Reader Layout Mode */}
      {selectedNote ? (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`rounded-xl border-2 border-slate-900 p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-4 ${
            readerDarkMode 
              ? "bg-slate-950 text-white" 
              : "bg-white text-slate-950"
          }`}
        >
          {/* Header Controls */}
          <div className="flex justify-between items-center border-b-2 pb-2.5 border-dashed border-slate-300 dark:border-slate-800">
            <button 
              onClick={closeReader}
              className="flex items-center gap-1.5 text-xs font-black bg-yellow-300 text-slate-900 border-2 border-slate-900 px-2.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:bg-yellow-400 hover:translate-y-[-0.5px]"
            >
              <ArrowLeft className="h-4 w-4 stroke-[3]" /> Back to Notes
            </button>
            
            <div className="flex items-center gap-2">
              {/* Dark mode reader toggle */}
              <button
                onClick={() => setReaderDarkMode(!readerDarkMode)}
                className={`p-1.5 rounded-lg border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
                  readerDarkMode 
                    ? "bg-slate-800 text-yellow-400" 
                    : "bg-amber-100 text-slate-800"
                }`}
                title="Eye Saver mode"
              >
                {readerDarkMode ? <Sun className="h-4 w-4 stroke-[2.5]" /> : <Moon className="h-4 w-4 stroke-[2.5]" />}
              </button>

              {/* TTS Toggler */}
              <button
                onClick={() => handleReadAloud(selectedNote.content)}
                className={`p-1.5 rounded-lg border-2 border-slate-900 flex items-center gap-1 text-xs font-black tracking-tight cursor-pointer shadow-[2px_2px_0px_0px_#000] ${
                  isReadingAloud 
                    ? "bg-pink-500 text-white border-pink-600 animate-pulse" 
                    : "bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                }`}
                title="Listen to Note"
              >
                {isReadingAloud ? <VolumeX className="h-4 w-4 stroke-[2.5]" /> : <Volume2 className="h-4 w-4 stroke-[2.5]" />}
                <span>TTS</span>
              </button>

              {/* Bookmark status */}
              <button
                onClick={() => onToggleBookmark(selectedNote.id)}
                className="p-1.5 rounded-lg border-2 border-slate-900 bg-white text-indigo-650 cursor-pointer shadow-[2px_2px_0px_0px_#000] dark:bg-slate-800 dark:text-indigo-400"
              >
                {bookmarkedIds.includes(selectedNote.id) 
                  ? <BookmarkCheck className="h-4 w-4 fill-indigo-600 dark:fill-indigo-400" /> 
                  : <Bookmark className="h-4 w-4" />
                }
              </button>
            </div>
          </div>

          {/* Note Metadata */}
          <div className="p-2 border-2 border-slate-900 rounded-lg bg-pink-100 dark:bg-slate-900">
            <span className="text-[9.5px] font-black uppercase tracking-widest text-pink-700 dark:text-pink-400 font-mono">
              {selectedNote.category} • {selectedNote.readingTimeMinutes} min Quiz Prep
            </span>
            <h2 className="text-sm font-black mt-0.5 leading-tight uppercase font-display text-slate-900 dark:text-white">{selectedNote.title}</h2>
          </div>

          {/* Core Content Viewer (Styled markdown support) */}
          <div className="prose prose-sm max-w-none text-xs leading-relaxed space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {selectedNote.content.split("\n\n").map((para, i) => {
              if (para.startsWith("##")) {
                return <h3 key={i} className="text-xs font-black text-slate-950 dark:text-slate-100 uppercase tracking-tight border-b border-light-slate mt-4">{para.replace(/##/g, "").trim()}</h3>;
              }
              if (para.startsWith("###")) {
                return <h4 key={i} className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase mt-3">{para.replace(/###/g, "").trim()}</h4>;
              }
              if (para.startsWith("-") || para.startsWith("*")) {
                return (
                  <ul key={i} className="list-disc pl-4 space-y-1.5">
                    {para.split("\n").map((li, idx) => (
                      <li key={idx} className="text-slate-800 dark:text-slate-300 font-medium">
                        {li.replace(/^[\s-*]+/, "").trim()}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-slate-800 dark:text-slate-300 font-medium">
                  {para}
                </p>
              );
            })}
          </div>

          {/* Read logs & download section */}
          <div className="flex gap-2.5 items-center pt-3 border-t-2 border-slate-900 mt-2">
            <button
              onClick={() => handleDownload(selectedNote)}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] hover:translate-y-[0.5px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4 stroke-[3]" />
              {downloadSuccess === selectedNote.id ? "TXT Downloaded ✅" : "Download Notes TXT"}
            </button>
            <button
              onClick={() => {
                onLoggedRead(selectedNote.id, selectedNote.title);
                alert("Notes added to Continue Learning Log! Progress recorded.");
              }}
              className="py-2 px-4 bg-emerald-300 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wide border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_#000] cursor-pointer hover:translate-y-[0.5px] transition-all"
            >
              Complete Quiz Prep
            </button>
          </div>

          {downloadSuccess === selectedNote.id && (
            <div className="p-2 bg-emerald-100 text-emerald-950 border-2 border-emerald-900 text-[10px] font-black uppercase tracking-tight rounded-lg flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 stroke-[2.5]" />
              Offline study copy saved as .txt format correctly!
            </div>
          )}
        </motion.div>
      ) : (
        <>
          {/* Notes Search Header */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900">
              <Search className="h-4 w-4 stroke-[2.5]" />
            </span>
            <input
              type="text"
              placeholder={profile.preferredLanguage === "Nepali" ? "नोटहरू र विषयहरू खोज्नुहोस्..." : "Search study notes, stages, laws..."}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden font-bold text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Notes Count header */}
          <div className="flex justify-between items-center text-xs text-slate-950 font-black uppercase">
            <span>Found <strong>{filteredNotes.length}</strong> modules to read</span>
            <span className="font-mono text-[9.5px] bg-yellow-300 border border-slate-900 px-2 py-0.5 rounded-md">FILTER: {selectedCategoryName || "ALL"}</span>
          </div>

          {/* Notes Grid Display */}
          <div className="flex flex-col gap-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-500">
                No notes found matching current filters.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isBookmarked = bookmarkedIds.includes(note.id);
                return (
                  <div
                    key={note.id}
                    className="bg-white p-3.5 rounded-xl border-2 border-slate-900 hover:bg-slate-50 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all flex justify-between items-start"
                  >
                    <div 
                      onClick={() => setSelectedNote(note)}
                      className="flex-1 cursor-pointer pr-3"
                    >
                      <span className="text-[9px] bg-yellow-300 text-slate-950 border border-slate-900 font-mono font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tight">
                        {note.category}
                      </span>
                      <h3 className="text-xs font-black text-slate-950 uppercase tracking-tight mt-1 px-0.4 leading-tight">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-extrabold font-mono mt-1 px-0.4 uppercase">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-600 stroke-[2.5]" />
                        <span>{note.readingTimeMinutes} min study prep</span>
                      </div>
                    </div>

                    {/* Quick Bookmark button */}
                    <button
                      onClick={() => onToggleBookmark(note.id)}
                      className="p-1 rounded-lg border border-transparent hover:border-slate-900 bg-white hover:bg-yellow-100 text-indigo-600 cursor-pointer"
                    >
                      {isBookmarked 
                        ? <BookmarkCheck className="h-5 w-5 fill-indigo-650 text-indigo-650" /> 
                        : <Bookmark className="h-5 w-5 text-slate-800 stroke-[2]" />
                      }
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

    </div>
  );
}
