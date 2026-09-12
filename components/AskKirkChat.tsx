"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mic,
  ShoppingCart,
  Square,
  Sparkles,
  Search,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { products } from "@/lib/data/products";
import KirkMark from "@/components/KirkMark";
import ShopProductRow from "@/components/ShopProductRow";
import WarehouseSearchResults from "@/components/WarehouseSearchResults";
import CostcoLogo from "@/components/CostcoLogo";
import WarehouseMembershipBanner from "@/components/WarehouseMembershipBanner";
import WarehouseHomepageHero from "@/components/WarehouseHomepageHero";
import WarehouseHomepageShortcuts from "@/components/WarehouseHomepageShortcuts";
import WarehouseHomepageSpotlights from "@/components/WarehouseHomepageSpotlights";
import WarehouseShopDepartments from "@/components/WarehouseShopDepartments";
import WarehouseAisleScroller from "@/components/WarehouseAisleScroller";
import WarehouseCompareSheet from "@/components/WarehouseCompareSheet";
import WarehouseFooter from "@/components/WarehouseFooter";
import {
  useStorefrontOverlayClass,
  useSessionStore,
} from "@/lib/store/session";
import { useCatalogStore } from "@/lib/store/catalog";
import { useKirkAskStore } from "@/lib/store/kirkAsk";
import {
  FLYER_DEAL_IDS,
  hideWarehouseLeftovers,
  kirklandWarehousePreview,
  kirkQueryPreview,
  storefrontQueryForKirk,
  warehouseBrowsePreview,
  warehouseBrowseTitle,
} from "@/lib/ui/merchOrder";
import {
  applyWarehouseFacets,
  EMPTY_WAREHOUSE_FACETS,
} from "@/lib/ui/warehouseSearch";
import { warehousePackSrc } from "@/lib/ui/packSize";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string | null;
  productIds?: string[];
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

const GROK_FALLBACK =
  "I couldn't reach Grok just now. Check that XAI_API_KEY is set and try again.";

const suggestionChips = [
  "What's in my cart?",
  "Add Kirkland hummus and quinoa to my cart",
  "Find Kirkland swaps",
  "Build a party platter",
  "Recipe inspiration with hummus and tomatoes",
  "Kids soccer week, no peanuts",
  "What can I cook for dinner with quinoa?",
];


