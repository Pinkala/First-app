import React, { useState } from "react";
import { 
  Play, Heart, History, Check, Search, Sparkles, 
  Tv, Eye, RotateCcw, AlertCircle, XCircle 
} from "lucide-react";
import { EducationalVideo, SubjectCategory, UserProfile } from "../types";
import { motion } from "motion/react";

interface VideoSectionProps {
  profile: UserProfile;
  videos: EducationalVideo[];
  favoriteIds: string[];
  watchHistory: string[];
  onToggleFavoriteVideo: (videoId: string) => void;
  onLoggedWatch: (videoId: string, title: string) => void;
}

export default function VideoSection({
  profile,
  videos,
  favoriteIds,
  watchHistory,
  onToggleFavoriteVideo,
  onLoggedWatch
}: VideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<EducationalVideo | null>(null);
  const [videoSearch, setVideoSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites" | "history">("all");

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch = vid.title.toLowerCase().includes(videoSearch.toLowerCase()) || 
                          vid.description.toLowerCase().includes(videoSearch.toLowerCase());
    
    if (activeTab === "favorites") {
      return matchesSearch && favoriteIds.includes(vid.id);
    }
    if (activeTab === "history") {
      return matchesSearch && watchHistory.includes(vid.id);
    }
    return matchesSearch;
  });

  const handleVideoPlay = (vid: EducationalVideo) => {
    setActiveVideo(vid);
    onLoggedWatch(vid.id, vid.title);
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
      
      {/* Video Player Frame */}
      {activeVideo ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-905 rounded-xl overflow-hidden border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-3 bg-zinc-900 text-white"
        >
          {/* Embedding realistic iframe if allowed */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border-2 border-slate-950">
            <iframe
              title={activeVideo.title}
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full border-none"
            ></iframe>
          </div>

          <div className="flex justify-between items-start pt-1">
            <div className="flex-1 pr-4">
              <span className="text-[9.5px] bg-[#fbbf24] border border-slate-950 text-slate-950 font-black px-2 py-0.5 rounded-sm uppercase tracking-tight">
                {activeVideo.category}
              </span>
              <h3 className="text-xs font-black text-slate-50 mt-2 leading-relaxed uppercase font-mono">{activeVideo.title}</h3>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed font-semibold">{activeVideo.description}</p>
            </div>

            <div className="flex flex-col gap-1.5 items-end">
              <button 
                onClick={() => onToggleFavoriteVideo(activeVideo.id)}
                className={`p-1.5 rounded-xl border-2 cursor-pointer shadow-[2px_2px_0px_0px_#000] transition-all duration-100 ${
                  favoriteIds.includes(activeVideo.id) 
                    ? "bg-rose-500 text-white border-slate-900" 
                    : "bg-slate-800 text-slate-300 border-slate-900"
                }`}
                title="Bookmark favorite"
              >
                <Heart className="h-4 w-4 fill-current stroke-[2]" />
              </button>
              <button
                onClick={() => setActiveVideo(null)}
                className="text-[10px] font-black uppercase tracking-tight bg-slate-100 text-slate-900 hover:bg-slate-200 border-2 border-slate-950 px-2.5 py-1 rounded-md cursor-pointer mt-1"
              >
                Close Player
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Standalone banner indicating educational Youtube list */
        <div className="bg-pink-100 border-2 border-slate-900 text-slate-950 p-4.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-black tracking-widest font-mono text-pink-700 block">STUDY CHANNEL STREAM</span>
            <h2 className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5 mt-1 font-display">
              <Tv className="h-4.5 w-4.5 stroke-[2.5] text-indigo-700" /> Curriculum-aligned Video Deck
            </h2>
          </div>
          <Play className="h-7 w-7 text-indigo-650 fill-indigo-100 animate-pulse stroke-[2.5]" />
        </div>
      )}

      {/* Tab Filter buttons */}
      <div className="grid grid-cols-3 bg-white p-1 border-2 border-slate-900 rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(15,23,42,1)]">
        <button
          onClick={() => setActiveTab("all")}
          className={`py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
            activeTab === "all" ? "bg-[#fbbf24] text-slate-950 border border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]" : "text-slate-800 hover:bg-slate-50"
          }`}
        >
          All Lessons
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
            activeTab === "favorites" ? "bg-[#fbbf24] text-slate-950 border border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]" : "text-slate-800 hover:bg-slate-50"
          }`}
        >
          My Favorites
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer ${
            activeTab === "history" ? "bg-[#fbbf24] text-slate-950 border border-slate-950 shadow-[1.5px_1.5px_0px_0px_#000]" : "text-slate-800 hover:bg-slate-50"
          }`}
        >
          Watch History
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900 font-black">
          <Search className="h-4 w-4 stroke-[2.5]" />
        </span>
        <input
          type="text"
          placeholder={profile.preferredLanguage === "Nepali" ? "भिडियो पाठहरू खोज्नुहोस्..." : "Search algebra, light forces, grammar..."}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white border-2 border-slate-900 rounded-xl focus:outline-hidden font-bold text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          value={videoSearch}
          onChange={(e) => setVideoSearch(e.target.value)}
        />
      </div>

      {/* Video Lesson Grids */}
      <div className="flex flex-col gap-3.5">
        {filteredVideos.length === 0 ? (
          <div className="text-center py-10 bg-white border-2 border-slate-900 rounded-xl text-xs font-bold text-slate-500">
            No videos matching current filters or search results.
          </div>
        ) : (
          filteredVideos.map((vid) => {
            const isFaved = favoriteIds.includes(vid.id);
            const isWatched = watchHistory.includes(vid.id);
            const isActive = activeVideo?.id === vid.id;

            return (
              <div 
                key={vid.id}
                className={`bg-white rounded-xl overflow-hidden border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 transition-all flex h-24 ${
                  isActive ? "ring-2 ring-[#fbbf24]" : ""
                }`}
              >
                {/* Simulated/Real video Thumbnail with Play icon trigger overlay */}
                <div 
                  onClick={() => handleVideoPlay(vid)}
                  className="relative w-32 bg-slate-905 cursor-pointer flex-shrink-0 group overflow-hidden border-r-2 border-slate-900"
                >
                  <img 
                    src={vid.thumbnailUrl} 
                    alt={vid.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="w-9 h-9 rounded-xl bg-yellow-300 flex items-center justify-center text-slate-905 border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] group-hover:scale-110 transition-transform">
                      <Play className="h-3.5 w-3.5 fill-current text-slate-950 stroke-[3]" />
                    </span>
                  </div>
                  {/* Duration tag */}
                  <span className="absolute bottom-1 right-1 bg-slate-900 border border-slate-950 px-1 py-0.5 rounded text-[8px] text-yellow-300 font-mono font-black tracking-wider">
                    {vid.duration}
                  </span>
                </div>

                <div className="p-2.5 flex flex-col justify-between flex-1 min-w-0">
                  <div 
                    onClick={() => handleVideoPlay(vid)}
                    className="cursor-pointer min-w-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[8.5px] bg-[#fbbf24] border border-slate-950 text-slate-950 font-black px-1.5 py-0.5 rounded-sm uppercase font-mono tracking-tight">
                        {vid.category}
                      </span>
                      {isWatched && (
                        <span className="text-[8px] text-emerald-950 font-black bg-emerald-100 border border-emerald-500 px-1 py-0.2 rounded flex items-center gap-0.5">
                          <Check className="h-2 w-2 stroke-[2.5]" /> WATCHED!
                        </span>
                      )}
                    </div>
                    <h4 className="text-[11px] font-black uppercase text-slate-950 truncate mt-1">
                      {vid.title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-500 truncate leading-snug">
                      {vid.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex justify-between items-center text-left pt-1">
                    <span className="text-[8px] font-mono font-bold text-slate-400 flex items-center gap-0.5 uppercase">
                      <Eye className="h-2.5 w-2.5 text-slate-400 stroke-[2]" /> Lesson Video
                    </span>
                    <button
                      onClick={() => onToggleFavoriteVideo(vid.id)}
                      className={`text-[9px] font-black uppercase flex items-center gap-0.5 cursor-pointer bg-transparent border-0 ${
                        isFaved ? "text-rose-600" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 stroke-[2.5] ${isFaved ? "fill-rose-600" : ""}`} />
                      {isFaved ? "Saved" : "Favorite"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
