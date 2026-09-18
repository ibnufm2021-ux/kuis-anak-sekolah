import { GeneratedQuizData, EducationLevel } from "./types";

type GenderTone = "boy" | "girl" | "neutral";

interface QuizThemeConfig {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  bgGradient: string;
  cardRadius: string;
  fontFamily: string;
  avatarIcon: string;
  startBtnText: string;
  vibeTag: string;
  vibeText: string;
}

function detectGenderTone(name: string): GenderTone {
  const n = name.trim().toLowerCase();

  const boyKeywords = [
    "burhan", "budi", "muhammad", "mohammad", "ahmad", "farhan", "rayyan", "zayan",
    "kevin", "rizky", "rizki", "dimas", "bagus", "arya", "yusuf", "dani",
    "bayu", "pratama", "putra", "ilham", "fajar", "aditya", "adam", "reza",
    "aldy", "aldi", "fathir", "hafidz", "kenzie", "kenzo", "alif", "arkhan",
    "danu", "gilang", "fauzan", "iqbal", "ridho", "wahyu", "arief", "arif",
    "dika", "andika", "bima", "satria", "raka", "faiz", "ibran", "ibnu", "zaki"
  ];

  const girlKeywords = [
    "nisa", "annisa", "aisyah", "putri", "zahra", "bella", "nayla", "siti",
    "fatimah", "anisa", "rania", "salma", "tiara", "dewi", "ayu", "amanda",
    "kirana", "maya", "nur", "safira", "nadia", "citra", "lestari", "rahma",
    "syifa", "kayla", "tasya", "dinda", "mutiara", "amelia", "intan", "fadilla",
    "salsabila", "hanum", "nabila", "cantika", "chandra", "khadijah", "alyssa", "hana"
  ];

  for (const w of boyKeywords) {
    if (n.includes(w)) return "boy";
  }
  for (const w of girlKeywords) {
    if (n.includes(w)) return "girl";
  }

  // Suffix heuristic nama Indonesia umum (standar, tidak berlebihan)
  if (/(wati|putri|ani|iyah|iyyah|ina)$/.test(n)) return "girl";
  if (/(wan|putra|syah|din|to|no)$/.test(n)) return "boy";

  return "neutral";
}

function resolveQuizTheme(
  level: EducationLevel,
  childName: string,
  explicitGender?: GenderTone
): QuizThemeConfig {
  const gender = explicitGender && explicitGender !== "neutral"
    ? explicitGender
    : detectGenderTone(childName);

  // Palet Warna: Standar, elegan, tidak norak / ekstrim
  let primary = "#6366f1"; // Indigo neutral
  let primaryHover = "#4f46e5";
  let primaryLight = "#e0e7ff";
  let bgGradient = "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fef3c7 100%)";

  if (gender === "boy") {
    primary = "#0284c7"; // Ocean Sky Blue (segar, maskulin ramah)
    primaryHover = "#0369a1";
    primaryLight = "#e0f2fe";
    bgGradient = "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #fef3c7 100%)";
  } else if (gender === "girl") {
    primary = "#e11d48"; // Rose Coral (lembut, anggun)
    primaryHover = "#be123c";
    primaryLight = "#ffe4e6";
    bgGradient = "linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #fef3c7 100%)";
  }

  // Nuansa & Tipografi Berdasarkan Jenjang Sekolah
  switch (level) {
    case "TK":
      return {
        primary,
        primaryHover,
        primaryLight,
        bgGradient,
        cardRadius: "24px",
        fontFamily: "'Quicksand', 'Nunito', 'Comic Sans MS', system-ui, sans-serif",
        avatarIcon: gender === "boy" ? "🦖" : gender === "girl" ? "🦄" : "🎨",
        startBtnText: "🎮 Mulai Main Kuis Seru!",
        vibeTag: "Taman Kanak-Kanak • Playful Mode",
        vibeText: "✨ Main tebak-tebakan seru bareng kuis pintar! Soal selalu baru tiap kali diulang.",
      };
    case "SD":
      return {
        primary,
        primaryHover,
        primaryLight,
        bgGradient,
        cardRadius: "18px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        avatarIcon: gender === "boy" ? "⚽" : gender === "girl" ? "⭐" : "🎒",
        startBtnText: "🚀 Mulai Latihan Kuis!",
        vibeTag: "Sekolah Dasar • Ceria & Petualang",
        vibeText: "✨ Soal diacak otomatis dari bank soal, bisa diulang berkali-kali tanpa bosan!",
      };
    case "SMP":
      return {
        primary,
        primaryHover,
        primaryLight,
        bgGradient,
        cardRadius: "14px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        avatarIcon: "📐",
        startBtnText: "🎯 Mulai Uji Kemampuan",
        vibeTag: "Sekolah Menengah Pertama • Modern Academy",
        vibeText: "💡 Latihan mandiri terstruktur dengan penilaian instan dan pembahasan lengkap.",
      };
    case "SMA":
    default:
      return {
        primary,
        primaryHover,
        primaryLight,
        bgGradient,
        cardRadius: "10px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        avatarIcon: "🎓",
        startBtnText: "⏱️ Mulai Sesi Ujian Mandiri",
        vibeTag: "Sekolah Menengah Atas • Fokus & Presisi",
        vibeText: "📘 Mode simulasi mandiri untuk memperdalam pemahaman materi dan ketajaman penalaran.",
      };
  }
}

