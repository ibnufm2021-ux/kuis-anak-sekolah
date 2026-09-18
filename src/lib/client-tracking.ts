export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "anonim";
  try {
    let uid = localStorage.getItem("kuis_uid");
    if (!uid) {
      uid = "usr_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
      localStorage.setItem("kuis_uid", uid);
    }
    return uid;
  } catch {
    return "anonim";
  }
}

export function incrementAndGetUserGenCount(): number {
  if (typeof window === "undefined") return 1;
  try {
    const current = parseInt(localStorage.getItem("kuis_gen_count") || "0", 10);
    const next = current + 1;
    localStorage.setItem("kuis_gen_count", String(next));
    return next;
  } catch {
    return 1;
  }
}

export function trackClientAction(data: {
  childName: string;
  level: string;
  grade: string;
  subject: string;
  topic?: string;
  difficulty: string;
  questionCount: number;
  usedModel?: string;
  action: "Unduh HTML" | "Lihat Kuis";
}): void {
  if (typeof window === "undefined") return;
  try {
    const userId = getOrCreateUserId();
    const userGenCount = parseInt(localStorage.getItem("kuis_gen_count") || "1", 10);

    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userGenCount,
        ...data,
      }),
    }).catch(() => {});
  } catch {
    // Ignore tracking failure
  }
}
