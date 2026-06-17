# ExamPrep AI ⚡

ExamPrep AI is a premium, AI-powered exam preparation platform. It enables students to upload course documents, interact with their material via contextual AI chat, practice generated quizzes with performance tracking, study AI-curated flashcards, read summaries, and view predicted exam questions.

---

## 📁 File Structure

The project follows a clean, modular structure separating the client-side single page application (SPA) from the server-side controller layer:

```
ExamPrepAi/
├── frontend/                   # Client-side single page web application
│   ├── css/                    # Core stylesheets
│   │   ├── pages.css           # Component and page animations/styles
│   │   └── style.css           # Global layout, variables, and general design system
│   ├── js/                     # Modular frontend scripts
│   │   ├── pages/              # Individual page templates and controllers
│   │   │   ├── analytics.js    # Statistics review and weekly charts
│   │   │   ├── auth.js         # Register, Login, and state transition actions
│   │   │   ├── chat.js         # PDF-contextual AI study chat page
│   │   │   ├── dashboard.js    # Dynamic stats panels and recent activities overview
│   │   │   ├── documents.js    # PDF uploading, list metadata, and deletion triggers
│   │   │   ├── flashcards.js   # Flipcard deck generation and review session controls
│   │   │   ├── landing.js      # Beautiful greeting page and landing CTAs
│   │   │   ├── profile.js      # User account settings and achievements details
│   │   │   ├── questions.js    # Predicted exam questions grid
│   │   │   ├── quiz.js         # Multiple choice quiz practicing and grading
│   │   │   └── settings.js     # User configuration preferences
│   │   ├── components.js       # Shared layout headers, sticky navbars, and sidebar panels
│   │   ├── router.js           # SPA hash routing table and layout wrappers
│   │   ├── state.js            # Central Pub/Sub state manager and backend API integration
│   │   └── utils.js            # String processing and format utilities
│   └── index.html              # Main HTML entrypoint and SPA application shell
├── uploads/                    # Dynamic server files (PDF uploads, text chunks, local fallback DBs)
├── .env                        # Environment configurations (Port, API Keys, database URIs)
├── .gitignore                  # Production Git ignore configurations
├── package.json                # Project manifest, dependencies, and execution scripts
└── server.js                   # Node.js + Express backend server and AI controller endpoints
```

---

## ⚙️ Environment Variables

Ensure the following variables are configured in your `.env` file (or in your hosting platform dashboard):

| Variable Name | Description | Example / Value |
| --- | --- | --- |
| `PORT` | The port the Express server listens to (defaults to 3000 if omitted) | `3000` |
| `GEMINI_API_KEY` | API Key from Google AI Studio to power conversational features | `AIzaSy...` |
| `MONGODB_URI` | Connection URI to connect to MongoDB Atlas database | `mongodb+srv://...` |

> [!NOTE]
> If `MONGODB_URI` is not supplied or is left as a placeholder, the server automatically defaults to storing users and documents locally under `uploads/users.json` and `uploads/db.json`.

---

## 🚀 Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Start in Development (Watch Mode)
```bash
npm run dev
```

### 3. Start in Production Mode
```bash
npm start
```

---

## 🌐 Production Deployment

ExamPrep AI is ready to be deployed to standard Node.js hosting environments (such as Render, Heroku, Railway, or standard VPS servers).

### Render / Heroku / Railway Steps:
1. **Repository**: Push the code to a Git repository (GitHub/GitLab).
2. **Build Configuration**:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Settings**: Add your `GEMINI_API_KEY` and `MONGODB_URI` in the Environment Variables tab.
4. **App Access**: The service will compile dependencies and run on `http://localhost:${PORT}` mapped to your public domain.
