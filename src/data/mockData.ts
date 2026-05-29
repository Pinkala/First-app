import { StudyNote, MCQQuestion, EducationalVideo, LeaderboardEntry, Badge, SubjectCategory, DifficultyLevel } from "../types";

export const INITIAL_STUDY_NOTES: StudyNote[] = [
  // Science Notes
  {
    id: "sci-1",
    title: "Understanding Photosynthesis",
    category: SubjectCategory.SCIENCE,
    readingTimeMinutes: 5,
    content: `## What is Photosynthesis?
Photosynthesis is the chemical process by which green plants, algae, and some bacteria convert light energy, usually from the Sun, into chemical energy (glucose) that is used to fuel their activities.

### The Chemical Equation
$$\\text{CO}_2 + \\text{H}_2\\text{O} + \\text{Light} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{O}_2$$
Specifically, Carbon Dioxide + Water + Sunlight yields Glucose and Oxygen.

### Key Components:
1. **Chlorophyll**: The green pigment inside chloroplasts that absorbs sunlight.
2. **Stomata**: Small pores on the underside of leaves where Carbon Dioxide enters and Oxygen escapes.
3. **Roots**: Absorb water and essential minerals from the soil.

### Stages of Photosynthesis:
- **Light-dependent Reactions**: Occurs in the thylakoid membranes, converting light energy into cellular energy (ATP and NADPH), releasing oxygen.
- **Light-independent Reactions (Calvin Cycle)**: Occurs in the stroma, using ATP and NADPH to convert carbon dioxide into sugar (glucose).
`
  },
  {
    id: "sci-2",
    title: "Newton's Laws of Motion",
    category: SubjectCategory.SCIENCE,
    readingTimeMinutes: 7,
    content: `## Newton's Three Laws of Motion
Formulated by Sir Isaac Newton in 1687, these laws describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.

### 1. The First Law (Law of Inertia)
An object at rest remains at rest, and an object in motion remains in motion with the same speed and in the same direction unless acted upon by an external, unbalanced force.
*Example*: A rolling ball stops eventually due to the external forces of friction and air resistance.

### 2. The Second Law ($F = ma$)
The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.
- **Formula**: $F = m \\times a$ (Force = Mass $\\times$ Acceleration)
- **Unit**: Newtons (N)

### 3. The Third Law (Action & Reaction)
For every action, there is an equal and opposite reaction.
*Example*: When you jump off a small boat, you propel yourself forward, and you push the boat backward into the water.
`
  },

  // Math Notes
  {
    id: "math-1",
    title: "Introduction to Quadratic Equations",
    category: SubjectCategory.MATH,
    readingTimeMinutes: 6,
    content: `## What is a Quadratic Equation?
A quadratic equation is a second-degree polynomial equation in a single variable, with the general form:
$$ax^2 + bx + c = 0$$
where $x$ represents an unknown, and $a$, $b$, and $c$ are coefficients, with $a \\neq 0$.

### The Quadratic Formula
To solve any quadratic equation, we use the famous quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### The Discriminant ($\\Delta$)
The term inside the square root, $D = b^2 - 4ac$, is called the **discriminant**. It tells us about the nature of the roots:
1. Since $D > 0$, the equation has **two distinct real roots**.
2. If $D = 0$, the equation has **one real repeated root**.
3. If $D < 0$, the equation has **two complex conjugate roots**.

### Step-by-Step Example:
Let's solve $x^2 - 5x + 6 = 0$:
- Here: $a = 1$, $b = -5$, $c = 6$
- Discriminant: $(-5)^2 - 4(1)(6) = 25 - 24 = 1$
- Roots: $x = \\frac{5 \\pm \\sqrt{1}}{2}$
- So, $x = 3$ or $x = 2$.
`
  },
  {
    id: "math-2",
    title: "Trigonometric Identites & Ratios",
    category: SubjectCategory.MATH,
    readingTimeMinutes: 8,
    content: `## Trigonometric Basics
Trigonometry is the branch of mathematics dealing with the relations of sides and angles of triangles.

### SOH CAH TOA
For a right-angled triangle, the three primary ratios are:
1. **Sine ($\\sin \\theta$)** = $\\frac{\\text{Opposite}}{\\text{Hypotenuse}}$
2. **Cosine ($\\cos \\theta$)** = $\\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$
3. **Tangent ($\\tan \\theta$)** = $\\frac{\\text{Opposite}}{\\text{Adjacent}}$

### Fundamental Pythgorean Identity
$$\\sin^2 \\theta + \\cos^2 \\theta = 1$$

### Reciprocal Identities
- $\\csc \\theta = \\frac{1}{\\sin \\theta}$
- $\\sec \\theta = \\frac{1}{\\cos \\theta}$
- $\\cot \\theta = \\frac{1}{\\tan \\theta}$
`
  },

  // Computer Notes
  {
    id: "comp-1",
    title: "Modern Database Management (DBMS)",
    category: SubjectCategory.COMPUTER,
    readingTimeMinutes: 10,
    content: `## Introduction to DBMS
A Database Management System (DBMS) is software designed to store, retrieve, define, and manage data in a database.

### Relational Database Management Systems (RDBMS)
Data is organized into tables consisting of columns (fields) and rows (records).
- **SQL (Structured Query Language)** is used to interact with RDBMS.
- *Examples*: PostgreSQL, MySQL, SQLite, Oracle Database.

### NoSQL Databases (Not Only SQL)
Designed for unstructured data, high volume, and rapid scaling.
1. **Document Stores**: JSON collections (MongoDB, Firestore).
2. **Key-Value Stores**: Fast cache lookups (Redis).
3. **Graph Databases**: For interconnected maps (Neo4j).

### ACID Properties of Transactions
To ensure data integrity, reliable databases fulfill **ACID**:
- **Atomicity**: Entire transaction completes, or nothing at all.
- **Consistency**: Data stays valid according to rules & schemas.
- **Isolation**: Concurrent transactions do not affect each other.
- **Durability**: Completed transaction updates remain even during server failures.
`
  },
  {
    id: "comp-2",
    title: "Understanding IP Addresses & DNS",
    category: SubjectCategory.COMPUTER,
    readingTimeMinutes: 6,
    content: `## How the Internet Finds Websites
When you type website names like \`google.com\`, computers need numeric coordinates to locate corresponding physical servers.

### 1. IP Addresses (Internet Protocol)
The unique address identifying device connections on networks.
- **IPv4**: 32-bit addresses written as 4 octets (e.g., \`192.168.1.1\`). Limited to ~4.3 billion combinations.
- **IPv6**: 128-bit addresses written in hexadecimal (e.g., \`2001:0db8:85a3:0000:0000:8a2e:0370:7334\`). Virtually limitless.

### 2. DNS (Domain Name System)
Often referred to as the "Domain Phonebook of the internet", DNS translates human-friendly hostnames into machine-routable IP addresses.
- **Recursive resolver**: Receives the query and searches root, TLD, and authoritative nameservers to fetch the IP address, caching it for subsequent queries.
`
  },

  // English Notes
  {
    id: "eng-1",
    title: "Active vs. Passive Voice Rules",
    category: SubjectCategory.ENGLISH,
    readingTimeMinutes: 4,
    content: `## Active vs. Passive Voice
Using active or passive voice changes the sentence's point of emphasis, determining whether the subject performs or receives the action.

### Active Voice (Subject → Verb → Object)
The subject of the sentence performs the action. It is direct, concise, and strong.
- *Structure*: \`[Subject] + [Verb] + [Object]\`
- *Example*: *“The student scored a perfect score on the math quiz.”*

### Passive Voice (Object ← Verb ← Subject)
The subject is acted upon by the verb of the sentence. Often, the performer is omitted or added as an afterthought.
- *Structure*: \`[Object] + [Auxiliary Verb 'To Be'] + [Past Participle] + [by Subject]\`
- *Example*: *“A perfect score on the math quiz was scored by the student.”*

### When to Use Passive Voice:
- When the actor is unknown: *“My calculator was stolen!”*
- When the object is the main focus: *“The educational notes were downloaded thousands of times.”*
`
  },

  // GK Notes
  {
    id: "gk-1",
    title: "Ecosystems and Geography of Nepal",
    category: SubjectCategory.GK,
    readingTimeMinutes: 9,
    content: `## The Geography of Nepal
Nepal is an highly diverse landlocked country situated in South Asia, nestled between India and China. It is famous for its extreme elevation variations and rich microclimates.

### 1. Geographic Regions
Nepal is traditionally divided into three distinct physiographic belts:
- **Himalayan Region**: Bordering the northern ranges. It contains **eight of the world's ten tallest mountains**, including the summit **Mount Everest (Sagarmatha)** rising to 8848.86 meters.
- **Hilly Region**: Formed by the Mahabharat Range and mid-hills. Includes central valleys containing Kathmandu (the capital) and Pokhara.
- **Terai (Plains) Region**: The low-lying southern alluvial plains bordering India, essential for the country's agriculture.

### 2. Major Rivers & Lakes
Nepal features massive fresh water sources from high glaciers:
- **Koshi**: Known as the sorrow of Bihar, the largest river system.
- **Gandaki**: Central river basin.
- **Karnali**: The longest river in Nepal.
- **Rara Lake**: The largest freshwater lake, located in Mugu district.
`
  }
];

