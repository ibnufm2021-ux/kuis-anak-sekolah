"use client";

import React from "react";
import {
  Download,
  Eye,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  RotateCcw,
  Sparkles,
  Play,
} from "lucide-react";
import { GeneratedQuizData } from "@/lib/types";
import { trackClientAction } from "@/lib/client-tracking";

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
    trackClientAction({
      childName: quizData.childName,
      level: quizData.level,
      grade: quizData.grade,
      subject: quizData.subject,
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      questionCount: quizData.activeCount,
      usedModel,
      action: "Unduh HTML",
    });

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  const handleOpenNewTab = () => {
    trackClientAction({
      childName: quizData.childName,
      level: quizData.level,
      grade: quizData.grade,
      subject: quizData.subject,
      topic: quizData.topic,
      difficulty: quizData.difficulty,
      questionCount: quizData.activeCount,
      usedModel,
      action: "Buka Tab Baru",
    });

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-100 max-w-xl mx-auto space-y-6">
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
          siap digunakan, bisa dimainkan langsung atau diunduh untuk offline.
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

      {/* OPSI 1: JALANKAN LANGSUNG DI BROWSER (DIEMPHASIZE UNTUK YANG GAK MAU RIBET) */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-100/90 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            Pilihan Paling Praktis
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            Tanpa Perlu Unduh File
          </span>
        </div>

        <div>
          <h4 className="font-extrabold text-slate-800 text-base">
            Mainkan Kuis Langsung di Browser
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Cocok untuk yang tidak mau repot download & mencari file di HP. Langsung klik dan anak bisa mulai mengerjakan!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleOpenNewTab}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            Buka di Tab Baru (Penuh)
          </button>

          <button
            type="button"
            onClick={() => {
              trackClientAction({
                childName: quizData.childName,
                level: quizData.level,
                grade: quizData.grade,
                subject: quizData.subject,
                topic: quizData.topic,
                difficulty: quizData.difficulty,
                questionCount: quizData.activeCount,
                usedModel,
                action: "Lihat Kuis",
              });
              onPreview();
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-indigo-700 bg-white hover:bg-indigo-50 active:scale-[0.99] border border-indigo-200 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            Tinjau di Layar Ini
          </button>
        </div>
      </div>

      {/* OPSI 2: UNDUH FILE UNTUK OFFLINE */}
      <div className="space-y-2.5">
        <div className="text-left">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Opsi Simpan File (Bisa Dibuka Offline)
          </span>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-3.5 px-5 rounded-xl font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 hover:border-emerald-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          Unduh File Kuis (.html)
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-slate-500 hover:text-indigo-600 hover:bg-slate-100 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Buat Kuis Baru Lainnya
        </button>
      </div>

      {/* Petunjuk Membuka untuk Orang Tua */}
      <div className="border-t border-slate-200/80 pt-4 text-left space-y-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-slate-400" />
          Petunjuk Jika Membuka File Unduhan di HP:
        </h4>
        <ul className="text-xs text-slate-500 space-y-1.5 pl-4 list-disc">
          <li>
            <strong className="text-slate-700">PENTING (Khusus HP Android):</strong> Buka folder Download, ketuk file <code>.html</code>, lalu <strong>pilih buka dengan Google Chrome</strong> (jangan penampil dokumen bawaan HP) agar tombol kuis responsif dan bisa diklik.
          </li>
          <li>
            <strong className="text-slate-700">Di iPhone / iPad:</strong> Buka file melalui Safari atau aplikasi Files.
          </li>
          <li className="text-emerald-700 font-medium">
            💡 <strong>Mau tanpa ribet?</strong> Gunakan tombol <strong>&ldquo;Buka di Tab Baru&rdquo;</strong> di atas untuk langsung mulai latihan kapan saja!
          </li>
        </ul>
      </div>
    </div>
  );
}
