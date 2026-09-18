"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, Brain, Cpu, FileCode2 } from "lucide-react";

interface GeneratingStateProps {
  childName: string;
  totalQuestions: number;
}

export default function GeneratingState({
  childName,
  totalQuestions,
}: GeneratingStateProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: "Menganalisis Materi & Usia Anak",
      desc: `Menyiapkan topik pembelajaran yang pas untuk ${childName}...`,
    },
    {
      icon: Cpu,
      title: "Memanggil Gemini AI",
      desc: `Menghasilkan bank soal variatif sebanyak ${totalQuestions * 4} butir...`,
    },
    {
      icon: Sparkles,
      title: "Memverifikasi Kunci Jawaban & Pembahasan",
      desc: "Menyusun penjelasan edukatif yang ramah dan mudah dipahami...",
    },
    {
      icon: FileCode2,
      title: "Merakit File .html Mandiri",
      desc: "Menyisipkan game engine offline untuk HP, tablet, dan laptop...",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-indigo-100 text-center max-w-lg mx-auto space-y-6">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🤖
        </div>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-slate-800">
          Sedang Meracik Kuis Spesial...
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Mohon tunggu sebentar, AI sedang membuat {totalQuestions * 4} bank soal
          terbaik untuk <strong>{childName}</strong>.
        </p>
      </div>

      <div className="space-y-3 text-left pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isCurrent
                  ? "bg-indigo-50/80 border-indigo-300 shadow-sm"
                  : isDone
                  ? "bg-slate-50/60 border-slate-200 opacity-60"
                  : "bg-transparent border-transparent opacity-30"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isCurrent
                    ? "bg-indigo-600 text-white"
                    : isDone
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800">{step.title}</p>
                <p className="text-xs text-slate-500 truncate">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