export const INITIAL_MCQS: MCQQuestion[] = [
  // SCIENCE
  {
    id: "sci-mcq-1",
    category: SubjectCategory.SCIENCE,
    difficulty: DifficultyLevel.EASY,
    question: "Which gas do plants absorb from the atmosphere for photosynthesis?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctIndex: 1,
    explanation: "Plants absorb carbon dioxide (CO2) from the air and release oxygen (O2) as an outcome of photosynthesis."
  },
  {
    id: "sci-mcq-2",
    category: SubjectCategory.SCIENCE,
    difficulty: DifficultyLevel.MEDIUM,
    question: "What is the acceleration due to gravity on Earth's surface?",
    options: ["5.5 m/s²", "9.8 m/s²", "12.0 m/s²", "3.1 m/s²"],
    correctIndex: 1,
    explanation: "Gravity on Earth accelerates falling objects at approximately 9.8 meters per second squared (9.8 m/s²)."
  },
  {
    id: "sci-mcq-3",
    category: SubjectCategory.SCIENCE,
    difficulty: DifficultyLevel.HARD,
    question: "Which element has the highest thermal conductivity of any natural metal?",
    options: ["Gold", "Copper", "Silver", "Aluminum"],
    correctIndex: 2,
    explanation: "Silver is the most thermally and electrically conductive metal in the periodic table, slightly ahead of copper and gold."
  },

  // MATH
  {
    id: "math-mcq-1",
    category: SubjectCategory.MATH,
    difficulty: DifficultyLevel.EASY,
    question: "Solve for x: 3x - 7 = 8",
    options: ["x = 3", "x = 5", "x = 15", "x = 1.5"],
    correctIndex: 1,
    explanation: "Add 7 to both sides: 3x = 15. Division yields x = 5."
  },
  {
    id: "math-mcq-2",
    category: SubjectCategory.MATH,
    difficulty: DifficultyLevel.MEDIUM,
    question: "What is the value of sin(30 degrees)?",
    options: ["1", "0.5", "0.866", "0.707"],
    correctIndex: 1,
    explanation: "In trigonometry, the sine of a 30° angle is exactly 1/2 or 0.5."
  },
  {
    id: "math-mcq-3",
    category: SubjectCategory.MATH,
    difficulty: DifficultyLevel.HARD,
    question: "The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:",
    options: ["-8", "8", "4", "-4"],
    correctIndex: 0,
    explanation: "D = b² - 4ac. Here D = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, there are no real roots."
  },

  // COMPUTER
  {
    id: "comp-mcq-1",
    category: SubjectCategory.COMPUTER,
    difficulty: DifficultyLevel.EASY,
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Media Layout",
      "Hyper Transfer Magic Link",
      "Home Tool Management Logger"
    ],
    correctIndex: 0,
    explanation: "HTML stands for Hyper Text Markup Language. It is the core skeleton of any web page."
  },
  {
    id: "comp-mcq-2",
    category: SubjectCategory.COMPUTER,
    difficulty: DifficultyLevel.MEDIUM,
    question: "Which port does HTTPS securely operate on by default?",
    options: ["Port 80", "Port 21", "Port 443", "Port 8080"],
    correctIndex: 2,
    explanation: "Standard secure HTTPS traffic operates on Port 443, while standard unencrypted HTTP utilizes Port 80."
  },
  {
    id: "comp-mcq-3",
    category: SubjectCategory.COMPUTER,
    difficulty: DifficultyLevel.HARD,
    question: "Which DBMS property guarantees that concurrent transactions do not interfere with or corrupt each other?",
    options: ["Concurrency", "Atomicity", "Durability", "Isolation"],
    correctIndex: 3,
    explanation: "Isolation ensures that concurrent transactions behave as if executed serially without overlap interference."
  },

  // ENGLISH
  {
    id: "eng-mcq-1",
    category: SubjectCategory.ENGLISH,
    difficulty: DifficultyLevel.EASY,
    question: "Identify the conjunction in this sentence: 'I wanted to study, but I felt too tired.'",
    options: ["I", "study", "but", "tired"],
    correctIndex: 2,
    explanation: "'But' connects the two independent clauses, acting as a coordinating conjunction."
  },
  {
    id: "eng-mcq-2",
    category: SubjectCategory.ENGLISH,
    difficulty: DifficultyLevel.MEDIUM,
    question: "Choose the correct spelling:",
    options: ["Accomodate", "Acommodate", "Accommodate", "Acomodate"],
    correctIndex: 2,
    explanation: "Accommodate features a double 'c' and double 'm'."
  },
  {
    id: "eng-mcq-3",
    category: SubjectCategory.ENGLISH,
    difficulty: DifficultyLevel.HARD,
    question: "Complete the sentence with the appropriate conditional mood: 'If she ___ hard, she would have passed.'",
    options: ["studies", "studied", "had studied", "would study"],
    correctIndex: 2,
    explanation: "This is a third conditional setup (past hypothetical action with a past hypothetical result), requiring 'had studied'."
  },

  // GENERAL KNOWLEDGE (GK)
  {
    id: "gk-mcq-1",
    category: SubjectCategory.GK,
    difficulty: DifficultyLevel.EASY,
    question: "What is the capital city of Nepal?",
    options: ["Pokhara", "Kathmandu", "Lalitpur", "Biratnagar"],
    correctIndex: 1,
    explanation: "Kathmandu is the historical, cultural, and political capital city of Nepal."
  },
  {
    id: "gk-mcq-2",
    category: SubjectCategory.GK,
    difficulty: DifficultyLevel.MEDIUM,
    question: "Which is the tallest mountain in the world?",
    options: ["K2", "Mount Kangchenjunga", "Lhotse", "Mount Everest"],
    correctIndex: 3,
    explanation: "Mount Everest (Sagarmatha) is the world's highest peak above sea level, standing at 8848.86m."
  },
  {
    id: "gk-mcq-3",
    category: SubjectCategory.GK,
    difficulty: DifficultyLevel.HARD,
    question: "Which district of Nepal is the famous freshwater 'Rara Lake' situated in?",
    options: ["Mustang", "Mugu", "Dolpa", "Humla"],
    correctIndex: 1,
    explanation: "Rara Lake, the largest freshwater lake of Nepal, is situated within Rara National Park in Mugu district."
  }
];

