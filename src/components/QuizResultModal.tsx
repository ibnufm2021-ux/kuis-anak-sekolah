"use client";

import React from "react";
import {
  Download,
  Eye,
  CheckCircle2,
  Share2,
  Smartphone,
  Laptop,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { GeneratedQuizData } from "@/lib/types";

interface QuizResultModalProps {
  quizData: GeneratedQuizData;
  htmlContent: string;
  filename: string;
  usedModel: string;
  onPreview: () => void;
  onReset: () => void;
}

export default function QuizResultModal({
  quizData,
  htmlContent,
  filename,
  usedModel,
  onPreview,
  onReset,
}: QuizResultModalProps) {
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-100 max-w-xl mx-auto space-y-6">
      {/* Header Sukses */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h3 className="text-2xl font-black text-slate-800">
          Kuis Berhasil Dibuat! 🎉
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Paket kuis mandiri untuk <strong>{quizData.childName}</strong> sudah
          siap diunduh dan bisa dimainkan secara offline di semua perangkat.
        </p>
      </div>

      {/* Ringkasan Metadata */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-3 text-left">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Siswa & Kelas
          </span>
          <p className="text-sm font-bold text-slate-800">
            {quizData.childName} ({quizData.grade})
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Mata Pelajaran
          </span>
          <p className="text-sm font-bold text-slate-800 truncate">
            {quizData.subject}
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Tingkat Kesulitan
          </span>
          <p className="text-sm font-bold text-indigo-600 capitalize">
            {quizData.difficulty}
          </p>
        </div>
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">
            Kapasitas Soal
          </span>
          <p className="text-sm font-bold text-slate-800">
            {quizData.activeCount} / {quizData.poolCount} Bank Soal
          </p>
        </div>
      </div>

      {/* Tombol Aksi Utama */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-4 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-lg"
        >
          <Download className="w-5 h-5" />
          Unduh File Kuis (.html)
        </button>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onPreview}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Eye className="w-4 h-4" />
            Preview Kuis Langsung
          </button>
          <button
            type="button"
            onClick={onReset}
            className="py-3 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Bikin Baru
          </button>
        </div>
      </div>

      {/* Petunjuk Membuka untuk Orang Tua */}
      <div className="border-t border-slate-200/80 pt-4 text-left space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-slate-400" />
          Cara Membuka File di Perangkat Anak:
        </h4>
        <ul className="text-xs text-slate-500 space-y-1 pl-4 list-disc">
          <li>
            <strong>Di HP / Tablet Android:</strong> Buka folder Download, ketuk
            file <code>.html</code>, lalu pilih browser seperti Chrome.
          </li>
          <li>
            <strong>Di iPhone / iPad:</strong> Kirim file via WhatsApp/AirDrop,
            atau buka dari aplikasi Files dengan Safari.
          </li>
          <li>
            <strong>Di Laptop / Komputer:</strong> Cukup klik ganda (double
            click) file <code>.html</code> tersebut.
          </li>
          <li className="text-emerald-700 font-medium">
            💡 <strong>100% Offline:</strong> Anak bisa mengerjakan kuis tanpa
            sambungan internet!
          </li>
        </ul>
      </div>

      <div className="text-center pt-2 text-xs text-slate-400">
        Didukung oleh model AI:{" "}
        <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          {usedModel}
        </span>
      </div>
    </div>
  );
}
