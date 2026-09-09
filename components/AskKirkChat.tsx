"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  RefreshCw,
  Send,
  Mic,
  ShoppingCart,
  Square,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { products } from "@/lib/data/products";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string | null;
}

interface AskKirkChatProps {
  isOpen: boolean;
  onClose: () => void;
}

type KirkAction =
  | { tool: "view_cart" }
  | { tool: "open_cart" }
  | { tool: "add_to_cart"; productIds: string[]; quantity?: number }
  | { tool: "remove_from_cart"; productIds: string[] }
  | { tool: "clear_cart" };

const suggestionChips = [
  "What's in my cart?",
  "Add Kirkland hummus and quinoa to my cart",
  "Find Kirkland swaps",
  "Build a party platter",
  "Recipe inspiration with hummus and tomatoes",
  "Kids soccer week, no peanuts",
  "What can I cook for dinner with quinoa?",
];


function looksLikeInspireAsk(text: string) {
  const t = text.toLowerCase();
  if (/rec+ipes?|recipie|receipe|dinner|meal|cook(?:ing)?|inspire|plating|snack board|mezze|bowl/i.test(t)) {
    return true;
  }
  if (/what(?:\s+kind\s+of)?[\s\w,]*\b(?:can|should)\s+i\s+(?:make|cook|eat|prepare)/i.test(t)) {
    return true;
  }
  if (/hummus/i.test(t) && /\bnuts?\b|trail mix/i.test(t)) return true;
  return false;
}

function makeWelcome(): Message {
  return {
    id: `welcome-${Date.now()}`,
    role: "assistant",
    content:
      "Hi! I'm Kirk. Ask me to build a cart, check what's in it, find Kirkland swaps, or tap a suggestion below. Tap Speak to talk — I'll read my reply aloud.",
    timestamp: new Date(),
  };
}

