import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/gemini";
import { generateStandaloneQuizHtml } from "@/lib/html-template";
import { EducationLevel, DifficultyLevel, GeneratedQuizData } from "@/lib/types";

export const maxDuration = 60; // Izinkan durasi serverless hingga 60 detik

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const childName = (body.childName || "").trim();
    const level = body.level as EducationLevel;
    const grade = (body.grade || "").trim();
    const subject = (body.subject || "").trim() || "Pengetahuan Umum & Tematik";
    const topic = (body.topic || "").trim();
    const difficulty = (body.difficulty || "sedeng lah") as DifficultyLevel;
    let questionCount = parseInt(body.questionCount, 10);

    if (!childName) {
      return NextResponse.json(
        { error: "Nama anak wajib diisi." },
        { status: 400 }
      );
    }

    if (!level || !["TK", "SD", "SMP", "SMA"].includes(level)) {
      return NextResponse.json(
        { error: "Jenjang pendidikan tidak valid." },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        { error: "Pilihan kelas wajib dipilih." },
        { status: 400 }
      );
    }

    if (isNaN(questionCount) || questionCount < 3) {
      questionCount = 5;
    } else if (questionCount > 20) {
      questionCount = 20; // Sesuai kesepakatan: maks 20 soal
    }

    // Panggil Gemini untuk generate 4 x n soal
    const { questions, usedModel } = await generateQuizQuestions({
      childName,
      level,
      grade,
      subject,
      topic,
      difficulty,
      questionCount,
    });

    const quizData: GeneratedQuizData = {
      childName,
      level,
      grade,
      subject,
      topic,
      difficulty,
      activeCount: questionCount,
      poolCount: questions.length,
      questions,
      generatedAt: new Date().toISOString(),
    };

    // Buat HTML mandiri offline
    const htmlContent = generateStandaloneQuizHtml(quizData);

    const safeChildName = childName.replace(/[^a-zA-Z0-9]/g, "_");
    const safeSubject = subject.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `Kuis_${safeSubject}_${safeChildName}.html`;

    return NextResponse.json({
      success: true,
      quizData,
      htmlContent,
      filename,
      usedModel,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error in /api/generate-quiz:", err);
    return NextResponse.json(
      {
        error: err.message || "Terjadi kesalahan internal saat membuat kuis.",
      },
      { status: 500 }
    );
  }
}
