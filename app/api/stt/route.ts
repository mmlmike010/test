import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "XAI_API_KEY is not set" },
        { status: 500 }
      );
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid multipart body" },
        { status: 400 }
      );
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }
    if (file.size < 200) {
      return NextResponse.json(
        { error: "Audio too short — keep talking a moment longer" },
        { status: 400 }
      );
    }

    const upstream = new FormData();
    upstream.append("file", file, file.name || "audio.webm");
    upstream.append("language", "en");
    upstream.append("format", "true");

    for (const term of [
      "Kirkland",
      "Costco",
      "hummus",
      "quinoa",
      "Chobani",
      "granola",
    ]) {
      upstream.append("keyterm", term);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let res: Response;
    try {
      res = await fetch("https://api.x.ai/v1/stt", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: upstream,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const textBody = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        {
          error: "STT failed",
          detail: (textBody || `HTTP ${res.status}`).slice(0, 500),
        },
        { status: 502 }
      );
    }

    if (!textBody.trim()) {
      return NextResponse.json(
        { error: "Empty STT response" },
        { status: 502 }
      );
    }

    let data: { text?: string; language?: string; duration?: number };
    try {
      data = JSON.parse(textBody);
    } catch {
      return NextResponse.json(
        { error: "Bad STT JSON", detail: textBody.slice(0, 200) },
        { status: 502 }
      );
    }

    return NextResponse.json({
      text: (data.text || "").trim(),
      language: data.language,
      duration: data.duration,
      model: "grok-stt",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "STT route error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
