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

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

async function callGeminiApi(
  model: string,
  apiKey: string,
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
    throw new Error(`[Model ${model} Error]: ${errorMsg}`);
  }

  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error(`Model ${model} tidak mengembalikan teks jawaban.`);
  }

  return textOutput;
}

export async function generateQuizQuestions(
  req: QuizGenerationRequest
): Promise<{ questions: QuizQuestion[]; usedModel: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum dikonfigurasi di environment (.env.local)");
  }

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
Bahasa yang digunakan: Bahasa Indonesia yang baku namun ramah, edukatif, dan sesuai usia anak.
Tugasmu adalah membuat bank soal pilihan ganda (4 opsi: A, B, C, D) yang bervariasi, akurat, dan tidak ada soal yang dobel.
Output WAJIB berupa JSON array murni tanpa markdown formatting pembungkus seperti \`\`\`json.`;

  const prompt = `Buatkan tepat ${targetCount} butir soal pilihan ganda untuk:
- Nama Siswa: ${req.childName}
- Jenjang: ${req.level}
- Kelas: ${req.grade}
- Mata Pelajaran: ${subjectText} ${topicText}
- Tingkat Kesulitan: "${req.difficulty}" (${difficultyGuide})

PENTING:
1. Hasilkan tepat ${targetCount} butir soal. Setiap soal harus unik dan berkualitas.
2. Setiap soal memiliki tepat 4 opsi pilihan jawaban.
3. correctAnswerIndex adalah indeks jawaban yang benar (0 untuk opsi pertama, 1 untuk kedua, 2 untuk ketiga, 3 untuk keempat).
4. explanation adalah penjelasan ringkas yang ramah dan memahamkan anak mengapa jawaban tersebut benar.
5. Format keluaran HANYA berupa JSON Array valid dengan struktur:
[
  {
    "id": 1,
    "question": "Pertanyaan soal...",
    "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    "correctAnswerIndex": 0,
    "explanation": "Penjelasan mengapa opsi ini benar..."
  }
]`;

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)];
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const rawResponse = await callGeminiApi(model, apiKey, prompt, systemInstruction);
      
      // Bersihkan kemungkinan markdown backticks jika ada
      const cleaned = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed: QuizQuestion[] = JSON.parse(cleaned);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Respon AI bukan array soal yang valid.");
      }

      // Validasi dan standarisasi soal
      const validated: QuizQuestion[] = parsed.map((item, index) => {
        const rawOptions = Array.isArray(item.options) && item.options.length >= 4
          ? item.options.slice(0, 4).map(String)
          : ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"];

        // Bersihkan awalan huruf seperti "A. ", "A) ", "a. " jika ada dari AI
        const cleanOptions = rawOptions.map((opt) =>
          opt.replace(/^[A-Da-d][\.\)]\s*/, "").trim()
        ) as [string, string, string, string];

        return {
          id: index + 1,
          question: String(item.question || `Soal nomor ${index + 1}`),
          options: cleanOptions,
          correctAnswerIndex:
            typeof item.correctAnswerIndex === "number" &&
            item.correctAnswerIndex >= 0 &&
            item.correctAnswerIndex < 4
              ? item.correctAnswerIndex
              : 0,
          explanation: String(item.explanation || "Jawaban sudah diverifikasi."),
        };
      });

      return {
        questions: validated,
        usedModel: model,
      };
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      lastError = error;
      console.warn(`Gagal dengan model ${model}:`, error.message);
      // Lanjut coba fallback model jika error terkait model not found
      if (!error.message.includes("not found") && !error.message.includes("404")) {
        // Jika bukan 404 (misal invalid key atau quota), tetap simpan lastError dan coba model berikutnya jika memungkinkan
      }
    }
  }

  throw lastError || new Error("Gagal menghasilkan soal dari AI.");
}
