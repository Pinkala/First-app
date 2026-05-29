import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google Gen AI
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Initialized Google GenAI Client with key: " + apiKey.substring(0, 5) + "...");
  } catch (e) {
    console.error("Error initializing Google GenAI:", e);
  }
} else {
  console.log("No valid GEMINI_API_KEY found in process.env. Local simulation mode will be used for AI features unless a key is configured.");
}

// In-Memory Database for persistency of additions (saved in JSON file if possible)
const DATA_FILE = path.join(process.cwd(), "userDb.json");

interface PersistedData {
  customNotes: any[];
  customQuizzes: any[];
  customVideos: any[];
  studentActivities: any[];
  leaderboardScores: Record<string, number>;
}

let dbState: PersistedData = {
  customNotes: [],
  customQuizzes: [],
  customVideos: [],
  studentActivities: [],
  leaderboardScores: {},
};

// Load saved persistency database
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    dbState = { ...dbState, ...JSON.parse(raw) };
    console.log("Loaded persisted state from userDb.json");
  } catch (e) {
    console.error("Could not load userDb.json, starting from fresh memory:", e);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not save to userDb.json:", e);
  }
}

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai, localTime: new Date().toISOString() });
});

// Admin Custom Content Fetching
app.get("/api/custom-data", (req, res) => {
  res.json(dbState);
});

app.post("/api/custom-data/note", (req, res) => {
  const note = req.body;
  if (!note.id || !note.title || !note.category || !note.content) {
    return res.status(400).json({ error: "Missing required note attributes." });
  }
  dbState.customNotes.unshift(note);
  saveDb();
  res.json({ success: true, note });
});

app.post("/api/custom-data/quiz", (req, res) => {
  const quiz = req.body;
  if (!quiz.id || !quiz.question || !quiz.options || quiz.correctIndex === undefined) {
    return res.status(400).json({ error: "Missing required quiz attributes." });
  }
  dbState.customQuizzes.unshift(quiz);
  saveDb();
  res.json({ success: true, quiz });
});

app.post("/api/custom-data/video", (req, res) => {
  const video = req.body;
  if (!video.id || !video.title || !video.youtubeId) {
    return res.status(400).json({ error: "Missing required video attributes." });
  }
  dbState.customVideos.unshift(video);
  saveDb();
  res.json({ success: true, video });
});

app.post("/api/activities", (req, res) => {
  const act = req.body;
  dbState.studentActivities.unshift(act);
  if (dbState.studentActivities.length > 50) {
    dbState.studentActivities.pop();
  }
  saveDb();
  res.json({ success: true });
});

app.post("/api/update-leaderboard", (req, res) => {
  const { uid, name, score } = req.body;
  if (uid && score !== undefined) {
    dbState.leaderboardScores[uid] = score;
    saveDb();
  }
  res.json({ success: true });
});

// AI Chatbot Assistant Endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { messages, language } = req.body; // array of messages { role, text }
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  const promptLanguage = language === "Nepali" ? "Please answer in Nepali if suitable, or a mix of English and Nepali (Romanized/Devenagari) to help Nepali students." : "Answer precisely in English as an expert academic educator tutor.";

  if (!ai) {
    // Local fallback when API Key is missing or invalid
    const lastUserMessage = messages[messages.length - 1]?.text || "";
    let reply = "Hello! I am your AI Study Assistant. I am running in local offline demo mode.";
    
    const text = lastUserMessage.toLowerCase();
    if (text.includes("science")) {
      reply = "Science Study Helper: Photosynthesis is how plants make fuel from CO2 and water using sunlight. Let me know if you want a mock MCQ question about Science!";
    } else if (text.includes("math") || text.includes("quadratic")) {
      reply = "Math Tutor Mode: A quadratic equation standard form is ax² + bx + c = 0. We solve it using the quadratic formula: x = [-b ± sqrt(b² - 4ac)] / 2a.";
    } else if (text.includes("nepal") || text.includes("everest")) {
      reply = "Nepal Geography Helper: Mount Everest is 8848.86 meters tall and situated in the majestic northern Himalayan ranges of Sagarmatha.";
    } else if (text.includes("quiz") || text.includes("mcq")) {
      reply = "Sure! Try our 'MCQ Practice Section' in the bottom navigation tab, or click 'Start Quiz' on the Home Dashboard to practice 4-option level quizzes!";
    } else {
      reply = `Thank you for your question: "${lastUserMessage}". I am here to assist with Science, Mathematics, Computer Sciences, English Grammar, and General Knowledge. Let's make study rewarding!`;
    }

    if (language === "Nepali") {
      reply = `नमस्ते! म तपाईँको स्मार्ट एआई (AI) शिक्षक हुँ। तपाईँले के सिक्न चाहनुहुन्छ? विज्ञान, गणित, कम्प्युटर वा सामान्य ज्ञान सम्बन्धी सोध्न सक्नुहुन्छ। (Local Demo Mode: ` + reply + `)`;
    }

    return res.json({ text: reply });
  }

  try {
    // Prep chat history
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: `You are 'Smart Study Tutor', an elite conversational AI tutor for Nepalese middle & high school students on the Smart Study Hub platform. 
Keep your explanations highly student-friendly, neat, visual with lists/bullet points, and extremely encouraging. 
If asked about complex science/math questions, use simple metaphors. 
${promptLanguage}
Support Nepali translations & romanized text as requested. Refuse to answer harmful, political, or off-topic non-educational queries gracefully.`
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

// AI Autogenerated Quiz Suggestions
app.post("/api/gemini/suggest-quiz", async (req, res) => {
  const { category, currentScore, language } = req.body;

  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const promptLanguage = language === "Nepali" ? "Nepali (both question translation and Nepali option meanings)" : "English";

  if (!ai) {
    // Local mock generator
    const mockSuggestedQuestion = {
      question: `[AI Practice Spark] Which of the following is core to ${category}?`,
      options: ["Standard Elementary Definition", "Secondary Hypothesis", "Advanced Practical Variant", "Systematic Core Paradigm"],
      correctIndex: 0,
      explanation: `This is a generated helper practice topic for ${category} based on your standard learning path.`
    };
    return res.json({ question: mockSuggestedQuestion });
  }

  try {
    const formattedPrompt = `Generate exactly ONE single high-quality multiple choice question (MCQ) for the subject category "${category}". 
The student currently has a score of ${currentScore || 0}. Make the question adapt to their level.
The language of the question and options should be: ${promptLanguage}.

Provide your response in raw JSON format matching this schema:
{
  "question": "A clear, engaging conceptual question text",
  "options": ["A plausible option 1", "Correct option 2", "Plausible option 3", "Plausible option 4"],
  "correctIndex": 1,
  "explanation": "Brief explanation of why the correct option is right."
}
Set correctIndex as a 0-indexed integer corresponding to the correct answer option position in the options list. Ensure the JSON is valid and can be directly parsed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Must contain exactly 4 potential multiple choice options."
            },
            correctIndex: { type: Type.INTEGER, description: "0-indexed integer denoting correct option" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctIndex", "explanation"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ question: parsed });
  } catch (error: any) {
    console.error("Gemini Suggest-Quiz Error:", error);
    res.status(500).json({ error: "Failed to generate AI MCQ suggestions" });
  }
});


// Mounting Vite server
async function startViteServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving in PRODUCTION mode from static /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Study Hub Server actively listening on: http://0.0.0.0:${PORT}`);
  });
}

startViteServer();