function KirklandHelpCard({
  title,
  children,
  variant = "page",
}: {
  title: string;
  children: ReactNode;
  variant?: "foil" | "page";
}) {
  if (variant === "page") {
    return (
      <section className="overflow-hidden border border-[#c4c4c4] bg-white">
        <p className="border-b border-[#c4c4c4] bg-[#f6f7f8] px-4 py-2.5 text-[15px] font-bold text-[#1a1a1a]">
          {title}
        </p>
        <div className="px-4 py-3 text-[13px] leading-relaxed text-[#1a1a1a]">
          {children}
        </div>
      </section>
    );
  }
  return (
    <section className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
      <div className="h-[3px] bg-gradient-to-r from-[#8c7318] via-[#f3e3a3] to-[#8c7318]" />
      <div className="px-3.5 py-2.5">
        <p className="text-[13px] font-bold text-[#1a1a1a]">{title}</p>
        <div className="mt-1 text-[13px] leading-relaxed text-[#1a1a1a]">
          {children}
        </div>
      </div>
    </section>
  );
}

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
  const [kirkResultsView, setKirkResultsView] = useState<"grid" | "list">(
    "grid"
  );
  const [kirkFiltersOpen, setKirkFiltersOpen] = useState(false);
  const [kirkCompareIds, setKirkCompareIds] = useState<string[]>([]);
  const [kirkCompareOpen, setKirkCompareOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestResultsRef = useRef<HTMLDivElement>(null);
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
  const q = useCatalogStore((s) => s.q);
  const warehouseFacets = useCatalogStore((s) => s.warehouseFacets);
  const setWarehouseFacets = useCatalogStore((s) => s.setWarehouseFacets);
  const kirkShopPage = useSessionStore((s) => s.kirkShopPage);
  const overlayClass = useStorefrontOverlayClass(isOpen);

  useEffect(() => {
    const onlyWelcome =
      messages.length === 1 && messages[0]?.id.startsWith("welcome-");
    if (onlyWelcome && !isLoading) return;
    if (latestResultsRef.current) {
      latestResultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
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
    setKirkResultsView("grid");
    setKirkFiltersOpen(false);
    setKirkCompareIds([]);
    setKirkCompareOpen(false);
    useSessionStore.getState().setKirkShopPage(false);
    const catalog = useCatalogStore.getState();
    catalog.clearFilters();
    catalog.inspect(null);
    void catalog.search();
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  const applyActions = (actions: KirkAction[]) => {
    const addedIds: string[] = [];
    if (!actions?.length) return addedIds;
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
            addedIds.push(id);
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

    if (shouldOpen) openCart("warehouse");
    if (notices.length) {
      setCartNotice(notices[0]);
      window.setTimeout(() => setCartNotice(null), 3500);
    }
    return addedIds;
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

    const hits = kirkQueryPreview(products, trimmed);
    if (hits.length) {
      const storefrontQ = storefrontQueryForKirk(trimmed, hits);
      const catalog = useCatalogStore.getState();
      catalog.inspect(null);
      useSessionStore.getState().setKirkShopPage(true);
      setKirkFiltersOpen(true);
      useCatalogStore.setState({
        q: storefrontQ,
        department: null,
        tag: null,
        openList: null,
        openRecipe: null,
        listTone: "warehouse",
        warehouseFacets: EMPTY_WAREHOUSE_FACETS,
        warehouseSort: "relevance",
      });
      void catalog.search();
      document.querySelector("main")?.scrollTo({ top: 0 });
    }

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
      const addedIds = actions.length
        ? applyActions(actions)
        : Array.isArray(data.productIds) && data.productIds.length
          ? applyActions([
              {
                tool: "add_to_cart",
                productIds: data.productIds as string[],
                quantity: 1,
              },
            ])
          : [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
        imageUrl:
          typeof data.imageUrl === "string" ? data.imageUrl : null,
        productIds: addedIds,
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
          content: GROK_FALLBACK,
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

  useEffect(() => {
    useKirkAskStore.getState().registerAsk((text) => {
      void sendMessage(text);
    });
    useKirkAskStore.getState().registerSpeak(() => {
      if (isSpeaking) {
        stopSpeaking();
        return;
      }
      if (isRecording) stopRecording();
      else void startRecording();
    });
    useKirkAskStore.getState().setVoice({
      speaking: isSpeaking,
      recording: isRecording,
      transcribing: isTranscribing,
      loading: isLoading,
    });
    return () => {
      useKirkAskStore.getState().registerAsk(null);
      useKirkAskStore.getState().registerSpeak(null);
    };
  });

  const hasUserAsk = messages.some((m) => m.role === "user");
  const shopHasHits = messages.some(
    (message) =>
      message.role === "user" &&
      kirkQueryPreview(products, message.content).length > 0
  );
  const lastUserId = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.id;
  const kirkCompareItems = kirkCompareIds
    .map((id) => products.find((item) => item.id === id))
    .filter((item): item is (typeof products)[number] => Boolean(item));
  const idleHomepage = !hasUserAsk && !kirkShopPage;
  const browseHits = warehouseBrowsePreview(
    products,
    q,
    warehouseFacets.departments.length
  );
  const browseWarehouseDepartment = (label: string | null) => {
    const catalog = useCatalogStore.getState();
    catalog.inspect(null);
    useCatalogStore.setState({
      q: label
        ? ""
        : catalog.listTone === "warehouse" && catalog.q.trim()
          ? catalog.q
          : "kirkland",
      department: null,
      tag: null,
      openList: null,
      openRecipe: null,
      listTone: "warehouse",
      warehouseFacets: label
        ? { ...EMPTY_WAREHOUSE_FACETS, departments: [label] }
        : EMPTY_WAREHOUSE_FACETS,
      warehouseSort: "relevance",
    });
    useSessionStore.getState().setKirkShopPage(true);
    setKirkFiltersOpen(true);
    void catalog.search();
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  return (
    <>
    <aside
      className="fixed inset-y-0 right-0 z-40 flex h-full w-full min-w-0 flex-1 flex-col bg-white lg:static lg:z-30"
    >
      {cartNotice && (
        <div className="mx-4 mt-3 flex items-center gap-2 border border-[#c4c4c4] bg-[#f7fbfe] px-3 py-2 text-[12px] font-semibold text-costco-blue shrink-0">
          <ShoppingCart className="w-3.5 h-3.5" />
          {cartNotice}
        </div>
      )}

      <div
        className="relative min-h-0 flex-1 overflow-y-auto bg-white"
      >
        <div
          className={
            idleHomepage
              ? undefined
              : "mx-auto max-w-[1400px] space-y-5 px-4 py-4 lg:px-8"
          }
        >
        {messages.map((message) => {
          const isWelcome = message.id.startsWith("welcome-");
          if (isWelcome) {
            const asked = messages.some((m) => m.role === "user");
            if (asked || kirkShopPage) return null;
            const preview = applyWarehouseFacets(
              kirklandWarehousePreview(products, 24),
              warehouseFacets
            ).slice(0, 8);
            const offerPreview = hideWarehouseLeftovers(
              FLYER_DEAL_IDS.map((id) =>
                products.find((product) => product.id === id)
              ).filter((product): product is (typeof products)[number] =>
                Boolean(product)
              )
            ).slice(0, 8);
            const aisleTitle =
              warehouseFacets.departments.length === 1
                ? warehouseFacets.departments[0]
                : "Shop Kirkland Signature";
            const showAllAisle = () => {
              const label = warehouseFacets.departments[0] ?? null;
              if (label) {
                browseWarehouseDepartment(label);
                return;
              }
              const catalog = useCatalogStore.getState();
              catalog.inspect(null);
              useCatalogStore.setState({
                q: "kirkland",
                department: null,
                tag: null,
                openList: null,
                openRecipe: null,
                listTone: "warehouse",
                warehouseFacets: EMPTY_WAREHOUSE_FACETS,
                warehouseSort: "relevance",
              });
              useSessionStore.getState().setKirkShopPage(true);
              setKirkFiltersOpen(true);
              void catalog.search();
              document.querySelector("main")?.scrollTo({ top: 0 });
            };
            return (
              <div key={message.id}>
                <WarehouseHomepageHero
                  onKirkland={showAllAisle}
                  onOffers={showAllAisle}
                  onPick={browseWarehouseDepartment}
                  utilities={
                    <>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-[12px] font-bold text-costco-blue hover:underline"
                        title="Reset"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-[12px] font-bold text-costco-blue hover:underline"
                        title="Close"
                        aria-label="Close Ask Kirk"
                      >
                        Close
                      </button>
                    </>
                  }
                />
                <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-6 lg:px-8">
                  <WarehouseHomepageShortcuts
                    onOffers={showAllAisle}
                    onPick={browseWarehouseDepartment}
                  />
                  <WarehouseShopDepartments
                    selected={warehouseFacets.departments}
                    onPick={browseWarehouseDepartment}
                  />
                  {offerPreview.length > 0 ? (
                    <WarehouseAisleScroller
                      title="Limited-Time Offers"
                      products={offerPreview}
                      onShowAll={showAllAisle}
                    />
                  ) : null}
                  <WarehouseHomepageSpotlights
                    onPick={browseWarehouseDepartment}
                  />
                  {preview.length > 0 ? (
                    <WarehouseAisleScroller
                      title={aisleTitle}
                      products={preview}
                      onShowAll={showAllAisle}
                    />
                  ) : (
                    <p className="border border-[#c4c4c4] bg-white px-3 py-5 text-center text-[13px] text-[#555]">
                      No items match these filters.{" "}
                      <button
                        type="button"
                        className="font-bold text-costco-blue hover:underline"
                        onClick={() =>
                          setWarehouseFacets(EMPTY_WAREHOUSE_FACETS)
                        }
                      >
                        Shop All
                      </button>
                    </p>
                  )}
                </div>
                <WarehouseMembershipBanner onShop={showAllAisle} />
              </div>
            );
          }
          const added = (message.productIds || [])
            .map((id) => products.find((p) => p.id === id))
            .filter((p): p is (typeof products)[number] => Boolean(p));
          const unfilteredHits =
            message.role === "user"
              ? kirkQueryPreview(products, message.content)
              : [];
          return (
          <div key={message.id} className="space-y-2">
          {message.role === "user" ? (
            <div ref={latestResultsRef}>
              <WarehouseSearchResults
                query={message.content}
                unfilteredHits={unfilteredHits}
                resultKey={message.id}
                onReset={handleReset}
                onRelatedSearch={(term) => void sendMessage(term)}
                relatedEnabled={message.id === lastUserId}
                relatedLoading={isLoading}
                kirkFiltersOpen={kirkFiltersOpen}
                setKirkFiltersOpen={setKirkFiltersOpen}
                kirkResultsView={kirkResultsView}
                setKirkResultsView={setKirkResultsView}
                kirkCompareIds={kirkCompareIds}
                setKirkCompareIds={setKirkCompareIds}
              />
            </div>
          ) : kirkShopPage &&
            error &&
            message.content === GROK_FALLBACK &&
            !added.length &&
            !message.imageUrl ? null : (
            <KirklandHelpCard
              title="Kirkland Signature shopping help"
              variant="page"
            >
              <p className="whitespace-pre-line">{message.content}</p>
              {message.imageUrl && (
                <div className="mt-2.5 overflow-hidden border border-[#c4c4c4] bg-white">
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(message.imageUrl || null)}
                    className="group relative block w-full text-left"
                    title="Click to enlarge"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.imageUrl}
                      alt="Recipe inspiration"
                      className="h-auto max-h-[320px] w-full object-cover group-hover:opacity-95 transition-opacity"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
                      Enlarge
                    </span>
                  </button>
                  <p className="border-t border-[#eee] bg-[#fafafa] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#666]">
                    Recipe inspiration · tap to enlarge
                  </p>
                </div>
              )}
            </KirklandHelpCard>
          )}
          {added.length > 0 ? (
            <KirklandHelpCard
              title="Items Added to Cart"
              variant="page"
            >
              <div className="space-y-1.5">
                {added.map((product) => (
                  <ShopProductRow
                    key={`${message.id}-${product.id}`}
                    product={product}
                    tone="warehouse"
                  />
                ))}
              </div>
            </KirklandHelpCard>
          ) : null}
          </div>
          );
        })}
        {kirkShopPage && !hasUserAsk ? (
          <WarehouseSearchResults
            query={q.trim() || "kirkland"}
            unfilteredHits={browseHits}
            title={warehouseBrowseTitle(
              q,
              warehouseFacets.departments,
              browseHits
            )}
            breadcrumb={
              warehouseFacets.departments.length === 1
                ? warehouseFacets.departments[0]
                : "Search Results"
            }
            resultKey="browse"
            onReset={handleReset}
            onRelatedSearch={(term) => {
              useCatalogStore.setState({
                q: term,
                warehouseFacets: EMPTY_WAREHOUSE_FACETS,
                listTone: "warehouse",
              });
            }}
            kirkFiltersOpen={kirkFiltersOpen}
            setKirkFiltersOpen={setKirkFiltersOpen}
            kirkResultsView={kirkResultsView}
            setKirkResultsView={setKirkResultsView}
            kirkCompareIds={kirkCompareIds}
            setKirkCompareIds={setKirkCompareIds}
          />
        ) : null}
        {isLoading && (
          <KirklandHelpCard
            title="Kirkland Signature shopping help"
            variant="page"
          >
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#999]" />
              <div
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#999]"
                style={{ animationDelay: "0.12s" }}
              />
              <div
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#999]"
                style={{ animationDelay: "0.24s" }}
              />
            </div>
            {pendingInspire && (
              <div className="mt-2.5 flex items-center gap-2 border border-costco-blue/20 bg-[#eef5fb] px-2.5 py-2">
                <div className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden bg-costco-blue/10">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-costco-blue" />
                  <span className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-costco-blue">
                    Generating image…
                  </p>
                  <p className="truncate text-[10px] text-[#666]">
                    Recipe inspiration
                  </p>
                </div>
              </div>
            )}
          </KirklandHelpCard>
        )}
        {error && (
          <section
            className={
              shopHasHits
                ? "overflow-hidden border border-[#c4c4c4] bg-white"
                : "border border-[#c4c4c4] bg-white px-6 py-10 text-center"
            }
          >
            {shopHasHits ? (
              <>
                <p className="border-b border-[#c4c4c4] bg-[#f6f7f8] px-4 py-2.5 text-[15px] font-bold text-[#1a1a1a]">
                  We&apos;re sorry
                </p>
                <div className="px-4 py-3">
                  <div className="mb-2">
                    <CostcoLogo compact />
                  </div>
                  <p className="text-[13px] text-[#1a1a1a]">{error}</p>
                  {messages.some(
                    (message) =>
                      message.role === "assistant" &&
                      message.content === GROK_FALLBACK
                  ) ? (
                    <p className="mt-1 text-[13px] text-[#1a1a1a]">
                      {GROK_FALLBACK}
                    </p>
                  ) : null}
                </div>
              </>
            ) : (
            <div>
              <div className="flex justify-center">
                <CostcoLogo compact />
              </div>
              <p className="mt-4 text-[28px] font-bold text-[#1a1a1a]">
                We&apos;re sorry
              </p>
              <p className="mt-1 text-[13px] text-[#1a1a1a]">{error}</p>
              {messages.some(
                (message) =>
                  message.role === "assistant" &&
                  message.content === GROK_FALLBACK
              ) ? (
                <p className="mt-1 text-[13px] text-[#1a1a1a]">{GROK_FALLBACK}</p>
              ) : null}
            </div>
            )}
          </section>
        )}
        <div ref={messagesEndRef} />
        {kirkShopPage ? null : (
          <div
            className={
              hasUserAsk
                ? "border-t border-[#ececec] bg-white px-1 pb-2 pt-5"
                : "border-t border-[#d8d8d8] bg-[#f6f7f8] px-4 py-10 lg:px-8"
            }
          >
            <div className={hasUserAsk ? undefined : "mx-auto max-w-[1400px]"}>
            {!hasUserAsk ? (
              <>
                <p className="text-[20px] font-bold text-[#1a1a1a]">
                  Kirkland Signature shopping help
                </p>
                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-relaxed text-[#1a1a1a]">
                  {messages.find((entry) => entry.id.startsWith("welcome-"))
                    ?.content}
                </p>
              </>
            ) : null}
            <div className={`flex h-11 items-stretch ${hasUserAsk ? "" : "mt-5"}`}>
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#8a8a8a]"
                  aria-hidden="true"
                />
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
                  className="h-11 w-full rounded-l-[3px] border border-r-0 border-[#c4c4c4] bg-white pl-10 pr-10 text-[14px] text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
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
                  className={`absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[3px] ${
                    isRecording || isSpeaking
                      ? "bg-costco-red text-white kirk-listening"
                      : "text-[#555] hover:bg-[#f6f6f6]"
                  }`}
                  title={
                    isSpeaking
                      ? "Stop speaking"
                      : isRecording
                        ? "Stop"
                        : "Speak — stops when you pause; I'll read the reply aloud"
                  }
                  aria-label={
                    isSpeaking ? "Stop speaking" : isRecording ? "Stop" : "Speak"
                  }
                >
                  {isRecording || isSpeaking ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="h-11 shrink-0 rounded-r-[3px] bg-costco-red px-4 text-[14px] font-bold text-white hover:bg-costco-red-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>
            </div>
            {!hasUserAsk ? (
              <>
                <p className="mt-3 text-[15px] font-bold text-[#1a1a1a]">
                  Popular Searches
                </p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => void sendMessage(chip)}
                      disabled={isLoading}
                      className="text-left text-[12px] font-bold leading-tight text-costco-blue hover:underline disabled:opacity-50"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
            <p className="mt-2 text-center text-[10px] leading-snug text-[#888]">
              Kirkland Signature shopping help · Membership required · Prices
              higher than warehouse
            </p>
            </div>
          </div>
        )}
        </div>
        <WarehouseFooter
          className={kirkShopPage || hasUserAsk ? "mt-8" : ""}
        />
      </div>

      {(isRecording || isTranscribing || isSpeaking) && !kirkShopPage && (
        <div className="px-3.5 py-1.5 border-t border-[#eee] bg-[#fff8f8] text-[12px] text-[#333] flex items-center gap-2 shrink-0">
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
            <span className="font-semibold text-[#555]">Transcribing your request…</span>
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

      {kirkCompareItems.length > 0 ? (
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-[#c4c4c4] bg-[#f6f7f8] px-4 py-2.5">
          <span className="text-[13px] font-bold text-[#1a1a1a]">
            Compare Products ({kirkCompareItems.length} of 4)
          </span>
          {kirkCompareItems.map((product) => (
            <button
              key={`compare-bar-${product.id}`}
              type="button"
              onClick={() =>
                useCatalogStore.getState().inspect(product, "warehouse")
              }
              className="flex items-center gap-1.5 rounded-[3px] border border-[#c4c4c4] bg-white px-1.5 py-1"
              aria-label={`View ${product.brand} ${product.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={warehousePackSrc(product)}
                alt=""
                className="h-10 w-10 object-contain"
              />
              <span className="hidden max-w-[88px] truncate text-[11px] font-semibold text-[#1a1a1a] sm:inline">
                {product.name}
              </span>
            </button>
          ))}
          <button
            type="button"
            disabled={kirkCompareItems.length < 2}
            onClick={() => setKirkCompareOpen(true)}
            className="rounded-[3px] bg-costco-blue px-3 py-1.5 text-[12px] font-bold text-white hover:bg-costco-blue-hover disabled:cursor-not-allowed disabled:bg-[#c4c4c4] disabled:text-[#666]"
          >
            Compare
          </button>
          <button
            type="button"
            onClick={() => {
              setKirkCompareIds([]);
              setKirkCompareOpen(false);
            }}
            className="text-[12px] font-bold text-costco-blue hover:underline"
          >
            Clear All
          </button>
        </div>
      ) : null}
    </aside>
    {kirkCompareOpen
      ? createPortal(
          <WarehouseCompareSheet
            items={kirkCompareItems}
            onClose={() => setKirkCompareOpen(false)}
            onRemove={(id) =>
              setKirkCompareIds((ids) => ids.filter((itemId) => itemId !== id))
            }
          />,
          document.body
        )
      : null}
    {lightboxUrl && (
      <div
        className={`fixed z-[80] flex items-center justify-center bg-black/70 p-4 ${overlayClass}`}
        onClick={() => setLightboxUrl(null)}
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged recipe image"
      >
        <button
          type="button"
          className="absolute top-4 right-4 bg-white text-[#1a1a1a] px-3 py-1.5 text-sm font-bold shadow"
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

