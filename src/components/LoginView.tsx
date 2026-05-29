import React, { useState } from "react";
import { LogIn, UserPlus, GraduationCap, Globe, Mail, Lock, User, Sparkles } from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  doc, 
  getDoc, 
  setDoc 
} from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

interface LoginViewProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [language, setLanguage] = useState<"English" | "Nepali">("English");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in email and password fields.");
      return;
    }

    if (isRegister && !name) {
      setError("Please provide your full student name.");
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const studentProfile: UserProfile = {
          uid: user.uid,
          name: name,
          email: email,
          profilePic: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(email)}`,
          schoolName: schoolName || "Nations High School",
          preferredLanguage: language,
          dailyGoalMinutes: 20
        };
        await setDoc(doc(db, "users", user.uid), studentProfile);
        onLoginSuccess(studentProfile);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        let studentProfile: UserProfile;
        if (userSnap.exists()) {
          studentProfile = userSnap.data() as UserProfile;
        } else {
          studentProfile = {
            uid: user.uid,
            name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
            email: email,
            profilePic: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(email)}`,
            schoolName: "Nations High School",
            preferredLanguage: language,
            dailyGoalMinutes: 20
          };
          await setDoc(userRef, studentProfile);
        }
        onLoginSuccess(studentProfile);
      }
    } catch (e: any) {
      console.error("Firebase Auth Error:", e);
      let msg = e.message;
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
        msg = "Invalid email or password combination.";
      } else if (e.code === "auth/email-already-in-use") {
        msg = "This email is already registered.";
      } else if (e.code === "auth/weak-password") {
        msg = "Password should be at least 6 characters.";
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      let studentProfile: UserProfile;
      if (userSnap.exists()) {
        studentProfile = userSnap.data() as UserProfile;
      } else {
        studentProfile = {
          uid: user.uid,
          name: user.displayName || "Google Scholar",
          email: user.email || "",
          profilePic: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(user.email || 'Google')}`,
          schoolName: "Mount Everest International Academy",
          preferredLanguage: language,
          dailyGoalMinutes: 30
        };
        await setDoc(userRef, studentProfile);
      }
      onLoginSuccess(studentProfile);
    } catch (e: any) {
      console.error("Google Auth Error:", e);
      setError(e.message || "Failed to authenticate with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#faf9f5] min-h-[580px] h-full w-full select-none">
      <div className="w-full max-w-sm bg-white p-6 border-2.5 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-amber-300 flex items-center justify-center text-slate-900 mb-3.5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] animate-bounce">
            <GraduationCap className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter font-display">
            {isRegister ? "Join Smart Study Hub" : "Welcome Back!"}
          </h2>
          <p className="text-[11px] text-slate-600 font-extrabold uppercase mt-1">
            {isRegister 
              ? "Create your student account now" 
              : "Sign in to resume study streaks"
            }
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-100 text-rose-900 text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-800 mb-1">Student Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900">
                  <User className="h-4 w-4 stroke-[2.5]" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Shrestha"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-amber-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-800 mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900">
                <Mail className="h-4 w-4 stroke-[2.5]" />
              </span>
              <input
                type="email"
                placeholder="student@studyhub.edu"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-amber-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase text-slate-800 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900">
                <Lock className="h-4 w-4 stroke-[2.5]" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-amber-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-[11px] font-black uppercase text-slate-800 mb-1">School / Academy</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-900">
                  <GraduationCap className="h-4 w-4 stroke-[2.5]" />
                </span>
                <input
                  type="text"
                  placeholder="e.g. KV Nepalo Academy"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border-2 border-slate-900 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:bg-amber-50"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Preferred Language Toggle */}
          <div className="p-3.5 bg-slate-55 border-2 border-slate-900 rounded-xl bg-[#faf9f5]">
            <span className="text-[11px] font-black uppercase text-slate-900 flex items-center gap-1.5 mb-2.5">
              <Globe className="h-4.5 w-4.5 text-indigo-600 stroke-[2.5]" />
              Preferred Language / रोजेको भाषा
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                className={`py-2 px-3 rounded-xl font-black uppercase tracking-tight transition-all border-2 border-slate-900 cursor-pointer ${
                  language === "English"
                    ? "bg-[#fbbf24] text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setLanguage("English")}
              >
                English
              </button>
              <button
                type="button"
                className={`py-2 px-3 rounded-xl font-black uppercase tracking-tight transition-all border-2 border-slate-900 cursor-pointer ${
                  language === "Nepali"
                    ? "bg-[#fbbf24] text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setLanguage("Nepali")}
              >
                नेपाली (Nepali)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : isRegister ? (
              <>
                <UserPlus className="h-4.5 w-4.5 stroke-[2.5]" /> Sign Up Credentials
              </>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5 stroke-[2.5]" /> Secure Log In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-slate-900"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="px-3 bg-white text-slate-900 font-extrabold uppercase border-2 border-slate-900 rounded-md">OR</span>
          </div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
        >
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-display font-black tracking-tight">Continue with Google</span>
        </button>

        {/* Primary Toggle links */}
        <p className="text-center text-xs text-slate-700 font-bold mt-5 uppercase">
          {isRegister ? "Registered with us?" : "New to study hub?"}{" "}
          <button
            type="button"
            className="text-indigo-600 font-extrabold hover:underline bg-transparent border-none cursor-pointer uppercase text-xs"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login here" : "Sign up"}
          </button>
        </p>

      </div>

      {/* Developer Credit Footer */}
      <div className="mt-5 text-center text-[9px] font-black uppercase tracking-wider text-slate-900 select-none">
        Developed by <span className="text-pink-600 bg-white border-2 border-slate-900 px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ml-1 font-mono">Unite Network Technology PVT. LTD.</span>
      </div>

    </div>
  );
}