export function generateStandaloneQuizHtml(data: GeneratedQuizData): string {
  const jsonPayload = JSON.stringify(data).replace(/</g, "\\u003c");
  const theme = resolveQuizTheme(data.level, data.childName, data.genderTone);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kuis ${escapeHtml(data.subject)} - ${escapeHtml(data.childName)}</title>
  <style>
    :root {
      --primary: ${theme.primary};
      --primary-hover: ${theme.primaryHover};
      --primary-light: ${theme.primaryLight};
      --success: #10b981;
      --success-light: #d1fae5;
      --danger: #ef4444;
      --danger-light: #fee2e2;
      --warning: #f59e0b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: ${theme.cardRadius};
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: ${theme.fontFamily};
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: ${theme.bgGradient};
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
    }

    .container {
      width: 100%;
      max-width: 680px;
      margin: auto;
    }

    .card {
      background: var(--card-bg);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 24px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      position: relative;
      overflow: hidden;
    }

    /* Header & Badge */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.82rem;
      font-weight: 600;
    }
    .badge-primary { background: var(--primary-light); color: var(--primary); }
    .badge-warning { background: #fef3c7; color: #b45309; }
    .badge-success { background: var(--success-light); color: #047857; }

    h1, h2, h3 {
      color: #0f172a;
      font-weight: 800;
      line-height: 1.25;
    }

    /* Start Screen */
    .start-screen {
      text-align: center;
      padding: 32px 16px;
    }
    .avatar-icon {
      font-size: 4.2rem;
      margin-bottom: 12px;
      display: inline-block;
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 24px 0;
      text-align: left;
    }
    .meta-item {
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .meta-item span {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-item strong {
      font-size: 0.95rem;
      color: var(--text);
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .btn-block {
      width: 100%;
    }

    /* Quiz Header */
    .quiz-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .progress-bar-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--primary);
      transition: width 0.3s ease;
    }

    /* Question Screen */
    .question-box {
      margin-bottom: 24px;
    }
    .question-number {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .question-text {
      font-size: 1.15rem;
      line-height: 1.5;
      font-weight: 700;
      color: #0f172a;
    }

    /* Options */
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .option-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: #ffffff;
      border: 2px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
    }
    .option-card:hover {
      border-color: #cbd5e1;
      background: #f8fafc;
    }
    .option-card.selected {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .option-key {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      background: #f1f5f9;
      color: #475569;
      flex-shrink: 0;
      transition: all 0.15s ease;
    }
    .option-card.selected .option-key {
      background: var(--primary);
      color: white;
    }
    .option-label {
      font-size: 1rem;
      line-height: 1.4;
      font-weight: 500;
      color: var(--text);
    }

    /* Bottom Navigation */
    .nav-controls {
      display: flex;
      gap: 12px;
      justify-content: space-between;
    }

    /* Question Navigator Dots */
    .question-dots {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      justify-content: center;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px dashed var(--border);
    }
    .dot {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid transparent;
    }
    .dot.active {
      border-color: var(--primary);
      background: var(--primary-light);
      color: var(--primary);
    }
    .dot.answered {
      background: #10b981;
      color: white;
    }
    .dot.active.answered {
      outline: 2px solid var(--primary);
    }

    /* Result Screen */
    .result-screen {
      text-align: center;
      padding: 16px 8px;
    }
    .score-circle {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      margin: 16px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: conic-gradient(var(--primary) calc(var(--score-deg, 0) * 1deg), #e2e8f0 0deg);
      position: relative;
    }
    .score-circle-inner {
      width: 116px;
      height: 116px;
      border-radius: 50%;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .score-number {
      font-size: 2.2rem;
      font-weight: 900;
      color: #0f172a;
      line-height: 1;
    }
    .score-total {
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    .result-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 20px 0;
    }
    .stat-box {
      background: #f8fafc;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .stat-box.correct { border-color: #a7f3d0; background: #ecfdf5; }
    .stat-box.wrong { border-color: #fecaca; background: #fef2f2; }

    /* Review List */
    .review-list {
      margin-top: 24px;
      text-align: left;
    }
    .review-item {
      background: #f8fafc;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid var(--border);
    }
    .review-item.is-correct {
      border-left: 4px solid var(--success);
    }
    .review-item.is-wrong {
      border-left: 4px solid var(--danger);
    }
    .explanation-box {
      margin-top: 10px;
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 8px;
      font-size: 0.88rem;
      color: #475569;
      border: 1px dashed var(--border);
    }

    @media print {
      body { background: white; padding: 0; }
      .card { box-shadow: none; border: none; padding: 0; }
      .no-print { display: none !important; }
      .review-list { display: block !important; }
    }

    @media (max-width: 480px) {
      .card { padding: 16px; }
      .meta-grid { grid-template-columns: 1fr; }
      .question-text { font-size: 1.05rem; }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="card" id="appCard">
      <!-- Layar Selamat Datang -->
      <div id="startScreen" class="start-screen">
        <div class="avatar-icon">${theme.avatarIcon}</div>
        <div style="margin-bottom: 8px;">
          <span class="badge badge-primary">${escapeHtml(data.level)} • ${escapeHtml(data.grade)}</span>
          <span class="badge badge-warning" style="margin-left: 6px;">Tingkat: ${escapeHtml(data.difficulty)}</span>
        </div>
        <h1 style="margin-top: 10px; font-size: 1.6rem;">Halo, ${escapeHtml(data.childName)}!</h1>
        <p style="color: var(--text-muted); margin-top: 6px; font-size: 0.95rem;">
          Siap untuk latihan kuis <strong>${escapeHtml(data.subject)}</strong> hari ini?
        </p>

        <div class="meta-grid">
          <div class="meta-item">
            <span>Mata Pelajaran</span>
            <strong>${escapeHtml(data.subject)}</strong>
          </div>
          <div class="meta-item">
            <span>Jumlah Soal Sesi Ini</span>
            <strong>${data.activeCount} Soal</strong>
          </div>
          <div class="meta-item">
            <span>Topik Bahasan</span>
            <strong>${escapeHtml(data.topic || "Umum & Tematik")}</strong>
          </div>
          <div class="meta-item">
            <span>Bank Soal Mandiri</span>
            <strong>${data.poolCount} Soal Siap Acak</strong>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 20px;">
          ${theme.vibeText}
        </p>

        <button class="btn btn-primary btn-block" onclick="startQuizSession()">
          ${theme.startBtnText}
        </button>

        <div style="margin-top: 20px; font-size: 0.78rem; color: #64748b; text-align: center; background: #f8fafc; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ☕ Suka dengan aplikasi ini? Dukung kami dengan klik link ini: 
          <a href="https://saweria.co/ibnufm21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline; font-weight: 700;">👉 https://saweria.co/ibnufm21</a>
          <span style="margin: 0 6px; color: #cbd5e1;">•</span>
          <a href="https://instagram.com/ibnufm" target="_blank" rel="noopener noreferrer" style="color: #475569; text-decoration: underline; font-weight: 600;">📸 Instagram: @ibnufm</a>
        </div>
      </div>

      <!-- Layar Soal Kuis -->
      <div id="quizScreen" style="display: none;">
        <div class="quiz-nav-header">
          <div>
            <span class="badge badge-primary">${escapeHtml(data.childName)}</span>
            <span class="badge badge-warning" style="margin-left: 4px;">${escapeHtml(data.subject)}</span>
          </div>
          <div id="timerDisplay" style="font-weight: 700; color: #475569; font-size: 0.95rem;">
            ⏱️ 00:00
          </div>
        </div>

        <div class="progress-bar-bg">
          <div id="progressBarFill" class="progress-bar-fill" style="width: 0%;"></div>
        </div>

        <div class="question-box">
          <div id="questionNumber" class="question-number">SOAL 1 DARI ${data.activeCount}</div>
          <div id="questionText" class="question-text">Memuat pertanyaan...</div>
        </div>

        <div id="optionsContainer" class="options-list">
          <!-- Opsi pilihan ganda di-render secara dinamis -->
        </div>

        <div class="nav-controls">
          <button id="prevBtn" class="btn btn-secondary" onclick="navigateQuestion(-1)">
            ⬅️ Sebelumnya
          </button>
          <button id="nextBtn" class="btn btn-primary" onclick="navigateQuestion(1)">
            Selanjutnya ➡️
          </button>
        </div>

        <div id="questionDots" class="question-dots">
          <!-- Nomor navigasi cepat -->
        </div>
      </div>

      <!-- Layar Hasil / Skor -->
      <div id="resultScreen" class="result-screen" style="display: none;">
        <div style="font-size: 3.5rem; margin-bottom: 6px;" id="resultEmoji">🎉</div>
        <h2 id="resultTitle">Keren Banget, ${escapeHtml(data.childName)}!</h2>
        <p id="resultSubtitle" style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">
          Kamu telah menyelesaikan ${data.activeCount} soal kuis ${escapeHtml(data.subject)}.
        </p>

        <div class="score-circle" id="scoreCircle">
          <div class="score-circle-inner">
            <span class="score-number" id="finalScoreText">0</span>
            <span class="score-total">dari 100</span>
          </div>
        </div>

        <div class="result-stats">
          <div class="stat-box correct">
            <div style="font-size: 0.75rem; color: #065f46; font-weight: 700;">BENAR</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #047857;" id="correctCountText">0</div>
          </div>
          <div class="stat-box wrong">
            <div style="font-size: 0.75rem; color: #991b1b; font-weight: 700;">SALAH</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: #b91c1c;" id="wrongCountText">0</div>
          </div>
          <div class="stat-box">
            <div style="font-size: 0.75rem; color: #475569; font-weight: 700;">WAKTU</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #334155;" id="finalTimeText">00:00</div>
          </div>
        </div>

        <div class="no-print" style="display: flex; flex-direction: column; gap: 10px; margin: 24px 0;">
          <button class="btn btn-primary btn-block" onclick="restartQuizWithNewRandom()">
            🔄 Ulangi Kuis (Acak Soal Baru dari Bank)
          </button>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" style="flex: 1;" onclick="toggleReviewSection()">
              📝 Lihat Pembahasan
            </button>
            <button class="btn btn-secondary" style="flex: 1;" onclick="window.print()">
              🖨️ Cetak Hasil
            </button>
          </div>
        </div>

        <!-- Section Review Jawaban & Pembahasan -->
        <div id="reviewContainer" class="review-list" style="display: none;">
          <h3 style="margin-bottom: 16px; font-size: 1.15rem;">Pembahasan Lengkap</h3>
          <div id="reviewItems"></div>
        </div>

        <div class="no-print" style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed var(--border); font-size: 0.78rem; color: #64748b; text-align: center; background: #f8fafc; padding: 10px 14px; border-radius: 8px;">
          ☕ Suka dengan aplikasi ini? Dukung kami dengan klik link ini: 
          <a href="https://saweria.co/ibnufm21" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: underline; font-weight: 700;">👉 https://saweria.co/ibnufm21</a>
          <span style="margin: 0 6px; color: #cbd5e1;">•</span>
          <a href="https://instagram.com/ibnufm" target="_blank" rel="noopener noreferrer" style="color: #475569; text-decoration: underline; font-weight: 600;">📸 Instagram: @ibnufm</a>
        </div>
      </div>
    </div>
  </div>

  <script>
    // DATA BANK SOAL DARI GENERATOR
    const quizData = ${jsonPayload};

    let activeQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {}; // { questionId: selectedIndex }
    let timerSeconds = 0;
    let timerInterval = null;

    // Algoritma Fisher-Yates untuk mengacak array
    function shuffleArray(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    // Mempersiapkan sesi kuis baru (mengambil n dari pool 4n dan mengacak opsi)
    function prepareSessionQuestions() {
      const fullPool = quizData.questions || [];
      const shuffledPool = shuffleArray(fullPool);
      const selected = shuffledPool.slice(0, Math.min(quizData.activeCount, fullPool.length));

      // Acak urutan pilihan jawaban untuk setiap soal agar tidak dapat dihafal
      return selected.map((q, idx) => {
        const originalCorrectText = q.options[q.correctAnswerIndex];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

        return {
          ...q,
          sessionIndex: idx,
          displayOptions: shuffledOptions,
          displayCorrectIndex: newCorrectIndex,
        };
      });
    }

    function startQuizSession() {
      activeQuestions = prepareSessionQuestions();
      currentQuestionIndex = 0;
      userAnswers = {};
      timerSeconds = 0;

      document.getElementById('startScreen').style.display = 'none';
      document.getElementById('resultScreen').style.display = 'none';
      document.getElementById('quizScreen').style.display = 'block';

      // Start timer
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        timerSeconds++;
        const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
        const secs = String(timerSeconds % 60).padStart(2, '0');
        document.getElementById('timerDisplay').innerText = '⏱️ ' + mins + ':' + secs;
      }, 1000);

      renderDots();
      renderCurrentQuestion();
    }

    function renderDots() {
      const container = document.getElementById('questionDots');
      container.innerHTML = '';
      activeQuestions.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.id = 'dot-' + idx;
        dot.innerText = idx + 1;
        dot.onclick = () => jumpToQuestion(idx);
        container.appendChild(dot);
      });
      updateDotsStatus();
    }

    function updateDotsStatus() {
      activeQuestions.forEach((_, idx) => {
        const dot = document.getElementById('dot-' + idx);
        if (!dot) return;
        dot.classList.remove('active', 'answered');
        if (userAnswers[idx] !== undefined) {
          dot.classList.add('answered');
        }
        if (idx === currentQuestionIndex) {
          dot.classList.add('active');
        }
      });
    }

    function renderCurrentQuestion() {
      const q = activeQuestions[currentQuestionIndex];
      const total = activeQuestions.length;

      document.getElementById('questionNumber').innerText = 'SOAL ' + (currentQuestionIndex + 1) + ' DARI ' + total;
      document.getElementById('questionText').innerText = q.question;

      // Update progress bar
      const progressPercent = ((currentQuestionIndex + 1) / total) * 100;
      document.getElementById('progressBarFill').style.width = progressPercent + '%';

      // Render options
      const optionsContainer = document.getElementById('optionsContainer');
      optionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.displayOptions.forEach((optText, optIdx) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        if (userAnswers[currentQuestionIndex] === optIdx) {
          card.classList.add('selected');
        }

        card.innerHTML = \`
          <div class="option-key">\${letters[optIdx]}</div>
          <div class="option-label">\${escapeHtml(optText)}</div>
        \`;

        card.onclick = () => selectOption(optIdx);
        optionsContainer.appendChild(card);
      });

      // Update Buttons
      document.getElementById('prevBtn').style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
      
      const nextBtn = document.getElementById('nextBtn');
      if (currentQuestionIndex === total - 1) {
        nextBtn.innerHTML = '🏁 Kumpulkan Jawaban';
        nextBtn.classList.remove('btn-primary');
        nextBtn.style.background = '#10b981';
      } else {
        nextBtn.innerHTML = 'Selanjutnya ➡️';
        nextBtn.classList.add('btn-primary');
        nextBtn.style.background = '';
      }

      updateDotsStatus();
    }

    function selectOption(optIdx) {
      userAnswers[currentQuestionIndex] = optIdx;
      renderCurrentQuestion();
    }

    function navigateQuestion(direction) {
      const newIndex = currentQuestionIndex + direction;
      if (direction === 1 && currentQuestionIndex === activeQuestions.length - 1) {
        submitQuiz();
        return;
      }
      if (newIndex >= 0 && newIndex < activeQuestions.length) {
        currentQuestionIndex = newIndex;
        renderCurrentQuestion();
      }
    }

    function jumpToQuestion(idx) {
      if (idx >= 0 && idx < activeQuestions.length) {
        currentQuestionIndex = idx;
        renderCurrentQuestion();
      }
    }

    function submitQuiz() {
      // Periksa apakah ada yang belum dijawab
      const unanswered = activeQuestions.filter((_, idx) => userAnswers[idx] === undefined).length;
      if (unanswered > 0) {
        const confirmFinish = confirm('Masih ada ' + unanswered + ' soal yang belum kamu jawab. Tetap ingin mengumpulkan?');
        if (!confirmFinish) return;
      }

      clearInterval(timerInterval);

      // Hitung skor
      let correct = 0;
      activeQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === q.displayCorrectIndex) {
          correct++;
        }
      });

      const total = activeQuestions.length;
      const score = Math.round((correct / total) * 100);

      document.getElementById('quizScreen').style.display = 'none';
      document.getElementById('resultScreen').style.display = 'block';

      // Set score and circle
      document.getElementById('finalScoreText').innerText = score;
      document.getElementById('correctCountText').innerText = correct;
      document.getElementById('wrongCountText').innerText = total - correct;
      
      const mins = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
      const secs = String(timerSeconds % 60).padStart(2, '0');
      document.getElementById('finalTimeText').innerText = mins + ':' + secs;

      const scoreCircle = document.getElementById('scoreCircle');
      scoreCircle.style.setProperty('--score-deg', (score / 100) * 360);

      // Badge & message
      const emojiElem = document.getElementById('resultEmoji');
      const titleElem = document.getElementById('resultTitle');
      const subtitleElem = document.getElementById('resultSubtitle');

      if (score === 100) {
        emojiElem.innerText = '🌟';
        titleElem.innerText = 'Luar Biasa Sempurna, ' + quizData.childName + '!';
        subtitleElem.innerText = 'Kamu menjawab SEMUA soal dengan benar! Hebat sekali!';
      } else if (score >= 80) {
        emojiElem.innerText = '🎉';
        titleElem.innerText = 'Hebat Banget, ' + quizData.childName + '!';
        subtitleElem.innerText = 'Nilaimu sangat memuaskan, pertahankan prestasimu!';
      } else if (score >= 60) {
        emojiElem.innerText = '👍';
        titleElem.innerText = 'Bagus Sekali, ' + quizData.childName + '!';
        subtitleElem.innerText = 'Hasil yang cukup baik! Terus berlatih agar makin pintar!';
      } else {
        emojiElem.innerText = '💪';
        titleElem.innerText = 'Tetap Semangat, ' + quizData.childName + '!';
        subtitleElem.innerText = 'Jangan menyerah ya! Kamu bisa ulangi kuis ini untuk belajar lagi.';
      }

      // Render review
      renderReviewSection();
    }

    function renderReviewSection() {
      const reviewContainer = document.getElementById('reviewItems');
      reviewContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      activeQuestions.forEach((q, idx) => {
        const userChoice = userAnswers[idx];
        const isCorrect = userChoice === q.displayCorrectIndex;

        const item = document.createElement('div');
        item.className = 'review-item ' + (isCorrect ? 'is-correct' : 'is-wrong');

        const userAnsText = userChoice !== undefined 
          ? letters[userChoice] + '. ' + escapeHtml(q.displayOptions[userChoice])
          : '<em>(Tidak dijawab)</em>';

        const correctAnsText = letters[q.displayCorrectIndex] + '. ' + escapeHtml(q.displayOptions[q.displayCorrectIndex]);

        item.innerHTML = \`
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <strong style="color: var(--text);">No. \${idx + 1}</strong>
            <span class="badge \${isCorrect ? 'badge-success' : 'badge-warning'}">
              \${isCorrect ? '✅ Benar' : '❌ Salah'}
            </span>
          </div>
          <div style="font-size: 0.98rem; font-weight: 600; margin-bottom: 8px;">\${escapeHtml(q.question)}</div>
          <div style="font-size: 0.88rem; margin-bottom: 4px;">
            <strong>Jawaban Kamu:</strong> <span style="color: \${isCorrect ? '#047857' : '#b91c1c'};">\${userAnsText}</span>
          </div>
          \${!isCorrect ? \`<div style="font-size: 0.88rem; margin-bottom: 4px;">
            <strong>Kunci Jawaban:</strong> <span style="color: #047857;">\${correctAnsText}</span>
          </div>\` : ''}
          <div class="explanation-box">
            💡 <strong>Pembahasan:</strong> \${escapeHtml(q.explanation)}
          </div>
        \`;

        reviewContainer.appendChild(item);
      });
    }

    function toggleReviewSection() {
      const reviewDiv = document.getElementById('reviewContainer');
      reviewDiv.style.display = reviewDiv.style.display === 'none' ? 'block' : 'none';
      if (reviewDiv.style.display === 'block') {
        reviewDiv.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function restartQuizWithNewRandom() {
      startQuizSession();
    }

    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text?: string): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
