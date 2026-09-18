"use client";

import React, { useState } from "react";
import QuizForm from "@/components/QuizForm";
import GeneratingState from "@/components/GeneratingState";
import QuizResultModal from "@/components/QuizResultModal";
import LivePreviewModal from "@/components/LivePreviewModal";
import { QuizGenerationRequest, GeneratedQuizData } from "@/lib/types";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Shuffle,
  Award,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingRequest, setPendingRequest] =
    useState<QuizGenerationRequest | null>(null);
  const [result, setResult] = useState<{
    quizData: GeneratedQuizData;
    htmlContent: string;
    filename: string;
    usedModel: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async (formData: QuizGenerationRequest) => {
    setStatus("loading");
    setErrorMsg("");
    setPendingRequest(formData);

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat kuis. Silakan coba lagi.");
      }

      setResult({
        quizData: data.quizData,
        htmlContent: data.htmlContent,
        filename: data.filename,
        usedModel: data.usedModel,
      });
      setStatus("success");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setErrorMsg(error.message);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setPendingRequest(null);
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        {/* Header Branding */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Generator Kuis Mandiri Anak Sekolah
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Kuis Belajar Asyik Buat Anak,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              100% Offline!
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Cukup masukkan nama anak, kelas, dan mapel. Dapatkan file{" "}
            <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
              .html
            </code>{" "}
            lengkap dengan bank soal acak <strong>4x lipat</strong>, penilaian
            otomatis, dan pembahasan.
          </p>

          {/* Fitur Utama */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" /> Buka di HP,
              Tablet, Laptop
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200">
              <Shuffle className="w-3.5 h-3.5 text-purple-600" /> Bank 4x Soal
              Acak
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur px-3 py-1.5 rounded-full border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bebas Iklan
              & Hemat Kuota
            </span>
          </div>
        </header>

        {/* Konten Berdasarkan Status */}
        <div className="transition-all duration-300">
          {status === "error" && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 text-sm">
                <strong className="block font-bold">Terjadi Kendala:</strong>
                <p>{errorMsg}</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 text-xs font-bold underline text-red-700 hover:text-red-900"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          )}

          {status === "loading" && pendingRequest && (
            <GeneratingState
              childName={pendingRequest.childName}
              totalQuestions={pendingRequest.questionCount}
            />
          )}

          {status === "success" && result && (
            <QuizResultModal
              quizData={result.quizData}
              htmlContent={result.htmlContent}
              filename={result.filename}
              usedModel={result.usedModel}
              onPreview={() => setShowPreview(true)}
              onReset={handleReset}
            />
          )}

          {status === "idle" && (
            <div className="max-w-2xl mx-auto">
              <QuizForm onSubmit={handleGenerate} isLoading={false} />
            </div>
          )}
        </div>
      </div>

      {/* Modal Live Preview */}
      {showPreview && result && (
        <LivePreviewModal
          htmlContent={result.htmlContent}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-slate-400 space-y-1">
        <p>
          Dibuat dengan ❤️ untuk kemudahan belajar anak sekolah di Indonesia.
        </p>
        <p>
          Mendukung jenjang TK, SD, SMP, hingga SMA • Siap di-deploy langsung ke
          Vercel.
        </p>
      </footer>
    </main>
  );
}