export const INITIAL_VIDEOS: EducationalVideo[] = [
  {
    id: "vid-1",
    title: "How Photosynthesis Works - Step-by-Step",
    category: SubjectCategory.SCIENCE,
    youtubeId: "sQK3Yr4Sc_k", // TED-Ed Photosynthesis
    duration: "5:20",
    thumbnailUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=500&auto=format&fit=crop",
    description: "Learn about the light reactions and the Calvin cycle in plant cells where carbon dioxide is transformed."
  },
  {
    id: "vid-2",
    title: "Newton's Laws of Motion - Physics Crash Course",
    category: SubjectCategory.SCIENCE,
    youtubeId: "kKKM8Y-g7lk", // CrashCourse physics Newton
    duration: "10:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
    description: "An interactive breakdown of the 3 fundamental laws governing forces, masses, and acceleration."
  },
  {
    id: "vid-3",
    title: "The Quadratic Formula Demystified",
    category: SubjectCategory.MATH,
    youtubeId: "Efe21g92uHA", // Khan Academy Math
    duration: "8:15",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop",
    description: "Learn how to use the quadratic formula to solve any second-degree poly equation easily."
  },
  {
    id: "vid-4",
    title: "How DNS and IP Routing Powers Web Connections",
    category: SubjectCategory.COMPUTER,
    youtubeId: "2DFZLEKbeTM", // CrashCourse DNS/Network
    duration: "12:05",
    thumbnailUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop",
    description: "Understand the backbone architecture of DNS mapping, recursive lookups, and internet routes."
  },
  {
    id: "vid-5",
    title: "Active voice vs. Passive voice - Grammar Essentials",
    category: SubjectCategory.ENGLISH,
    youtubeId: "pS6tN8l88E8", // Grammar video
    duration: "4:30",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop",
    description: "Quick mnemonic tricks to instantly recognize passive structures and strengthen writing flows."
  },
  {
    id: "vid-6",
    title: "Stunning Geography & Treasures of Nepal",
    category: SubjectCategory.GK,
    youtubeId: "kUcl0tH_EIs", // Nepal tour video
    duration: "6:50",
    thumbnailUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&auto=format&fit=crop",
    description: "A cultural and geographic exploration of Nepal's high peaks, lakes, and diverse Terai landscapes."
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { uid: "st-1", name: "Anish Shrestha", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Anish", score: 870, quizzesCompleted: 15 },
  { uid: "st-2", name: "Sita Kumari", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Sita", score: 820, quizzesCompleted: 14 },
  { uid: "st-3", name: "Niranjan Thapa", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Niranjan", score: 750, quizzesCompleted: 12 },
  { uid: "st-4", name: "Pooja Sharma", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Pooja", score: 640, quizzesCompleted: 10 },
  { uid: "st-5", name: "Sabin Tamang", avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Sabin", score: 550, quizzesCompleted: 8 }
];

export const STUDY_BADGES: Badge[] = [
  { id: "badge-streak-1", title: "First Spark", description: "Learn 1 day in a row", icon: "Flame" },
  { id: "badge-streak-3", title: "Study Warrior", description: "Maintain a 3-day study streak", icon: "Shield" },
  { id: "badge-quiz-perfect", title: "Brainiac", description: "Get 100% correct in any quiz", icon: "Award" },
  { id: "badge-notes-read", title: "Note Devourer", description: "Read all subject-wise notes", icon: "BookOpen" },
  { id: "badge-ai-help", title: "Curious Minds", description: "Ask the AI tutor a study question", icon: "Sparkles" },
  { id: "admin-master", title: "Contributor", description: "Access or manage contents in Admin console", icon: "Wrench" }
];
