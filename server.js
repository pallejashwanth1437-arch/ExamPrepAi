import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Middleware
app.use(cors());
app.use(express.json());
// Serve frontend static assets from root of /
app.use(express.static(path.join(__dirname, 'frontend')));

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
// Multer configuration: use memory storage to be compatible with serverless/read-only environments
const upload = multer({ storage: multer.memoryStorage() });

// Database helper
import mongoose from 'mongoose';

const DB_FILE = path.join(UPLOADS_DIR, 'db.json');
let isMongoConnected = false;

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI && !MONGODB_URI.includes('<db_password>')) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log("SUCCESS: Connected to MongoDB Atlas!");
      isMongoConnected = true;
    })
    .catch(err => {
      console.error("MongoDB Atlas connection failed. Falling back to local db.json storage. Error:", err.message);
    });
} else {
  console.log("MongoDB connection string not configured or contains placeholder <db_password>. Using local db.json storage.");
}

// Document Schema
const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  pages: { type: mongoose.Schema.Types.Mixed, default: 1 },
  date: { type: String, required: true },
  chunks: { type: mongoose.Schema.Types.Mixed, default: 1 },
  status: { type: String, default: 'ready' },
  pdfFile: { type: String, required: true },
  textFile: { type: String, required: true },
  content: { type: String, default: '' }
});

const DocumentModel = mongoose.models.Document || mongoose.model('Document', documentSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  initials: { type: String, required: true },
  college: { type: String, default: '' },
  course: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  analytics: {
    questionsAsked: { type: Number, default: 0 },
    quizzesDone: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    avgScore: { type: Number, default: 0 },
    flashcards: { type: Number, default: 0 },
    studyTime: { type: Number, default: 0 },
    summaries: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    lastActive: { type: Date, default: Date.now }
  }
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// Local User database fallback helper
const USERS_FILE = path.join(UPLOADS_DIR, 'users.json');
function readUsersDB() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (err) {
    console.error("Error reading users file:", err);
    return [];
  }
}

function writeUsersDB(data) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing users file:", err);
  }
}

// Password hashing helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Increment user analytics metric helper
async function incrementUserAnalytic(email, field, incrementVal = 1) {
  if (!email) return;
  const normalizedEmail = email.toLowerCase().trim();
  if (isMongoConnected) {
    try {
      const update = {};
      update[`analytics.${field}`] = incrementVal;
      await UserModel.findOneAndUpdate({ email: normalizedEmail }, { $inc: update });
    } catch (err) {
      console.error(`Error incrementing ${field} in MongoDB:`, err);
    }
  } else {
    const users = readUsersDB();
    const idx = users.findIndex(u => u.email === normalizedEmail);
    if (idx !== -1) {
      if (!users[idx].analytics) {
        users[idx].analytics = {
          questionsAsked: 0,
          quizzesDone: 0,
          totalScore: 0,
          avgScore: 0,
          flashcards: 0,
          studyTime: 0,
          summaries: 0,
          streak: 1,
          lastActive: new Date().toISOString()
        };
      }
      users[idx].analytics[field] = (users[idx].analytics[field] || 0) + incrementVal;
      writeUsersDB(users);
    }
  }
}

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (err) {
    console.error("Error reading database file:", err);
    return [];
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// Helper to get PDF text
async function getDocText(docId) {
  let doc;
  if (isMongoConnected) {
    try {
      doc = await DocumentModel.findOne({ id: docId }).lean();
    } catch (err) {
      console.error("Error finding doc in MongoDB:", err);
    }
  }
  if (!doc) {
    const db = readDB();
    doc = db.find(d => d.id === docId);
  }
  if (!doc) return '';
  if (doc.content) {
    return doc.content;
  }
  if (!doc.textFile) return '';
  const textFilePath = path.join(UPLOADS_DIR, doc.textFile);
  if (fs.existsSync(textFilePath)) {
    return fs.readFileSync(textFilePath, 'utf-8');
  }
  return '';
}

// Gemini AI Helper
function getGenAIModel(jsonOutput = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set. Please configure it in your .env file.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: jsonOutput ? { responseMimeType: "application/json" } : {}
  });
}

