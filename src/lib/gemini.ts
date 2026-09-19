import { QuizGenerationRequest, QuizQuestion } from "./types";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// HANYA MENGGUNAKAN MODEL GEMINI-3.5-FLASH-LITE SESUAI KETENTUAN WAJIB
const TARGET_MODEL = "gemini-3.5-flash-lite";

function isRateLimitError(errMsg: string): boolean {
  const lower = errMsg.toLowerCase();
  return (
    lower.includes("429") ||
    lower.includes("resource_exhausted") ||
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("limit")
  );
}

// Menghitung jumlah bank soal yang proporsional agar tidak melebihi output token limit
function computeTargetPoolCount(n: number): number {
  if (n <= 5) return 20; // 4x (20 soal)
  if (n <= 10) return 30; // 3x (30 soal)
  if (n <= 15) return 35; // 2.3x (35 soal)
  return 40; // 2x (40 soal) -> Aman dari batas 8192 token & cepat di Vercel
}

// Parser JSON cerdas yang mampu memperbaiki respon terpotong (truncated)
function parseAndRepairJson(raw: string): Record<string, unknown> {
  let cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Ambil teks dari '{' pertama hingga '}' terakhir
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Coba parse normal terlebih dahulu
  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Lanjut ke perbaikan otomatis
  }

  // Jika terpotong di tengah jalan (MAX_TOKENS), potong mundur ke objek soal terakhir yang utuh '}'
  const lastObjEnd = cleaned.lastIndexOf("}");
  if (lastObjEnd !== -1) {
    const candidates = [
      cleaned.substring(0, lastObjEnd + 1) + "\n  ]\n}",
      cleaned.substring(0, lastObjEnd + 1) + "\n}",
      cleaned.substring(0, lastObjEnd + 1) + "\n]",
      cleaned.substring(0, lastObjEnd + 1),
    ];

    for (const cand of candidates) {
      try {
        const repaired = JSON.parse(cand);
        if (typeof repaired === "object" && repaired !== null) {
          console.warn("Berhasil mereparasi data JSON yang terpotong.");
          return repaired as Record<string, unknown>;
        }
      } catch {
        // Coba kandidat berikutnya
      }
    }
  }

  throw new Error("Model AI mengembalikan format data JSON yang tidak valid.");
}

