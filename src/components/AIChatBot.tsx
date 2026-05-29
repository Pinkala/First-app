import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, Volume2, User, Bot, RefreshCw, 
  CornerDownRight, AlertCircle, HelpCircle, GraduationCap 
} from "lucide-react";
import { ChatMessage, SubjectCategory } from "../types";
import { motion } from "motion/react";

interface AIChatBotProps {
  preferredLanguage: "English" | "Nepali";
  score: number;
  onLoggedActivity: (title: string, meta: string) => void;
  onInsertCustomQuiz: (q: any) => void;
}

export default function AIChatBot({
  preferredLanguage,
  score,
  onLoggedActivity,
  onInsertCustomQuiz
}: AIChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      role: "model",
      text: preferredLanguage === "Nepali" 
        ? "नमस्ते! म तपाईँको स्मार्ट एआई (AI) शिक्षक हुँ। म तपाईँलाई गणित, विज्ञान, कम्प्युटर, व्याकरण र सामान्य ज्ञान सम्बन्धी कुनै पनि प्रश्नको हल खोज्न मद्दत गर्न सक्छु। के सोध्न चाहनुहुन्छ?"
        : "Hello! I am your AI Study Coach. I can explain hard science formulas, solve quadratic equations, correct grammar, or generate real-time practice MCQs. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const textStr = textToSend || inputValue.trim();
    if (!textStr) return;

    if (!textToSend) setInputValue("");
    
    // Append User Message
    const userMsg: ChatMessage = {
      id: "msg-" + Math.random().toString(36).substring(2, 7),
      role: "user",
      text: textStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        text: msg.text
      }));

      // Send to server
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatHistory,
          language: preferredLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Study Server.");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: "msg-" + Math.random().toString(36).substring(2, 7),
        role: "model",
        text: data.text || "I apologize, I am experiencing temporary model timeout. Please try again with simple terms.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      onLoggedActivity("Inquired AI Chatbot", `Topic: "${textStr.substring(0, 20)}..."`);
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: "err-1",
          role: "model",
          text: `Disconnected from AI Server. Note: Ensure your GEMINI_API_KEY secret is declared inside the Settings Secrets panel inside AI Studio. \n(Error: ${e.message || "Failed request"})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick study suggestions
  const quickPrompts = [
    preferredLanguage === "Nepali" 
      ? "नेपालको भूगोल र प्रमुख नदीहरूको नाम के हो?" 
      : "Explain Photosynthesis Stage in simple terms",
    "Give me one easy math equation challenge",
    "Identify Active vs Passive voice difference"
  ];

  const handleSpeakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.substring(0, 400)); // safe limit
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech not supported in this browser.");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[480px] p-4 bg-slate-50 justify-between select-none">
      
      {/* Bot Chat Header Info */}
      <div className="bg-white p-3.5 border border-slate-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1">
              Smart AI Tutor
              <Sparkles className="h-3 w-3 text-amber-500 animate-spin" />
            </h3>
            <span className="text-[9px] text-emerald-600 font-semibold font-mono flex items-center gap-0.5">
              ● Gemini 3.5-Flash Active
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            if (window.confirm("Do you want to reset current chat history?")) {
              setMessages([messages[0]]);
            }
          }}
          className="text-[9px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-extrabold px-2 py-1 rounded-md transition-colors cursor-pointer border-none"
        >
          Reset Logs
        </button>
      </div>

      {/* Messages Scroll Box */}
      <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar indicator */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                isUser ? "bg-indigo-600 text-white" : "bg-purple-100 text-purple-700"
              }`}>
                {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
              </div>

              {/* Message bubble */}
              <div className={`max-w-[75%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-3xs border ${
                isUser 
                  ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-none" 
                  : "bg-white text-slate-800 border-slate-200/80 rounded-tl-none whitespace-pre-wrap"
              }`}>
                {msg.text}
                
                {/* Meta details */}
                <div className="flex justify-between items-center mt-2 pt-1 border-t border-slate-100/10 text-[8px] opacity-75 font-mono">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      className="text-pink-500 hover:text-pink-600 font-extrabold flex items-center gap-0.5 bg-transparent border-none cursor-pointer"
                    >
                      <Volume2 className="h-3 w-3" /> Speak
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-white border rounded-2xl p-3 flex gap-1 items-center shadow-3xs">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Chips when empty system */}
      {messages.length === 1 && (
        <div className="mb-2">
          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Suggested inquiries</span>
          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="p-2 bg-white hover:bg-indigo-50 border hover:border-indigo-200 text-slate-700 rounded-xl text-left text-[10px] cursor-pointer flex items-center gap-1.5 transition-all text-xs"
              >
                <CornerDownRight className="h-3 w-3 text-indigo-500 shrink-0" />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input container */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="flex gap-2 items-center"
      >
        <input
          type="text"
          placeholder={preferredLanguage === "Nepali" ? "यहाँ प्रश्न सोध्नुहोस्..." : "Type math / science question..."}
          className="flex-1 py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 transition-colors shadow-3xs"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-slate-900 text-white shrink-0 cursor-pointer shadow-xs transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