// --- API ENDPOINTS ---

// 1. Get List of Documents
app.get('/api/documents', async (req, res) => {
  try {
    if (isMongoConnected) {
      const docs = await DocumentModel.find({}).lean();
      return res.json(docs);
    }
    res.json(readDB());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Upload Document
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = req.file.buffer;

    // Extract text from PDF
    const data = await pdf(fileBuffer);
    const textContent = data.text;
    const pageCount = data.numpages;

    // Save text contents to associated txt file (optional backup)
    const docId = Date.now().toString();
    const textFileName = `${docId}.txt`;
    try {
      fs.writeFileSync(path.join(UPLOADS_DIR, textFileName), textContent);
    } catch (e) {
      console.warn("Could not write txt backup file to disk (expected in serverless environments):", e.message);
    }

    // Create metadata record
    const newDoc = {
      id: docId,
      name: req.file.originalname,
      pages: pageCount || 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      chunks: Math.ceil(textContent.length / 1000) || 1,
      status: 'ready',
      pdfFile: req.file.originalname,
      textFile: textFileName,
      content: textContent
    };

    if (isMongoConnected) {
      await DocumentModel.create(newDoc);
    } else {
      const db = readDB();
      db.push(newDoc);
      writeDB(db);
    }

    if (req.body.email) {
      await incrementUserAnalytic(req.body.email, 'studyTime', 1);
    }

    res.json(newDoc);
  } catch (err) {
    console.error("PDF upload/parsing error:", err);
    res.status(500).json({ error: 'Failed to process PDF: ' + err.message });
  }
});

// 3. Delete Document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let doc;

    if (isMongoConnected) {
      doc = await DocumentModel.findOne({ id }).lean();
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }
      await DocumentModel.deleteOne({ id });
    } else {
      const db = readDB();
      const docIndex = db.findIndex(d => d.id === id);
      if (docIndex === -1) {
        return res.status(404).json({ error: 'Document not found' });
      }
      doc = db[docIndex];
      db.splice(docIndex, 1);
      writeDB(db);
    }
    
    // Delete files (optional backup cleanup)
    try {
      const pdfPath = path.join(UPLOADS_DIR, doc.pdfFile);
      const txtPath = path.join(UPLOADS_DIR, doc.textFile);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
      if (fs.existsSync(txtPath)) fs.unlinkSync(txtPath);
    } catch (e) {
      console.warn("Could not delete backup files from disk:", e.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Delete document error:", err);
    res.status(500).json({ error: 'Failed to delete document: ' + err.message });
  }
});

