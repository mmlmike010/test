import { appendFile, mkdir, readFile, access } from "fs/promises";
import path from "path";

export type TranscriptTurn = {
  session_id: string;
  ts: string;
  zip?: string;
  channel: "ask_kirk";
  user: string;
  assistant: string;
  product_ids: string[];
  model: string;
  reasoning_effort: string;
  source: "localhost";
};

const DATA_DIR = path.join(process.cwd(), "data");
const TRANSCRIPT_PATH = path.join(DATA_DIR, "kirk-transcripts.jsonl");

export function getTranscriptPath() {
  return TRANSCRIPT_PATH;
}

export async function appendTranscript(turn: TranscriptTurn): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(TRANSCRIPT_PATH, `${JSON.stringify(turn)}\n`, "utf8");
}

export async function readTranscripts(limit = 500): Promise<TranscriptTurn[]> {
  try {
    await access(TRANSCRIPT_PATH);
  } catch {
    return [];
  }
  const raw = await readFile(TRANSCRIPT_PATH, "utf8");
  const lines = raw.split("\n").filter(Boolean);
  const parsed: TranscriptTurn[] = [];
  for (const line of lines.slice(-limit)) {
    try {
      parsed.push(JSON.parse(line) as TranscriptTurn);
    } catch {
      // skip bad lines
    }
  }
  return parsed;
}
