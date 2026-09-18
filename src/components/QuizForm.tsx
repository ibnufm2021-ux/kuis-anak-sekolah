"use client";

import React, { useState } from "react";
import {
  EducationLevel,
  DifficultyLevel,
  QuizGenerationRequest,
} from "@/lib/types";
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Sliders,
  Check,
  Brain,
  HelpCircle,
} from "lucide-react";

interface QuizFormProps {
  onSubmit: (data: QuizGenerationRequest) => void;
  isLoading: boolean;
}

const GRADE_OPTIONS: Record<EducationLevel, string[]> = {
  TK: ["TK A (Usia 4-5 tahun)", "TK B (Usia 5-6 tahun)"],
  SD: [
    "Kelas 1 SD",
    "Kelas 2 SD",
    "Kelas 3 SD",
    "Kelas 4 SD",
    "Kelas 5 SD",
    "Kelas 6 SD",
  ],
  SMP: ["Kelas 7 SMP", "Kelas 8 SMP", "Kelas 9 SMP"],
  SMA: ["Kelas 10 SMA", "Kelas 11 SMA", "Kelas 12 SMA"],
};

const COMMON_SUBJECTS: Record<EducationLevel, string[]> = {
  TK: [
    "Mengenal Angka & Berhitung",
    "Mengenal Huruf & Kata",
    "Warna & Bentuk",
    "Hewan & Tumbuhan",
    "Budi Pekerti & Keseharian",
  ],
  SD: [
    "Matematika",
    "Ilmu Pengetahuan Alam (IPA)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Pendidikan Agama Islam (PAI)",
    "Pendidikan Pancasila (PPKn)",
    "Ilmu Pengetahuan Sosial (IPS)",
  ],
  SMP: [
    "Matematika",
    "IPA (Fisika & Biologi)",
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "IPS (Sejarah & Geografi)",
    "Pendidikan Agama Islam (PAI)",
    "Informatika",
  ],
  SMA: [
    "Matematika Wajib",
    "Fisika",
    "Kimia",
    "Biologi",
    "Bahasa Inggris",
    "Bahasa Indonesia",
    "Ekonomi & Akuntansi",
    "Sosiologi & Sejarah",
  ],
};

const DIFFICULTIES: {
  id: DifficultyLevel;
  label: string;
  badge: string;
  desc: string;
}[] = [
  {
    id: "sepele",
    label: "sepele",
    badge: "🌱 Pemula",
    desc: "Sangat mudah & konsep paling dasar",
  },
  {
    id: "gampang",
    label: "gampang",
    badge: "⭐ Mudah",
    desc: "Standar mudah dan santai",
  },
  {
    id: "sedeng lah",
    label: "sedeng lah",
    badge: "⚖️ Sedang",
    desc: "Pas sesuai kurikulum harian",
  },
  {
    id: "sulit",
    label: "sulit",
    badge: "🔥 HOTS",
    desc: "Menantang penalaran & logika berpikir",
  },
  {
    id: "olimpiade ini mah",
    label: "olimpiade ini mah",
    badge: "🏆 Kompetisi",
    desc: "Level olimpiade sains & penalaran kritis",
  },
];