// 4. AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, docId, email } = req.body;
    const docText = docId ? await getDocText(docId) : '';

    let prompt = '';
    if (docText) {
      prompt += `You are an AI study assistant for ExamPrep AI.
Use the following document text as your knowledge base to answer the user's question. Support your answers with page numbers or section names from the text if available.
If the answer cannot be found in the document, answer the question using your general knowledge but clearly state that the information was not in the uploaded file.

Document Context:
---
${docText}
---
\n`;
    } else {
      prompt += `You are an AI study assistant for ExamPrep AI. Since the user has not selected a document, answer their study questions directly using your general knowledge.\n\n`;
    }

    if (history && history.length > 0) {
      prompt += `Conversation history:\n`;
      history.forEach(h => {
        prompt += `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}\n`;
      });
    }

    prompt += `User: ${message}\nAssistant:`;

    const model = getGenAIModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (email) {
      await incrementUserAnalytic(email, 'questionsAsked');
    }

    res.json({ text: responseText });
  } catch (err) {
    console.error("AI Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 5. Generate Quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { docId, numQuestions, difficulty, types } = req.body;
    const docText = await getDocText(docId);

    if (!docText) {
      return res.status(400).json({ error: 'Please upload and select a document first.' });
    }

    const typesStr = (types && types.length > 0) ? types.join(', ') : 'MCQ';
    const prompt = `Based on the following document context, generate a quiz with exactly ${numQuestions} questions.
Difficulty level: ${difficulty}.
Question types: ${typesStr}.

Document Context:
---
${docText}
---

Output MUST be a JSON array of objects. Each object must have this exact schema:
{
  "q": "The question text",
  "opts": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0, // 0-based index of the correct option in the opts array
  "exp": "Detailed explanation of the correct answer"
}

Do not include markdown code block syntax (like \`\`\`json) in your response. Return ONLY the JSON array.`;

    const model = getGenAIModel(true);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json(JSON.parse(responseText.trim()));
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Generate Flashcards
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { docId, email } = req.body;
    const docText = await getDocText(docId);

    if (!docText) {
      return res.status(400).json({ error: 'Please upload and select a document first.' });
    }

    const prompt = `Based on the following document context, generate 8-12 high-quality flashcards for study review. Focus on key terms, definitions, and core concepts.

Document Context:
---
${docText}
---

Output MUST be a JSON array of objects. Each object must have this exact schema:
{
  "q": "The question or concept name (front of card)",
  "a": "The answer or definition (back of card)"
}

Do not include markdown code block syntax. Return ONLY the JSON array.`;

    const model = getGenAIModel(true);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cards = JSON.parse(responseText.trim());

    if (email && Array.isArray(cards)) {
      await incrementUserAnalytic(email, 'flashcards', cards.length);
      await incrementUserAnalytic(email, 'studyTime', 1);
    }

    res.json(cards);
  } catch (err) {
    console.error("Flashcard generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Generate Summary
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { docId, summaryType, email } = req.body;
    const docText = await getDocText(docId);

    if (!docText) {
      return res.status(400).json({ error: 'Please upload and select a document first.' });
    }

    const prompt = `Based on the following document context, generate a study summary.
Summary Type requested: ${summaryType}.
Format the output using clear markdown headers, bullet points, and highlight critical keywords using HTML spans with class "key-point" (e.g. <span class="key-point">nucleophilic substitution</span>).

Document Context:
---
${docText}
---`;

    const model = getGenAIModel();
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (email) {
      await incrementUserAnalytic(email, 'summaries');
      await incrementUserAnalytic(email, 'studyTime', 1);
    }

    res.json({ text: responseText });
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Generate Important Questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { docId } = req.body;
    const docText = await getDocText(docId);

    if (!docText) {
      return res.status(400).json({ error: 'Please upload and select a document first.' });
    }

    const prompt = `Based on the following document context, predict 6 important exam questions that are likely to be asked.

Document Context:
---
${docText}
---

Output MUST be a JSON array of objects. Each object must have this exact schema:
{
  "q": "The predicted exam question",
  "type": "Short Answer" | "Long Answer" | "True/False",
  "diff": "Easy" | "Medium" | "Hard",
  "topic": "The topic or chapter name"
}

Do not include markdown code block syntax. Return ONLY the JSON array.`;

    const model = getGenAIModel(true);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json(JSON.parse(responseText.trim()));
  } catch (err) {
    console.error("Questions prediction error:", err);
    res.status(500).json({ error: err.message });
  }
});

// --- AUTH ENDPOINTS ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields (name, email, password) are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    let existingUser = false;
    if (isMongoConnected) {
      existingUser = await UserModel.findOne({ email: normalizedEmail });
    } else {
      const users = readUsersDB();
      existingUser = users.find(u => u.email === normalizedEmail);
    }

    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    // Generate initials
    const initials = name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';
    const passwordHash = hashPassword(password);

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      initials,
      college: '',
      course: '',
      analytics: {
        questionsAsked: 0,
        quizzesDone: 0,
        totalScore: 0,
        avgScore: 0,
        flashcards: 0,
        studyTime: 0,
        summaries: 0,
        streak: 1,
        lastActive: new Date().toISOString()
      }
    };

    if (isMongoConnected) {
      await UserModel.create(newUser);
    } else {
      const users = readUsersDB();
      users.push(newUser);
      writeUsersDB(users);
    }

    // Omit passwordHash before sending user details to frontend
    const { passwordHash: _, ...userProfile } = newUser;
    res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    if (isMongoConnected) {
      user = await UserModel.findOne({ email: normalizedEmail }).lean();
    } else {
      const users = readUsersDB();
      user = users.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const { passwordHash: _, ...userProfile } = user;
    res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Authentication failed: ' + err.message });
  }
});

