export interface TelemetryPayload {
  userId: string;
  userGenCount: number;
  childName: string;
  level: string;
  grade: string;
  subject: string;
  topic?: string;
  difficulty: string;
  questionCount: number;
  usedModel?: string;
  action: "Buat Kuis" | "Unduh HTML" | "Lihat Kuis" | "Buka Tab Baru";
}

export async function logQuizEventToSheet(payload: TelemetryPayload): Promise<void> {
  const webhookUrl =
    process.env.GOOGLE_SHEET_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbzuJcjRl7iRy54g2sc0iMV7HPdh9_Xl3G-g6FAJf5dx5QHbqFUMnfEyXcrOXWMCE-0R/exec";

  if (!webhookUrl) return;

  try {
    // Jalankan secara asynchronous tanpa menghambat proses kuis
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    }).catch((err) => {
      console.warn("Gagal mengirim log ke Google Sheet:", err.message);
    });
  } catch (err) {
    console.warn("Error logQuizEventToSheet:", err);
  }
}