export default function AskKirkChat({ isOpen, onClose }: AskKirkChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => [makeWelcome()]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window === "undefined") return `s-${Date.now()}`;
    const key = "kirk_session_id";
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    window.sessionStorage.setItem(key, id);
    return id;
  });
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingInspire, setPendingInspire] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const voiceReplyPendingRef = useRef(false);
  const vadCleanupRef = useRef<(() => void) | null>(null);
  const recordingStartedAtRef = useRef(0);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const openCart = useCartStore((state) => state.openCart);
  const getSnapshot = useCartStore((state) => state.getSnapshot);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      vadCleanupRef.current?.();
      mediaRecorderRef.current?.stop();
      audioRef.current?.pause();
    };
  }, []);

  const mintSession = () => {
    const id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("kirk_session_id", id);
    }
    setSessionId(id);
    return id;
  };

  const stopSpeaking = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsSpeaking(false);
  };

  const handleReset = () => {
    stopSpeaking();
    voiceReplyPendingRef.current = false;
    mintSession();
    setMessages([makeWelcome()]);
    setInput("");
    setIsLoading(false);
    setPendingInspire(false);
    setLightboxUrl(null);
    setError(null);
    setCartNotice(null);
  };

  const applyActions = (actions: KirkAction[]) => {
    if (!actions?.length) return;
    const notices: string[] = [];
    let shouldOpen = false;

    for (const action of actions) {
      if (action.tool === "view_cart" || action.tool === "open_cart") {
        shouldOpen = true;
        continue;
      }
      if (action.tool === "clear_cart") {
        clearCart();
        notices.push("Cleared cart");
        shouldOpen = true;
        continue;
      }
      if (action.tool === "add_to_cart") {
        const qty =
          action.quantity && action.quantity > 0 ? action.quantity : 1;
        let added = 0;
        for (const id of action.productIds || []) {
          const product = products.find((p) => p.id === id);
          if (product) {
            addItem(product, qty);
            added += 1;
          }
        }
        if (added) {
          notices.push(`Added ${added} item${added === 1 ? "" : "s"}`);
          shouldOpen = true;
        }
        continue;
      }
      if (action.tool === "remove_from_cart") {
        for (const id of action.productIds || []) removeItem(id);
        notices.push("Updated cart");
        shouldOpen = true;
      }
    }

    if (shouldOpen) openCart();
    if (notices.length) {
      setCartNotice(notices[0]);
      window.setTimeout(() => setCartNotice(null), 3500);
    }
  };

  const speakText = async (text: string) => {
    if (!voiceReplyPendingRef.current || !text.trim()) return;
    voiceReplyPendingRef.current = false;
    try {
      stopSpeaking();
      setIsSpeaking(true);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice_id: "eve" }),
      });
      if (!res.ok) {
        setIsSpeaking(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setPendingInspire(looksLikeInspireAsk(trimmed));
    setError(null);

    try {
      const res = await fetch("/api/kirk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          zip: "11217",
          cart: getSnapshot().items,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const raw = await res.text();
      let data: Record<string, unknown> = {};
      if (raw.trim()) {
        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error(
            res.ok
              ? "Bad Kirk response"
              : `Kirk failed (HTTP ${res.status})`
          );
        }
      } else {
        throw new Error(
          res.ok
            ? "Empty Kirk response — is the app server running?"
            : `Kirk failed (HTTP ${res.status})`
        );
      }
      if (!res.ok) {
        throw new Error(
          String(data.error || data.detail || "Kirk request failed")
        );
      }

      const reply: string =
        (typeof data.reply === "string" && data.reply) ||
        "Sorry — I blanked for a second. Try again?";
      const actions = Array.isArray(data.actions)
        ? (data.actions as KirkAction[])
        : [];
      if (actions.length) {
        applyActions(actions);
      } else if (Array.isArray(data.productIds) && data.productIds.length) {
        applyActions([
          {
            tool: "add_to_cart",
            productIds: data.productIds as string[],
            quantity: 1,
          },
        ]);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
        imageUrl:
          typeof data.imageUrl === "string" ? data.imageUrl : null,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      void speakText(reply);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I couldn't reach Grok just now. Check that XAI_API_KEY is set and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setPendingInspire(false);
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      vadCleanupRef.current?.();
      vadCleanupRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recordingStartedAtRef.current = Date.now();

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        vadCleanupRef.current?.();
        vadCleanupRef.current = null;
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        if (blob.size < 500) {
          setError("Didn't catch that — talk a bit longer.");
          setIsRecording(false);
          return;
        }
        setIsTranscribing(true);
        try {
          const fd = new FormData();
          fd.append("file", blob, "kirk-voice.webm");
          const res = await fetch("/api/stt", { method: "POST", body: fd });
          const raw = await res.text();
          let data: { text?: string; error?: string; detail?: string } = {};
          if (raw.trim()) {
            try {
              data = JSON.parse(raw);
            } catch {
              throw new Error(
                res.ok
                  ? "Bad STT response"
                  : `STT failed (HTTP ${res.status})`
              );
            }
          } else {
            throw new Error(
              res.ok
                ? "Empty STT response — is the app server running?"
                : `STT failed (HTTP ${res.status})`
            );
          }
          if (!res.ok) {
            throw new Error(data.error || data.detail || "STT failed");
          }
          const text = (data.text || "").trim();
          if (!text) {
            setError("Couldn't transcribe — try again.");
          } else {
            setInput(text);
            voiceReplyPendingRef.current = true;
            void sendMessage(text);
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : "Voice input failed");
        } finally {
          setIsTranscribing(false);
          setIsRecording(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecording(true);

      // Auto-stop after ~1.1s of silence once speech was detected
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let speechSeen = false;
      let silentMs = 0;
      let lastTs = performance.now();
      let raf = 0;
      const SILENCE_RMS = 0.015;
      const SILENCE_HOLD_MS = 1100;
      const MIN_MS = 900;
      const MAX_MS = 20000;

      const tick = () => {
        const now = performance.now();
        const dt = now - lastTs;
        lastTs = now;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > SILENCE_RMS) {
          speechSeen = true;
          silentMs = 0;
        } else if (speechSeen) {
          silentMs += dt;
        }
        const elapsed = Date.now() - recordingStartedAtRef.current;
        if (
          (speechSeen && silentMs >= SILENCE_HOLD_MS && elapsed >= MIN_MS) ||
          elapsed >= MAX_MS
        ) {
          if (recorder.state === "recording") recorder.stop();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      vadCleanupRef.current = () => {
        cancelAnimationFrame(raf);
        try {
          source.disconnect();
        } catch {
          /* ignore */
        }
        void ctx.close();
      };
    } catch {
      setError("Microphone permission needed for Speak.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    vadCleanupRef.current?.();
    vadCleanupRef.current = null;
    const rec = mediaRecorderRef.current;
    if (rec && rec.state === "recording") {
      rec.stop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    <aside className="w-[380px] xl:w-[400px] shrink-0 bg-white border-l border-gray-200 h-[calc(100vh-132px)] sticky top-[132px] flex flex-col z-40 shadow-[-8px_0_24px_rgba(0,0,0,0.06)]">
      <div className="bg-[#0060A9] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-lg">
            🛒
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide">ASK KIRK</h2>
            <p className="text-[11px] text-blue-100">Same-Day shopping</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 text-xs hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="Reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-xs hover:bg-white/10 rounded transition-colors flex items-center gap-1"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
            Close
          </button>
        </div>
      </div>

      {cartNotice && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 text-green-800 px-3 py-2 text-xs font-medium shrink-0">
          <ShoppingCart className="w-3.5 h-3.5" />
          {cartNotice}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f3f4f6] min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                message.role === "user"
                  ? "bg-[#0060A9] text-white rounded-br-md whitespace-pre-line"
                  : "bg-white text-gray-900 shadow-sm border border-gray-200 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              {message.imageUrl && (
                <div className="mt-2.5 overflow-hidden rounded-xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(message.imageUrl || null)}
                    className="block w-full text-left group relative"
                    title="Click to enlarge"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.imageUrl}
                      alt="Recipe inspiration"
                      className="w-full h-auto max-h-[320px] object-cover group-hover:opacity-95 transition-opacity"
                    />
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/55 text-white text-[10px] font-medium px-2 py-0.5 opacity-80 group-hover:opacity-100">
                      Enlarge
                    </span>
                  </button>
                  <p className="text-[10px] text-gray-500 px-2 py-1 bg-gray-50">
                    Grok Imagine · tap to enlarge
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-3 shadow-sm max-w-[88%]">
              <div className="flex gap-1.5 items-center">
                <span className="text-[11px] text-gray-500 mr-1">Kirk</span>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.12s" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.24s" }}
                />
              </div>
              {pendingInspire && (
                <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-[#0060A9]/15 bg-gradient-to-r from-sky-50 via-white to-amber-50 px-2.5 py-2">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#0060A9]/10 overflow-hidden shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-[#0060A9] animate-pulse" />
                    <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#0060A9]">
                      Generating image…
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      Grok Imagine
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {error && <p className="text-[11px] text-red-600 px-1">{error}</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 pt-3 pb-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex flex-wrap gap-1.5 mb-3 content-start">
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => void sendMessage(chip)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-700 text-[11px] leading-snug rounded-full transition-colors border border-gray-200"
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-stretch">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isTranscribing
                ? "Transcribing…"
                : isRecording
                  ? "Listening…"
                  : "Ask Kirk for a cart"
            }
            className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#0060A9] focus:ring-1 focus:ring-[#0060A9]/30"
            disabled={isLoading || isRecording || isTranscribing}
          />
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                return;
              }
              if (isRecording) stopRecording();
              else void startRecording();
            }}
            disabled={isLoading || isTranscribing}
            className={`px-2.5 border rounded-xl transition-colors text-[11px] font-medium flex flex-col items-center justify-center gap-0.5 min-w-[56px] ${
              isRecording || isSpeaking
                ? "bg-red-600 text-white border-red-600"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
            title={
              isSpeaking
                ? "Stop speaking"
                : isRecording
                  ? "Stop"
                  : "Speak — stops when you pause; I'll read the reply aloud"
            }
          >
            {isRecording || isSpeaking ? (
              <Square className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
            {isSpeaking
              ? "Stop"
              : isRecording
                ? "Stop"
                : isTranscribing
                  ? "…"
                  : "Speak"}
          </button>
          <button
            type="button"
            onClick={() => void sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="px-3 bg-[#0060A9] text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm min-w-[72px] justify-center"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </aside>
    {lightboxUrl && (
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
        onClick={() => setLightboxUrl(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged recipe image"
      >
        <button
          type="button"
          className="absolute top-4 right-4 rounded-full bg-white/90 text-gray-800 px-3 py-1.5 text-sm font-semibold shadow"
          onClick={() => setLightboxUrl(null)}
        >
          Close
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lightboxUrl}
          alt="Recipe inspiration enlarged"
          className="max-h-[90vh] max-w-[min(920px,96vw)] rounded-2xl shadow-2xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    )}
    </>
  );
}

