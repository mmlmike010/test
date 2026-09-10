"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  GripVertical,
  Maximize2,
  Minimize2,
  History,
  ArrowRight,
  ShoppingCart,
  Square,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { products } from "@/lib/data/products";
import KirkMark from "@/components/KirkMark";
import GoldStarMembershipCard from "@/components/GoldStarMembershipCard";
import SuggestedActionChip, {
  type SuggestedActionChipTone,
} from "@/components/SuggestedActionChip";

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

const primarySuggestions: {
  label: string;
  tone: SuggestedActionChipTone;
}[] = [
  { label: "Shop my usual items (Buy Again)", tone: "blue" },
  { label: "Everyday Member Savings", tone: "red" },
  { label: "Plan a camping weekend", tone: "blue" },
  { label: "This week's dinners", tone: "blue" },
  { label: "Recipe ideas for this week", tone: "blue" },
];

const moreSuggestions: {
  label: string;
  tone: SuggestedActionChipTone;
}[] = [
  { label: "What's in my cart?", tone: "blue" },
  { label: "Find Kirkland swaps", tone: "red" },
  { label: "Kids soccer week, no peanuts", tone: "blue" },
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origLeft: number;
    origTop: number;
  } | null>(null);
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
  const kirkCartCount = useCartStore((state) => state.getTotalItems());
  const kirkCartSubtotal = useCartStore((state) => state.getSubtotal());

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
    setShowHome(true);
    setShowMoreSuggestions(false);
  };

  const clampPanelPos = (left: number, top: number) => {
    const el = panelRef.current;
    const width = el?.offsetWidth ?? 360;
    const height = el?.offsetHeight ?? 200;
    const maxLeft = Math.max(8, window.innerWidth - width - 8);
    const maxTop = Math.max(8, window.innerHeight - height - 8);
    return {
      left: Math.min(Math.max(8, left), maxLeft),
      top: Math.min(Math.max(8, top), maxTop),
    };
  };

  const onDragPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: rect.left,
      origTop: rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onDragPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    setPanelPos(
      clampPanelPos(
        drag.origLeft + (e.clientX - drag.startX),
        drag.origTop + (e.clientY - drag.startY)
      )
    );
  };

  const onDragPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
    }
  };

  const handleHistory = () => {
    const hasConversation = messages.some((m) => m.role === "user");
    if (showHome && hasConversation) {
      setShowHome(false);
      return;
    }
    if (!showHome) {
      setShowHome(true);
      return;
    }
    handleReset();
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
    setShowHome(false);
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

  const iconBtn =
    "inline-flex size-7 items-center justify-center rounded-md text-costco-text-muted transition-colors hover:bg-costco-surface hover:text-costco-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue";

  return (
    <>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby="ask-costco-title"
        className={`fixed z-[55] flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.18)] ${
          isExpanded ? "h-[min(80vh,720px)] w-[420px]" : "w-[360px]"
        } ${!showHome && !isExpanded ? "h-[min(70vh,560px)]" : ""}`}
        style={
          panelPos
            ? { left: panelPos.left, top: panelPos.top }
            : { right: 24, bottom: 24 }
        }
      >
        <div className="flex h-[52px] w-full shrink-0 items-center justify-between py-3.5 pr-3 pl-4">
          <div className="flex items-center gap-2">
            <h2
              id="ask-costco-title"
              className="text-[18px] leading-normal font-bold text-costco-text"
            >
              Ask Costco
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-costco-ai-pill px-2 py-[3px] text-costco-blue">
              <span aria-hidden="true" className="text-[10px] font-bold">
                ✦
              </span>
              <span className="text-[11px] font-semibold">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              aria-label="Drag panel"
              className={`${iconBtn} cursor-grab active:cursor-grabbing`}
              onPointerDown={onDragPointerDown}
              onPointerMove={onDragPointerMove}
              onPointerUp={onDragPointerUp}
              onPointerCancel={onDragPointerUp}
            >
              <GripVertical className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
              aria-pressed={isExpanded}
              className={iconBtn}
              onClick={() => setIsExpanded((open) => !open)}
            >
              {isExpanded ? (
                <Minimize2 className="size-3.5" aria-hidden="true" />
              ) : (
                <Maximize2 className="size-3.5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              aria-label="Conversation history"
              aria-pressed={!showHome}
              className={iconBtn}
              onClick={handleHistory}
            >
              <History className="size-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Close Ask Costco"
              className={iconBtn}
              onClick={onClose}
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {cartNotice && (
          <div className="mx-4 mb-1 flex items-center gap-2 rounded-lg border border-[#b7d7b0] bg-[#eef7ee] px-3 py-2 text-[12px] font-semibold text-[#1e5b24] shrink-0">
            <ShoppingCart className="h-3.5 w-3.5" />
            {cartNotice}
          </div>
        )}

        {kirkCartCount > 0 && (
          <button
            type="button"
            onClick={openCart}
            className="mx-4 mb-2 flex items-center justify-between rounded-full border border-[#c5d8ea] bg-[#e8f2fa] px-3.5 py-2 text-left hover:bg-[#dceaf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
          >
            <span className="flex items-center gap-2 min-w-0">
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-costco-blue" />
              <span className="truncate text-[12px] font-bold text-costco-blue">
                View cart · {kirkCartCount} item{kirkCartCount === 1 ? "" : "s"}
              </span>
            </span>
            <span className="text-[13px] font-bold tabular-nums text-costco-text">
              ${kirkCartSubtotal.toFixed(2)}
            </span>
          </button>
        )}

        {showHome ? (
          <div className="flex w-full flex-col items-start gap-3.5 px-4 pt-1 pb-4">
            <p className="min-h-10 w-full text-[15px] leading-normal text-costco-text">
              Hi Marco, what would you like to do today?
            </p>
            <div className="flex w-full flex-col items-start gap-2.5">
              {primarySuggestions.map((chip) => (
                <SuggestedActionChip
                  key={chip.label}
                  label={chip.label}
                  tone={chip.tone}
                  disabled={isLoading}
                  onClick={() => void sendMessage(chip.label)}
                />
              ))}
              {showMoreSuggestions &&
                moreSuggestions.map((chip) => (
                  <SuggestedActionChip
                    key={chip.label}
                    label={chip.label}
                    tone={chip.tone}
                    disabled={isLoading}
                    onClick={() => void sendMessage(chip.label)}
                  />
                ))}
            </div>
            <button
              type="button"
              aria-label={
                showMoreSuggestions
                  ? "Hide more suggestions"
                  : "Show more suggestions"
              }
              aria-expanded={showMoreSuggestions}
              onClick={() => setShowMoreSuggestions((open) => !open)}
              className="inline-flex items-center justify-center rounded-full bg-costco-surface px-2 py-1.5 text-[12px] font-bold leading-none text-costco-text-muted transition-colors hover:bg-[#ececec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
            >
              <span
                aria-hidden="true"
                className={`inline-block ${showMoreSuggestions ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-white px-3.5 py-3.5">
            {messages.map((message) => {
              const isWelcome = message.id.startsWith("welcome-");
              if (isWelcome) {
                return (
                  <div key={message.id} className="space-y-2.5">
                    <GoldStarMembershipCard />
                    <div className="flex gap-2 justify-start">
                      <KirkMark size={28} className="mt-0.5 shrink-0" />
                      <div className="max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl rounded-bl-md bg-white text-costco-text border border-[#e8e8e8] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <KirkMark size={28} className="mt-0.5 shrink-0" />
                  )}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed rounded-2xl ${
                      message.role === "user"
                        ? "bg-costco-blue text-white rounded-br-md"
                        : "bg-white text-costco-text border border-[#e8e8e8] rounded-bl-md shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    {message.imageUrl && (
                      <div className="mt-2.5 overflow-hidden border border-[#e8e8e8] bg-white">
                        <button
                          type="button"
                          onClick={() => setLightboxUrl(message.imageUrl || null)}
                          className="block w-full text-left group relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
                          title="Click to enlarge"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={message.imageUrl}
                            alt="Recipe inspiration"
                            className="w-full h-auto max-h-[320px] object-cover group-hover:opacity-95 transition-opacity"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5">
                            Enlarge
                          </span>
                        </button>
                        <p className="text-[10px] text-[#666] px-2.5 py-1.5 bg-[#fafafa] border-t border-[#eee] font-semibold tracking-wide uppercase">
                          Recipe inspiration · tap to enlarge
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start gap-2">
                <KirkMark size={28} className="mt-0.5 shrink-0" />
                <div className="bg-white border border-[#ededed] rounded-2xl rounded-bl-md px-3.5 py-3 max-w-[82%]">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[11px] text-[#666] mr-1 font-semibold">
                      Kirk
                    </span>
                    <div className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce"
                      style={{ animationDelay: "0.12s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-[#999] rounded-full animate-bounce"
                      style={{ animationDelay: "0.24s" }}
                    />
                  </div>
                  {pendingInspire && (
                    <div className="mt-2.5 flex items-center gap-2 border border-costco-blue/20 bg-[#eef5fb] px-2.5 py-2">
                      <div className="relative flex h-7 w-7 items-center justify-center bg-costco-blue/10 overflow-hidden shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-costco-blue animate-pulse" />
                        <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-costco-blue">
                          Generating image…
                        </p>
                        <p className="text-[10px] text-[#666] truncate">
                          Recipe inspiration
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {error && (
              <p className="text-[12px] text-costco-red bg-[#fff5f6] border border-[#f3c5cb] px-3 py-2">
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {(isRecording || isTranscribing || isSpeaking) && (
          <div className="px-3.5 py-1.5 border-t border-costco-ci-border bg-[#fff8f8] text-[12px] text-[#333] flex items-center gap-2 shrink-0">
            {isSpeaking ? (
              <>
                <span className="inline-flex items-end gap-[3px] h-3.5 text-costco-red">
                  <span className="kirk-eq-bar" />
                  <span className="kirk-eq-bar" style={{ animationDelay: "0.12s" }} />
                  <span className="kirk-eq-bar" style={{ animationDelay: "0.24s" }} />
                </span>
                <span className="font-semibold">Kirk is speaking…</span>
              </>
            ) : isTranscribing ? (
              <span className="font-semibold text-[#555]">
                Transcribing your request…
              </span>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-costco-red kirk-listening" />
                <span className="font-semibold">
                  Listening — pause to send. Kirk will read the reply aloud.
                </span>
              </>
            )}
          </div>
        )}

        <div className="w-full shrink-0 bg-white">
          <div className="h-px w-full bg-costco-ci-border" />
          <div className="flex h-[52px] items-center justify-between p-3.5">
            <div className="flex min-w-0 flex-1 items-center gap-2.5">
              <button
                type="button"
                aria-label={
                  isSpeaking
                    ? "Stop speaking"
                    : isRecording
                      ? "Stop recording"
                      : isTranscribing
                        ? "Transcribing"
                        : "Speak — stops when you pause; reply is read aloud"
                }
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                    return;
                  }
                  if (isRecording) stopRecording();
                  else void startRecording();
                }}
                disabled={isLoading || isTranscribing}
                className="relative size-[22px] shrink-0 overflow-hidden rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue disabled:opacity-50"
              >
                <span
                  aria-hidden="true"
                  className="block size-[22px] rounded-full bg-costco-red"
                />
                {(isRecording || isSpeaking) && (
                  <Square className="absolute inset-0 m-auto size-2.5 text-white" />
                )}
              </button>
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
                      : "Ask me anything"
                }
                aria-label="Message"
                className="min-w-0 flex-1 border-0 bg-transparent text-[14px] leading-normal text-costco-text placeholder:text-costco-text-muted focus:outline-none focus-visible:outline-none"
                disabled={isLoading || isRecording || isTranscribing}
              />
            </div>
            <button
              type="button"
              aria-label="Send message"
              onClick={() => void sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="shrink-0 text-[16px] font-bold text-costco-blue transition-opacity disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
            >
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
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
            className="absolute top-4 right-4 bg-white text-costco-text px-3 py-1.5 text-sm font-bold shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-costco-blue"
            onClick={() => setLightboxUrl(null)}
          >
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Recipe inspiration enlarged"
            className="max-h-[90vh] max-w-[min(920px,96vw)] shadow-2xl object-contain bg-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

