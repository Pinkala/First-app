import React from "react";
import { 
  Globe, Moon, Trash2, Heart, Award, ArrowRight, ShieldAlert,
  Info, Volume2, ShieldCheck, Download, WifiOff
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsViewProps {
  profile: UserProfile;
  onChangeLanguage: (lang: "English" | "Nepali") => void;
  onResetProgress: () => void;
}

export default function SettingsView({
  profile,
  onChangeLanguage,
  onResetProgress
}: SettingsViewProps) {
  
  const handleClearCashe = () => {
    if (window.confirm("Do you want to reset everything back to fresh installation states? Your accumulated XP scores, streaks, and downloaded TXT note study manuals will be reset.")) {
      onResetProgress();
      alert("All progress registers reset successfully.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-[calc(100vh-140px)] select-none">
      
      {/* Title block */}
      <div className="bg-slate-50 border p-3.5 rounded-xl text-xs">
        <h2 className="font-extrabold text-slate-800 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-indigo-600" />
          Settings Panel
        </h2>
        <p className="text-[10px] text-slate-500 mt-1">
          Customize Smart Study Hub parameters, adjust offline replication capabilities, or toggle dual-languages.
        </p>
      </div>

      {/* Language Section Wrapper */}
      <div className="bg-white p-3.5 border rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
          <Globe className="h-4 w-4 text-indigo-500" />
          Language Select / भाषा चयन गर्नुहोस्
        </h3>
        
        <p className="text-[10px] text-slate-500">
          Switches conversational tutor feedback guidelines, study notes search prompts, and quiz questions.
        </p>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <button
            onClick={() => onChangeLanguage("English")}
            className={`py-2 px-3 rounded-xl font-bold transition-all border cursor-pointer ${
              profile.preferredLanguage === "English" 
                ? "bg-indigo-600 text-white border-indigo-500" 
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            English (United States)
          </button>
          
          <button
            onClick={() => onChangeLanguage("Nepali")}
            className={`py-2 px-3 rounded-xl font-bold transition-all border cursor-pointer ${
              profile.preferredLanguage === "Nepali" 
                ? "bg-indigo-600 text-white border-indigo-500" 
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            नेपाली (Nepali / Devanagari)
          </button>
        </div>
      </div>

      {/* Offline capability status */}
      <div className="bg-white p-3.5 border rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
          <WifiOff className="h-4 w-4 text-pink-500" />
          Offline Module Sandbox
        </h3>
        <p className="text-[10px] text-slate-500">
          When downloading notes locally, they are compiled and persisted inside standard user directories to read offline.
        </p>
        <div className="p-3 bg-indigo-50 border border-indigo-100/60 rounded-xl flex items-center gap-2 text-[10px] text-indigo-900 font-semibold leading-normal">
          <ShieldCheck className="h-4.5 w-4.5 text-indigo-600 shrink-0" />
          Offline Mode is currently enabled. All notes download directly to your client file storage correctly.
        </div>
      </div>

      {/* Reset progress */}
      <div className="bg-white p-3.5 border rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          Danger Zone
        </h3>
        
        <p className="text-[10px] text-slate-500">
          Reset student database registry values, clear local logs, and revert back to template parameters. This is irreversible.
        </p>

        <button
          onClick={handleClearCashe}
          className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <Trash2 className="h-4 w-4" /> Reset Student Profiles & Activities
        </button>
      </div>

      {/* Footer information */}
      <div className="text-center py-4 text-[9px] text-slate-400 font-mono">
        Smart Study Hub • Version 2.5 • Developed in Cloud Run Container Environment
      </div>

    </div>
  );
}
