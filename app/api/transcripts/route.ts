import { NextRequest, NextResponse } from "next/server";
import { getTranscriptPath, readTranscripts } from "@/lib/transcripts";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Number(searchParams.get("limit") || 500) || 500,
    5000
  );
  const turns = await readTranscripts(limit);
  return NextResponse.json({
    count: turns.length,
    path: getTranscriptPath(),
    source: "localhost",
    note: "Only real Ask Kirk conversations from this local demo are stored. No seeded demo pack.",
    turns,
  });
}
