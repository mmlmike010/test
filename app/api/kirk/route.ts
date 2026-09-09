import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";
import { appendTranscript } from "@/lib/transcripts";
import { generateInspirationImage } from "@/lib/inspire";
import { wantsInspiration } from "@/lib/inspireAsk";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

type CartLine = {
  id: string;
  brand?: string;
  name?: string;
  price?: number;
  quantity: number;
};

export type KirkAction =
  | { tool: "view_cart" }
  | { tool: "open_cart" }
  | { tool: "add_to_cart"; productIds: string[]; quantity?: number }
  | { tool: "remove_from_cart"; productIds: string[] }
  | { tool: "clear_cart" }
  | {
      tool: "generate_inspiration_image";
      productIds?: string[];
      prompt?: string;
    };

function buildSystemPrompt(cart: CartLine[]) {
  const catalog = products
    .map(
      (p) =>
        `- id=${p.id} | ${p.brand} ${p.name} | $${p.price.toFixed(2)} (was $${p.originalPrice.toFixed(2)}, save $${p.savings.toFixed(2)}) | ${p.department} / ${p.category}`
    )
    .join("\n");

  const cartBlock =
    cart.length === 0
      ? "(empty)"
      : cart
          .map(
            (c) =>
              `- id=${c.id} | ${c.brand || ""} ${c.name || ""} | qty ${c.quantity} | $${Number(c.price || 0).toFixed(2)}`
          )
          .join("\n");

  return `You are Kirk, Costco Same-Day's shopping assistant (Instacart-powered storefront demo).
Be warm, concise, and practical — short beats over essays. Help members build carts: Kirkland swaps, treasure hunt, party platters, allergy-aware shopping, weather stocking, member savings, viral trends, recipes.

You act through TOOLS in "actions". The storefront executes them (cart drawer, Imagine image, etc.). Do not pretend you changed the cart or generated an image without emitting the matching tool.

CURRENT CART:
${cartBlock}

CATALOG (only recommend / add these; use exact ids):
${catalog}

RESPONSE FORMAT — reply with ONLY valid JSON (no markdown fences):
{
  "reply": "Member-facing message. Use short paragraphs and bullet lines like • Brand Name — $X.XX when listing items.",
  "actions": [
    {"tool": "view_cart"},
    {"tool": "open_cart"},
    {"tool": "add_to_cart", "productIds": ["id"], "quantity": 1},
    {"tool": "remove_from_cart", "productIds": ["id"]},
    {"tool": "clear_cart"},
    {"tool": "generate_inspiration_image", "productIds": ["id"], "prompt": "short food-photo brief"}
  ],
  "productIds": []
}

TOOL RULES:
- view_cart: when they ask what's in the cart / review cart. Summarize CURRENT CART in reply AND include view_cart.
- open_cart: open the cart drawer (optional with add/remove).
- add_to_cart: when they ask to add items or you are building a cart. productIds must be catalog ids. quantity defaults to 1.
- remove_from_cart: when they ask to drop items.
- clear_cart: only when they explicitly want the cart emptied.
- generate_inspiration_image: for recipe / meal / dinner / plating / cooking inspiration (including typos like "reccipe" and "what kind of recipe can I make with X"). Pass hero ingredient productIds and an optional short prompt. When you call it, keep reply VERY short: 1–2 sentences naming the dish idea, then at most 3–4 product bullets (Brand Name — $X.XX). No long how-to — the image carries the vibe. Do NOT also call add_to_cart unless they explicitly ask to add/build the cart.
- Prefer member savings and Kirkland when relevant.
- Never invent products outside the catalog.
- productIds (legacy) = ids you are adding this turn; prefer actions.
- Otherwise keep reply under ~90 words unless they ask for more. Prefer bullets over paragraphs.`;
}