export default function QuizForm({ onSubmit, isLoading }: QuizFormProps) {
  const [childName, setChildName] = useState("");
  const [level, setLevel] = useState<EducationLevel>("SD");
  const [grade, setGrade] = useState(GRADE_OPTIONS["SD"][2]); // Default Kelas 3
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("sedeng lah");
  const [questionCount, setQuestionCount] = useState<number>(10);

  const handleLevelChange = (newLevel: EducationLevel) => {
    setLevel(newLevel);
    setGrade(GRADE_OPTIONS[newLevel][0]);
    setSubject("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      alert("Mohon masukkan nama anak Anda terlebih dahulu.");
      return;
    }
    onSubmit({
      childName: childName.trim(),
      level,
      grade,
      subject: subject.trim(),
      topic: topic.trim(),
      difficulty,
      questionCount,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-100 space-y-6"
    >
      {/* Input Nama Anak */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          👦 Nama Panggilan Anak
        </label>
        <div className="relative">
          <input
            type="text"
            required
            disabled={isLoading}
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Contoh: Aisyah, Farhan, Kenzie..."
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400 font-medium transition-all text-base"
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Nama ini akan disematkan di salam pembuka kuis dan sertifikat hasil.
        </p>
      </div>

      {/* Pilihan Jenjang */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🏫 Jenjang Pendidikan
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(["TK", "SD", "SMP", "SMA"] as EducationLevel[]).map((lvl) => {
            const isSelected = level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                disabled={isLoading}
                onClick={() => handleLevelChange(lvl)}
                className={`py-3 px-3 rounded-xl font-bold text-center border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                }`}
              >
                <span className="text-xl">
                  {lvl === "TK" && "🎨"}
                  {lvl === "SD" && "🎒"}
                  {lvl === "SMP" && "📐"}
                  {lvl === "SMA" && "🔬"}
                </span>
                <span className="text-sm">{lvl}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pilihan Kelas Dinamis */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🎓 Pilih Kelas
        </label>
        <div className="relative">
          <select
            disabled={isLoading}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 bg-white font-medium appearance-none transition-all text-base"
          >
            {GRADE_OPTIONS[level].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </div>

      {/* Pilihan Mata Pelajaran */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-semibold text-slate-700">
            📚 Mata Pelajaran{" "}
            <span className="text-xs text-slate-400 font-normal">
              (Opsional)
            </span>
          </label>
        </div>

        {/* Saran Cepat Mata Pelajaran */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {COMMON_SUBJECTS[level].map((s) => (
            <button
              key={s}
              type="button"
              disabled={isLoading}
              onClick={() => setSubject(s)}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                subject === s
                  ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <input
          type="text"
          disabled={isLoading}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Atau ketik mapel lain, misal: Sejarah Kebudayaan Islam..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm transition-all"
        />
        <p className="text-xs text-slate-400 mt-1">
          *Jika dikosongkan, AI akan menyusun soal umum & tematik sesuai tingkat
          kelas anak.
        </p>
      </div>

      {/* Topik / Materi Khusus */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🎯 Topik Bahasan Tertentu{" "}
          <span className="text-xs text-slate-400 font-normal">
            (Opsional)
          </span>
        </label>
        <input
          type="text"
          disabled={isLoading}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Contoh: Pecahan Campuran, Tata Surya, Simple Past Tense..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm transition-all"
        />
      </div>

      {/* Tingkat Kesulitan */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          ⚡ Tingkat Kesulitan
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                disabled={isLoading}
                onClick={() => setDifficulty(diff.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/60 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 capitalize">
                    {diff.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-600">
                    {diff.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {diff.desc}
                </p>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jumlah Soal n */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex justify-between items-center mb-3">
          <div>
            <label className="block text-sm font-bold text-slate-700">
              Jumlah Soal Sesi Kuis (n)
            </label>
            <span className="text-xs text-slate-500">
              Maksimal 20 soal per ujian
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 shadow-sm">
            {questionCount}
          </div>
        </div>

        <input
          type="range"
          min={5}
          max={20}
          step={5}
          disabled={isLoading}
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />

        <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
          <span>5 soal</span>
          <span>10 soal</span>
          <span>15 soal</span>
          <span>20 soal</span>
        </div>

        <div className="mt-3 p-2.5 rounded-lg bg-indigo-50/80 border border-indigo-200/50 flex items-center gap-2.5 text-xs text-indigo-900 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>
            AI otomatis menyiapkan <strong>{questionCount * 4} soal</strong> di
            dalam file .html, sehingga tiap kali diulang soalnya selalu baru!
          </span>
        </div>
      </div>

      {/* Tombol Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="w-5 h-5 animate-spin text-amber-300" />
        Dapatkan Kuis (.html)
      </button>
    </form>
  );
}