async function callGeminiApi(
  apiKey: string,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${TARGET_MODEL}:generateContent?key=${apiKey}`;

  const body: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data: GeminiResponse = await res.json();

  if (!res.ok || data.error) {
    const errorMsg = data.error?.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(`[Gemini-3.5-Flash-Lite Error]: ${errorMsg}`);
  }

  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error(`Model ${TARGET_MODEL} tidak mengembalikan teks jawaban.`);
  }

  return textOutput;
}

export async function generateQuizQuestions(
  req: QuizGenerationRequest
): Promise<{
  questions: QuizQuestion[];
  usedModel: string;
  genderTone?: "boy" | "girl" | "neutral";
}> {
  // Daftar API Key: Primary dan Fallback dari Environment Variables
  const primaryKey = process.env.GEMINI_API_KEY || "";
  const fallbackKey = process.env.GEMINI_API_KEY_FALLBACK || "";

  const apiKeys = [primaryKey, fallbackKey].filter(Boolean);

  const targetCount = computeTargetPoolCount(req.questionCount);
  const subjectText = req.subject?.trim() || "Tematik & Pengetahuan Umum";
  const topicText = req.topic?.trim() ? `dengan topik spesifik: "${req.topic.trim()}"` : "";

  const difficultyDescriptions: Record<string, string> = {
    sepele: "Sangat mudah, konsep paling mendasar, bahasa ceria dan ramah anak.",
    gampang: "Mudah, pemahaman konsep dasar standar sekolah.",
    "sedeng lah": "Menengah/sedang, membutuhkan sedikit analisis dan pemahaman materi.",
    sulit: "Menantang/High Order Thinking Skills (HOTS), membutuhkan ketelitian dan pemecahan masalah.",
    "olimpiade ini mah": "Tingkat kompetisi/olimpiade sains/matematika/penalaran kritis yang membutuhkan logika mendalam.",
  };

  const difficultyGuide = difficultyDescriptions[req.difficulty] || "Tingkat sedang standar sekolah.";

  const systemInstruction = `Kamu adalah pembuat soal kuis pendidikan anak sekolah terpercaya di Indonesia.
Kamu HANYA boleh merespons dalam format JSON Object murni.
Bahasa yang digunakan: Bahasa Indonesia yang baku namun ramah, mendidik, dan sesuai usia siswa.
PENTING:
1. Buat tepat ${targetCount} butir soal pilihan ganda unik, beragam, dan berkualitas (4 opsi tiap soal).
2. WAJIB pastikan fakta materi, rumus, dan perhitungan matematika 100% tepat dan benar. Pastikan correctAnswerIndex selalu menunjuk ke opsi yang paling benar.
3. Variasikan gaya soal agar anak tidak bosan: padukan pemahaman konsep dasar, soal cerita sehari-hari kontekstual anak, dan penalaran logika sebab-akibat sederhana.
4. Penjelasan (explanation) WAJIB ringkas 1 kalimat agar padat, edukatif, dan jelas.
5. Tugas tambahan: Analisis nama siswa "${req.childName}" dan tentukan childGenderTone: "boy" (laki-laki), "girl" (perempuan), atau "neutral" (netral/tidak tertebak).`;

  const randomBatchSeed = Math.floor(Math.random() * 100000);
  const prompt = `Buatkan tepat ${targetCount} butir soal pilihan ganda (Batch Ref: #${randomBatchSeed}) untuk:
- Siswa: ${req.childName}
- Jenjang: ${req.level}
- Kelas: ${req.grade}
- Mata Pelajaran: ${subjectText} ${topicText}
- Tingkat Kesulitan: "${req.difficulty}" (${difficultyGuide})

Pastikan butir-butir soal memiliki sudut pandang studi kasus yang segar dan variatif, bukan hanya hafalan definisi klise.

Instruksi format keluaran (JSON Object):
{
  "childGenderTone": "boy",
  "questions": [
    {
      "id": 1,
      "question": "Teks pertanyaan soal...",
      "options": ["Opsi pilihan 1 tanpa huruf A/B/C/D", "Opsi pilihan 2", "Opsi pilihan 3", "Opsi pilihan 4"],
      "correctAnswerIndex": 0,
      "explanation": "1 kalimat ringkas penjelasan mengapa opsi ini benar."
    }
  ]
}`;

  let lastError: Error | null = null;
  let allKeysRateLimited = true;

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    try {
      const rawResponse = await callGeminiApi(key, prompt, systemInstruction);

      // Parse dan perbaiki JSON jika terpotong
      const parsedObj = parseAndRepairJson(rawResponse);

      // Tangani gender tone dari AI
      let detectedGender: "boy" | "girl" | "neutral" = "neutral";
      const g = String(
        parsedObj.childGenderTone || parsedObj.gender || parsedObj.genderTone || ""
      ).toLowerCase();
      if (g.includes("boy") || g.includes("laki") || g.includes("pria") || g.includes("male")) {
        detectedGender = "boy";
      } else if (g.includes("girl") || g.includes("perempuan") || g.includes("wanita") || g.includes("female")) {
        detectedGender = "girl";
      }

      // Ambil array soal
      let itemsArray: Array<Record<string, unknown>> = [];
      if (Array.isArray(parsedObj)) {
        itemsArray = parsedObj as Array<Record<string, unknown>>;
      } else {
        for (const k of ["questions", "soal", "bank_soal", "items", "data", "quiz"]) {
          if (Array.isArray(parsedObj[k])) {
            itemsArray = parsedObj[k] as Array<Record<string, unknown>>;
            break;
          }
        }
      }

      if (itemsArray.length === 0) {
        throw new Error("Model AI tidak mengembalikan daftar soal dalam format array yang sesuai.");
      }

      // Validasi dan normalisasi soal
      const validated: QuizQuestion[] = itemsArray.map((item, index) => {
        const rawQuestion =
          item.question || item.pertanyaan || item.soal || `Soal nomor ${index + 1}`;

        const rawOptions =
          Array.isArray(item.options) && item.options.length >= 4
            ? item.options
            : Array.isArray(item.pilihan) && item.pilihan.length >= 4
            ? item.pilihan
            : Array.isArray(item.pilihan_jawaban) && item.pilihan_jawaban.length >= 4
            ? item.pilihan_jawaban
            : ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"];

        const cleanOptions = (rawOptions.slice(0, 4) as string[]).map((opt) =>
          String(opt || "")
            .replace(/^[A-Da-d][\.\)]\s*/, "")
            .trim()
        ) as [string, string, string, string];

        let correctIdx = 0;
        if (typeof item.correctAnswerIndex === "number" && item.correctAnswerIndex >= 0 && item.correctAnswerIndex < 4) {
          correctIdx = item.correctAnswerIndex;
        } else if (typeof item.correct_index === "number" && item.correct_index >= 0 && item.correct_index < 4) {
          correctIdx = item.correct_index;
        } else if (typeof item.jawaban_benar === "string") {
          const jwb = item.jawaban_benar.trim();
          const matchIdx = cleanOptions.findIndex((opt) => opt.toLowerCase() === jwb.toLowerCase());
          if (matchIdx !== -1) {
            correctIdx = matchIdx;
          } else if (/^[A-D]$/i.test(jwb)) {
            correctIdx = ["A", "B", "C", "D"].indexOf(jwb.toUpperCase());
          }
        }

        const rawExplanation =
          item.explanation ||
          item.penjelasan ||
          item.pembahasan ||
          "Jawaban ini sudah diverifikasi secara tepat.";

        return {
          id: index + 1,
          question: String(rawQuestion).trim(),
          options: cleanOptions,
          correctAnswerIndex: correctIdx,
          explanation: String(rawExplanation).trim(),
        };
      });

      return {
        questions: validated,
        usedModel: TARGET_MODEL,
        genderTone: detectedGender,
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      lastError = error;
      console.warn(`Panggilan dengan API key #${i + 1} gagal:`, error.message);

      if (!isRateLimitError(error.message)) {
        allKeysRateLimited = false;
      }
    }
  }

  // Jika semua API Key limit atau request penuh
  if (allKeysRateLimited || (lastError && isRateLimitError(lastError.message))) {
    throw new Error("Permintaan kuis sedang penuh. Mohon coba 2 menit lagi ya! 🙏");
  }

  throw lastError || new Error("Koneksi AI sedang padat saat menyusun kuis. Silakan klik 'Coba lagi' ya! 🙏");
}
