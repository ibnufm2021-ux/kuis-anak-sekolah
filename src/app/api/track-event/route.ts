import { NextRequest, NextResponse } from "next/server";
import { logQuizEventToSheet, TelemetryPayload } from "@/lib/telemetry";

export async function POST(req: NextRequest) {
  try {
    const body: TelemetryPayload = await req.json();

    if (!body.userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Kirim ke Google Spreadsheet di background
    logQuizEventToSheet(body);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error in /api/track-event:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
