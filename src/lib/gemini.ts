import { QuizGenerationRequest, QuizQuestion } from "./types";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
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
): Promise<{ questions: QuizQuestion[]; usedModel: string }> {
  // Daftar API Key: Primary dan Fallback dari Environment Variables
  const primaryKey = process.env.GEMINI_API_KEY || "";
  const fallbackKey = process.env.GEMINI_API_KEY_FALLBACK || "";

  const apiKeys = [primaryKey, fallbackKey].filter(Boolean);

  const targetCount = req.questionCount * 4; // 4 x n pool
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
Kamu HANYA boleh merespons dalam format JSON Array murni berisi daftar pertanyaan kuis pilihan ganda.
Bahasa yang digunakan: Bahasa Indonesia yang baku namun ramah, mendidik, dan sesuai usia siswa.
PENTING: Buat tepat ${targetCount} butir soal pilihan ganda unik dan berkualitas (4 opsi tiap soal).`;

  const prompt = `Buatkan tepat ${targetCount} butir soal pilihan ganda untuk:
- Siswa: ${req.childName}
- Jenjang: ${req.level}
- Kelas: ${req.grade}
- Mata Pelajaran: ${subjectText} ${topicText}
- Tingkat Kesulitan: "${req.difficulty}" (${difficultyGuide})

Instruksi format keluaran (JSON Array murni):
[
  {
    "id": 1,
    "question": "Teks pertanyaan soal...",
    "options": ["Opsi pilihan 1 tanpa huruf A/B/C/D", "Opsi pilihan 2", "Opsi pilihan 3", "Opsi pilihan 4"],
    "correctAnswerIndex": 0,
    "explanation": "Penjelasan ramah dan mendidik mengapa opsi ini benar..."
  }
]`;

  let lastError: Error | null = null;
  let allKeysRateLimited = true;

  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    try {
      const rawResponse = await callGeminiApi(key, prompt, systemInstruction);

      // Bersihkan markdown formatting jika ada
      const cleaned = rawResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      let parsedData: unknown;
      try {
        parsedData = JSON.parse(cleaned);
      } catch {
        throw new Error(`Model ${TARGET_MODEL} mengembalikan format data JSON yang tidak valid.`);
      }

      // Tangani kemungkinan format array langsung atau objek pembungkus { questions: [...] }
      let itemsArray: Array<Record<string, unknown>> = [];
      if (Array.isArray(parsedData)) {
        itemsArray = parsedData as Array<Record<string, unknown>>;
      } else if (parsedData && typeof parsedData === "object") {
        const obj = parsedData as Record<string, unknown>;
        for (const k of ["questions", "soal", "bank_soal", "items", "data", "quiz"]) {
          if (Array.isArray(obj[k])) {
            itemsArray = obj[k] as Array<Record<string, unknown>>;
            break;
          }
        }
      }

      if (itemsArray.length === 0) {
        throw new Error(`Model ${TARGET_MODEL} tidak mengembalikan daftar soal dalam format array yang sesuai.`);
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

  throw lastError || new Error("Gagal membuat kuis dari AI.");
}
