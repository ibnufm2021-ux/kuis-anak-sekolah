# 🎒 KuisPintar Anak - Generator Kuis Mandiri Offline (.html)

Aplikasi web ramah orang tua untuk membuat paket kuis pilihan ganda interaktif berformat file mandiri `.html` yang **100% bisa dimainkan secara offline** di HP, tablet, maupun laptop anak tanpa kuota internet dan bebas iklan.

Ditenagai oleh **Google Gemini 3.5 Flash Lite** dengan sistem **$4 \times n$ Pool Randomization** (setiap sesi kuis memilih $n$ soal secara acak dari bank $4 \times n$ soal, sehingga kuis dapat diulang berkali-kali dengan kombinasi soal baru).

---

## 🌟 Fitur Utama

1. **Form Orang Tua yang Ramah & Simpel**:
   - **Nama Anak**: Personalisasi salam pembuka dan sertifikat skor.
   - **Jenjang & Kelas**: Bertingkat dinamis (**TK**, **SD**, **SMP**, **SMA**).
   - **Mata Pelajaran (Opsional)**: Pilihan tombol cepat atau ketik topik kustom.
   - **Tingkat Kesulitan Khas**:
     - `sepele` (🌱 Sangat Gampang)
     - `gampang` (⭐ Mudah)
     - `sedeng lah` (⚖️ Sedang / Kurikulum Normal)
     - `sulit` (🔥 Menantang / HOTS)
     - `olimpiade ini mah` (🏆 Level Kompetisi & Penalaran Kritis)
   - **Jumlah Soal ($n$)**: Slider 5 hingga 20 butir soal (otomatis membuat bank $4 \times n$ butir soal).
2. **File Kuis Mandiri (.html) untuk Anak**:
   - **100% Offline**: Cukup simpan file `.html`, tidak perlu internet lagi saat anak mengerjakan.
   - **Randomisasi $4 \times n$ Pool**: Setiap kali klik tombol *"Ulangi Kuis"*, sistem mengacak $n$ soal baru dari bank soal dan mengacak urutan opsi A, B, C, D.
   - **Gamifikasi**: Timer santai, indikator progress, penilaian instan (0-100), animasi pujian, dan pembahasan lengkap tiap soal.
   - **Cetak Hasil**: Mendukung cetak langsung atau simpan sebagai PDF.
3. **Live Preview Langsung**:
   - Orang tua bisa mencoba kuis langsung di dalam web generator sebelum mendownload file.

---

## 🚀 Cara Menjalankan di Lokal (Local Development)

1. Pastikan Node.js (v18+) sudah terpasang.
2. Clone repository dan install dependensi:
   ```bash
   npm install
   ```
3. Konfigurasi file `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.5-flash-lite
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka browser di `http://localhost:3000`.

---

## ☁️ Panduan Deploy ke Vercel (Gratis & 1-Klik)

Aplikasi ini dibuat dengan Next.js App Router standar, sehingga 100% optimal di-deploy ke Vercel:

1. **Push kode ke GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi aplikasi kuis anak"
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
2. **Deploy di Vercel**:
   - Masuk ke [vercel.com](https://vercel.com) dan klik **"Add New"** > **"Project"**.
   - Pilih repository GitHub Anda.
   - Di bagian **Environment Variables**, tambahkan:
     - `GEMINI_API_KEY`: `(Masukkan API Key Gemini Anda)`
     - `GEMINI_MODEL`: `gemini-3.5-flash-lite`
   - Klik **Deploy**.
3. Selesai! Website Anda sudah langsung aktif dengan HTTPS gratis dan performa kilat.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Model**: Google Gemini 3.5 Flash Lite
