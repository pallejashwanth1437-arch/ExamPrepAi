export function renderLanding() {
  const features = [
    { icon: '💬', title: 'AI Chat with PDFs', desc: 'Query concepts and chapters in your lecture slides. Get cited answers mapped back to specific page sources.' },
    { icon: '📝', title: 'Smart Quiz Generator', desc: 'Generate MCQs and True/False practice exams of varying difficulty directly from your uploaded materials.' },
    { icon: '🃏', title: 'Spaced-Repetition Cards', desc: 'Convert dense textbooks into review cards. Review and track card retention with "Known" / "Review" states.' },
    { icon: '📄', title: 'AI Study Summaries', desc: 'Generate high-quality short digests, in-depth chapter notes, exam sheets, or question-answer study guides.' },
    { icon: '❓', title: 'Exam Questions Predictor', desc: 'Gemini analyzes topic structures to forecast the most likely exam questions, complete with answers.' },
    { icon: '📊', title: 'Study Analytics Dashboard', desc: 'Monitor your mock exam scores, track total study hours, view weekly streaks, and follow performance progress.' }
  ];

  const steps = [
    { num: '01', title: 'Upload Study PDFs', desc: 'Drag and drop your lecture notes, textbook chapters, or unit papers. The parser analyzes pages and extracts raw text context.' },
    { num: '02', title: 'AI Chunking & Processing', desc: 'Our backend processes documents securely, cataloging context structures to make them ready for fast semantic reference.' },
    { num: '03', title: 'Interact & Study', desc: 'Use AI chat to answer complex queries, practice mock exams, review flashcard decks, and monitor weekly retention metrics.' }
  ];

  return `
    <div class="landing" style="background: var(--bg0); color: var(--text1); overflow-x: hidden;">
      <!-- Glassmorphism Navigation Bar -->
      <nav class="lp-nav" style="border-bottom: 1px solid var(--border); background: rgba(8, 12, 20, 0.85); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 1000; padding: 0 40px;">
        <span class="lp-nav-logo" style="font-size: 20px; font-weight: 800; background: linear-gradient(135deg, #fff, var(--accent3)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.02em;">⚡ ExamPrep AI</span>
        <div style="display: flex; gap: 12px; align-items: center">
          <button class="btn btn-outline btn-sm" onclick="navigate('login')" style="border-radius: 20px; padding: 6px 16px;">Go to App</button>
          <button class="btn btn-primary btn-sm" onclick="navigate('signup')" style="border-radius: 20px; padding: 6px 18px; box-shadow: 0 0 16px rgba(99,102,241,0.4);">Get Started</button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero" style="padding: 100px 24px 80px; position: relative;">
        <div class="hero-bg"></div>
        <div class="hero-bg2"></div>
        <div class="particles" id="particles"></div>
        
        <div class="hero-badge animate-fade-in delay-1" style="background: rgba(99, 102, 241, 0.08); border-color: rgba(99, 102, 241, 0.25); color: var(--accent3); border-radius: 30px;">
          ✨ Integrated with Gemini 2.5 Flash API
        </div>
        
        <h1 class="hero-h1 animate-fade-in delay-2" style="font-size: 58px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; max-width: 800px; letter-spacing: -0.03em;">
          Master Your Exams with <br><span>Next-Gen AI Context</span>
        </h1>
        
        <p class="hero-sub animate-fade-in delay-3" style="font-size: 16px; color: var(--text2); max-width: 580px; line-height: 1.6; margin-bottom: 40px;">
          Upload your PDFs and let our advanced document pipeline build custom chat sessions, flashcards, MCQs, and summaries. Study smarter, retain longer.
        </p>
        
        <div class="hero-btns animate-fade-in delay-4" style="margin-bottom: 60px;">
          <button class="btn-hero-primary" onclick="navigate('login')" style="padding: 14px 36px; border-radius: 30px; font-size: 15px; background: linear-gradient(135deg, var(--accent), #4f46e5); font-weight: 700;">🚀 Launch Dashboard</button>
          <button class="btn-hero-secondary" onclick="document.getElementById('features-section').scrollIntoView({behavior: 'smooth'})" style="padding: 13px 32px; border-radius: 30px; font-size: 15px;">Explore Features</button>
        </div>
        
        <div class="hero-stats animate-fade-in delay-5" style="border-top-color: var(--border); padding-top: 32px; gap: 48px;">
          <div style="text-align: center">
            <div class="hero-stat-num" style="font-size: 28px; font-weight: 800;">50K+</div>
            <div class="hero-stat-label" style="font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text3)">Students</div>
          </div>
          <div style="text-align: center">
            <div class="hero-stat-num" style="font-size: 28px; font-weight: 800;">2M+</div>
            <div class="hero-stat-label" style="font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text3)">Study Materials</div>
          </div>
          <div style="text-align: center">
            <div class="hero-stat-num" style="font-size: 28px; font-weight: 800;">98.4%</div>
            <div class="hero-stat-label" style="font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text3)">Success Rate</div>
          </div>
        </div>
      </section>

      <!-- Key Capabilities Grid Section -->
      <section id="features-section" class="features-section" style="background: var(--bg1); padding: 80px 40px; border-top: 1px solid var(--border);">
        <div style="text-align: center; margin-bottom: 50px">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent3); margin-bottom: 12px">Core Capabilities</div>
          <h2 style="font-size: 32px; font-weight: 800; letter-spacing: -.02em; background: linear-gradient(135deg, #fff, var(--text2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">Supercharge Your Study Session</h2>
          <p style="color: var(--text3); font-size: 13.5px; margin-top: 8px; max-width: 500px; margin-left: auto; margin-right: auto;">Everything you need to digest course materials, check retention levels, and predict exam items.</p>
        </div>
        
        <div class="features-grid" style="max-width: 1200px; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          ${features.map(f => `
            <div class="feature-card" style="border-radius: 16px; background: linear-gradient(135deg, rgba(20, 28, 46, 0.6), rgba(13, 17, 23, 0.9)); border-color: var(--border);">
              <div class="feature-icon" style="font-size: 30px; margin-bottom: 16px; width: 50px; height: 50px; background: var(--bg3); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border);">${f.icon}</div>
              <div class="feature-title" style="font-size: 15px; font-weight: 700; margin-bottom: 8px; color: var(--text1);">${f.title}</div>
              <div class="feature-desc" style="font-size: 12.5px; color: var(--text2); line-height: 1.6;">${f.desc}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- RAG Workflow Pipeline -->
      <section style="padding: 80px 40px; background: var(--bg0); border-top: 1px solid var(--border);">
        <div style="text-align: center; margin-bottom: 50px">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent3); margin-bottom: 12px">How It Works</div>
          <h2 style="font-size: 32px; font-weight: 800; letter-spacing: -.02em; background: linear-gradient(135deg, #fff, var(--text2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">The Context Study Workflow</h2>
          <p style="color: var(--text3); font-size: 13.5px; margin-top: 8px; max-width: 500px; margin-left: auto; margin-right: auto;">Our pipeline parses text directly from documents to feed your learning dashboard.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto;">
          ${steps.map((s, idx) => `
            <div class="glass-card" style="border-radius: 16px; position: relative; padding: 30px; background: linear-gradient(180deg, var(--card), rgba(8,12,20,0.5));">
              <div style="position: absolute; top: 20px; right: 24px; font-size: 40px; font-weight: 900; color: rgba(99,102,241,0.06); font-family: system-ui; user-select: none;">${s.num}</div>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: white; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; margin-bottom: 20px; box-shadow: 0 0 12px rgba(99,102,241,0.4);">${idx + 1}</div>
              <h3 style="font-size: 15px; font-weight: 700; margin-bottom: 10px; color: var(--text1);">${s.title}</h3>
              <p style="font-size: 12.5px; color: var(--text2); line-height: 1.6;">${s.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Architecture Specifications -->
      <section style="padding: 80px 40px; background: var(--bg1); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);">
        <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: center;">
          <div>
            <div style="font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent3); margin-bottom: 12px">Technical Specifications</div>
            <h2 style="font-size: 32px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; background: linear-gradient(135deg, #fff, var(--text2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent">AI-Powered Engineering</h2>
            <p style="color: var(--text2); font-size: 13.5px; line-height: 1.6; margin-bottom: 20px;">
              ExamPrep AI leverages advanced retrieval architectures. Rather than standard simulation, PDF inputs are chunked, analyzed, and integrated as real knowledge contexts for large language models.
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text1);"><span style="color:var(--green)">✓</span> Node.js + Express API Router</div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text1);"><span style="color:var(--green)">✓</span> Google Gemini 2.5 Flash LLM Pipeline</div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text1);"><span style="color:var(--green)">✓</span> Structured JSON Generation (schemas)</div>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text1);"><span style="color:var(--green)">✓</span> Static Pub/Sub State Management</div>
            </div>
          </div>
          <div class="glass-card" style="border-radius: 20px; padding: 24px; background: linear-gradient(135deg, rgba(8,12,20,0.8), rgba(20,28,46,0.9)); position: relative; overflow: hidden;">
            <div style="font-size: 14px; font-weight: 700; color: var(--text1); margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px">🛠️</span> System Stack Blueprint
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; font-family: monospace; font-size: 12px;">
              <div style="border-left: 2px solid var(--accent); padding-left: 12px;">
                <span style="color: var(--accent3);">[Frontend Engine]</span>
                <div style="color: var(--text2); margin-top: 4px;">Vanilla ES modules, Dynamic InnerHTML render cycles, global Pub/Sub listeners state store.</div>
              </div>
              <div style="border-left: 2px solid var(--cyan); padding-left: 12px;">
                <span style="color: var(--cyan);">[Middleware PDF Parser]</span>
                <div style="color: var(--text2); margin-top: 4px;">Multer writes multipart form buffers; pdf-parse extracts text and page metadata on the backend.</div>
              </div>
              <div style="border-left: 2px solid var(--green); padding-left: 12px;">
                <span style="color: var(--green);">[LLM Generation Config]</span>
                <div style="color: var(--text2); margin-top: 4px;">Gemini 2.5 Flash processes up to 1M context tokens; outputs JSON arrays via responseMimeType declarations.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding: 40px 24px; text-align: center; color: var(--text3); font-size: 12.5px; background: var(--bg0)">
        © 2026 ExamPrep AI • Engineered with Google Gemini & Express • Built with ❤️ for students everywhere
      </footer>
    </div>
  `;
}