// Update Profile
app.post('/api/auth/update-profile', async (req, res) => {
  try {
    const { currentEmail, name, email, college, course } = req.body;
    if (!currentEmail || !name || !email) {
      return res.status(400).json({ error: 'Name, email, and current email reference are required.' });
    }

    const normalizedCurrentEmail = currentEmail.toLowerCase().trim();
    const normalizedNewEmail = email.toLowerCase().trim();

    // Check if new email is taken by another user
    if (normalizedCurrentEmail !== normalizedNewEmail) {
      let isEmailTaken = false;
      if (isMongoConnected) {
        isEmailTaken = await UserModel.findOne({ email: normalizedNewEmail });
      } else {
        const users = readUsersDB();
        isEmailTaken = users.find(u => u.email === normalizedNewEmail);
      }
      if (isEmailTaken) {
        return res.status(400).json({ error: 'This email is already taken by another account.' });
      }
    }

    const initials = name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'US';

    let updatedUser;
    if (isMongoConnected) {
      updatedUser = await UserModel.findOneAndUpdate(
        { email: normalizedCurrentEmail },
        { name: name.trim(), email: normalizedNewEmail, college: college || '', course: course || '', initials },
        { new: true }
      ).lean();
    } else {
      const users = readUsersDB();
      const idx = users.findIndex(u => u.email === normalizedCurrentEmail);
      if (idx !== -1) {
        users[idx].name = name.trim();
        users[idx].email = normalizedNewEmail;
        users[idx].college = college || '';
        users[idx].course = course || '';
        users[idx].initials = initials;
        writeUsersDB(users);
        updatedUser = users[idx];
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const { passwordHash: _, ...userProfile } = updatedUser;
    res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// Record Quiz Results and Update Analytics
app.post('/api/auth/record-quiz', async (req, res) => {
  try {
    const { email, score, totalQuestions } = req.body;
    if (!email || score === undefined || !totalQuestions) {
      return res.status(400).json({ error: 'Email, score, and totalQuestions are required.' });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const pct = (score / totalQuestions) * 100;
    let updatedUser;
    if (isMongoConnected) {
      const user = await UserModel.findOne({ email: normalizedEmail });
      if (user) {
        const newQuizzesDone = (user.analytics?.quizzesDone || 0) + 1;
        const newTotalScore = (user.analytics?.totalScore || 0) + pct;
        const newAvgScore = newTotalScore / newQuizzesDone;
        updatedUser = await UserModel.findOneAndUpdate(
          { email: normalizedEmail },
          {
            $set: {
              'analytics.quizzesDone': newQuizzesDone,
              'analytics.totalScore': newTotalScore,
              'analytics.avgScore': newAvgScore
            },
            $inc: { 'analytics.studyTime': 1 }
          },
          { new: true }
        ).lean();
      }
    } else {
      const users = readUsersDB();
      const idx = users.findIndex(u => u.email === normalizedEmail);
      if (idx !== -1) {
        const u = users[idx];
        if (!u.analytics) {
          u.analytics = { questionsAsked: 0, quizzesDone: 0, totalScore: 0, avgScore: 0, flashcards: 0, studyTime: 0, summaries: 0, streak: 1, lastActive: new Date().toISOString() };
        }
        u.analytics.quizzesDone += 1;
        u.analytics.totalScore += pct;
        u.analytics.avgScore = u.analytics.totalScore / u.analytics.quizzesDone;
        u.analytics.studyTime += 1;
        writeUsersDB(users);
        updatedUser = u;
      }
    }
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    const { passwordHash: _, ...userProfile } = updatedUser;
    res.json({ success: true, user: userProfile });
  } catch (err) {
    console.error("Record quiz error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ExamPrep AI backend is running on http://localhost:${PORT}`);
  });
}

export default app;