function normalizeActions(
  raw: unknown,
  legacyProductIds: string[]
): KirkAction[] {
  const valid = new Set(products.map((p) => p.id));
  const out: KirkAction[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const tool = String((item as { tool?: string }).tool || "");
      if (tool === "view_cart" || tool === "open_cart" || tool === "clear_cart") {
        out.push({ tool });
        continue;
      }
      if (tool === "generate_inspiration_image") {
        const ids = Array.isArray((item as { productIds?: unknown }).productIds)
          ? (item as { productIds: unknown[] }).productIds
              .map(String)
              .filter((id) => valid.has(id))
          : [];
        const prompt = String(
          (item as { prompt?: unknown }).prompt || ""
        ).trim();
        out.push({
          tool: "generate_inspiration_image",
          productIds: ids,
          prompt: prompt || undefined,
        });
        continue;
      }
      if (tool === "add_to_cart") {
        const ids = Array.isArray((item as { productIds?: unknown }).productIds)
          ? (item as { productIds: unknown[] }).productIds
              .map(String)
              .filter((id) => valid.has(id))
          : [];
        if (!ids.length) continue;
        const quantity = Number((item as { quantity?: unknown }).quantity);
        out.push({
          tool: "add_to_cart",
          productIds: ids,
          quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        });
        continue;
      }
      if (tool === "remove_from_cart") {
        const ids = Array.isArray((item as { productIds?: unknown }).productIds)
          ? (item as { productIds: unknown[] }).productIds
              .map(String)
              .filter((id) => valid.has(id))
          : [];
        if (!ids.length) continue;
        out.push({ tool: "remove_from_cart", productIds: ids });
      }
    }
  }

  const hasAdd = out.some((a) => a.tool === "add_to_cart");
  if (!hasAdd && legacyProductIds.length) {
    out.unshift({
      tool: "add_to_cart",
      productIds: legacyProductIds,
      quantity: 1,
    });
  }

  if (
    out.some((a) => a.tool === "view_cart") &&
    !out.some((a) => a.tool === "open_cart")
  ) {
    out.push({ tool: "open_cart" });
  }

  return out;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "XAI_API_KEY is not set" },
      { status: 500 }
    );
  }

  let body: {
    messages?: ChatMessage[];
    sessionId?: string;
    zip?: string;
    voice?: boolean;
    cart?: CartLine[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const history = (body.messages || [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content }));

  if (!history.length) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json(
      { error: "user message required" },
      { status: 400 }
    );
  }

  const sessionId =
    (body.sessionId || "").trim() || `anon-${Date.now().toString(36)}`;

  const cart = Array.isArray(body.cart) ? body.cart : [];

  const payload = {
    model: "grok-4.6",
    reasoning_effort: "low",
    temperature: 0.6,
    messages: [
      { role: "system", content: buildSystemPrompt(cart) },
      ...history,
    ],
  };

  const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const rawText = await xaiRes.text();
  if (!xaiRes.ok) {
    return NextResponse.json(
      {
        error: "xAI request failed",
        status: xaiRes.status,
        detail: rawText.slice(0, 800),
      },
      { status: 502 }
    );
  }

  let completion: {
    choices?: { message?: { content?: string } }[];
  };
  try {
    completion = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Bad xAI JSON", detail: rawText.slice(0, 400) },
      { status: 502 }
    );
  }

  const content = completion.choices?.[0]?.message?.content?.trim() || "";
  let reply = content;
  let productIds: string[] = [];
  let actionsRaw: unknown = [];
  let legacyInspire = false;
  let legacyInspirePrompt = "";

  try {
    const cleaned = content
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");
    const parsed = JSON.parse(cleaned) as {
      reply?: string;
      productIds?: string[];
      inspire?: boolean;
      inspirePrompt?: string;
      actions?: unknown;
    };
    if (parsed.reply) reply = parsed.reply;
    if (Array.isArray(parsed.productIds)) {
      const valid = new Set(products.map((p) => p.id));
      productIds = parsed.productIds
        .filter((id) => valid.has(String(id)))
        .map(String);
    }
    // legacy fields still accepted for one release
    legacyInspire = Boolean(parsed.inspire);
    legacyInspirePrompt = (parsed.inspirePrompt || "").trim();
    actionsRaw = parsed.actions || [];
  } catch {
    for (const p of products) {
      const label = `${p.brand} ${p.name}`;
      if (content.toLowerCase().includes(label.toLowerCase())) {
        productIds.push(p.id);
      }
    }
    const lower = lastUser.content.toLowerCase();
    if (/view (my )?cart|what.?s in (my )?cart|show (my )?cart/.test(lower)) {
      actionsRaw = [{ tool: "view_cart" }];
    }
  }

  let actions = normalizeActions(actionsRaw, productIds);

  // Force generate_inspiration_image tool when recipe-style ask was missed
  const hasImageTool = actions.some(
    (a) => a.tool === "generate_inspiration_image"
  );
  if (!hasImageTool && (legacyInspire || wantsInspiration(lastUser.content))) {
    actions = [
      ...actions,
      {
        tool: "generate_inspiration_image",
        productIds: productIds.slice(0, 4),
        prompt: legacyInspirePrompt || undefined,
      },
    ];
  }

  const addedIds = actions
    .filter(
      (a): a is Extract<KirkAction, { tool: "add_to_cart" }> =>
        a.tool === "add_to_cart"
    )
    .flatMap((a) => a.productIds);
  if (addedIds.length) productIds = Array.from(new Set(addedIds));

  const imageAction = actions.find(
    (
      a
    ): a is Extract<KirkAction, { tool: "generate_inspiration_image" }> =>
      a.tool === "generate_inspiration_image"
  );

  let imageUrl: string | null = null;
  if (imageAction) {
    const heroIds =
      imageAction.productIds && imageAction.productIds.length
        ? imageAction.productIds
        : productIds;
    try {
      const img = await Promise.race([
        generateInspirationImage({
          apiKey,
          productIds: heroIds,
          inspirePrompt: imageAction.prompt,
          userText: lastUser.content,
        }),
        new Promise<null>((resolve) =>
          setTimeout(() => {
            console.warn("inspire timed out — returning reply without image");
            resolve(null);
          }, 20000)
        ),
      ]);
      imageUrl = img?.url || null;
    } catch (err) {
      console.error("inspire image failed", err);
    }
  }

  // Client only needs cart tools in actions (image is server-executed)
  const clientActions = actions.filter(
    (a) => a.tool !== "generate_inspiration_image"
  );

  try {
    await appendTranscript({
      session_id: sessionId,
      ts: new Date().toISOString(),
      zip: body.zip || "11217",
      channel: "ask_kirk",
      user: lastUser.content,
      assistant: reply,
      product_ids: productIds,
      model: "grok-4.6",
      reasoning_effort: "low",
      source: "localhost",
    });
  } catch (err) {
    console.error("transcript append failed", err);
  }

  return NextResponse.json({
    reply,
    productIds,
    actions: clientActions,
    toolsCalled: actions.map((a) => a.tool),
    model: "grok-4.6",
    reasoning_effort: "low",
    sessionId,
    logged: true,
    inspire: Boolean(imageAction),
    imageUrl,
    imageModel: imageUrl ? "grok-imagine-image-2.0" : null,
  });
}
