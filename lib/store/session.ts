"use client";

import { create } from "zustand";

export type StoreSheet =
  | "pricing"
  | "membership"
  | "signin"
  | "delivery"
  | "departments"
  | "request"
  | "checkout"
  | null;

/** UI chrome only — never sent to Kirk. Header always sameday. */
export type SheetTone = "sameday" | "warehouse";

export type DeliveryWindow = {
  id: string;
  label: string;
  when: string;
};

export type DeliveryAddress = {
  line1: string;
  city: string;
  zip: string;
};

export const DELIVERY_WINDOWS: DeliveryWindow[] = [
  { id: "tonight-early", label: "8:48–9:18pm", when: "Today" },
  { id: "tonight-late", label: "9:30–10:00pm", when: "Today" },
  { id: "tomorrow-am", label: "8:00–8:30am", when: "Tomorrow" },
];

export const DEFAULT_ADDRESS: DeliveryAddress = {
  line1: "184 6th Ave",
  city: "Brooklyn",
  zip: "11217",
};

export const KIRK_MEMBERSHIP = "111 847 11217";
export const KIRK_NAME = "Kirk";
export const KIRK_EMAIL = "kirk@member.local";

const KEY = "costco-sameday-session";

type Persisted = {
  signedIn: boolean;
  displayName: string;
  email: string;
  membershipAdded: boolean;
  membershipNumber: string;
  windowId: string;
  address: DeliveryAddress;
  specialRequest: string;
};

const fallback: Persisted = {
  signedIn: false,
  displayName: "",
  email: "",
  membershipAdded: false,
  membershipNumber: "",
  windowId: DELIVERY_WINDOWS[0].id,
  address: DEFAULT_ADDRESS,
  specialRequest: "",
};

function readSession(): Persisted {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    const windowOk = DELIVERY_WINDOWS.some((w) => w.id === parsed.windowId);
    return {
      ...fallback,
      ...parsed,
      windowId: windowOk ? parsed.windowId! : fallback.windowId,
      address: {
        ...DEFAULT_ADDRESS,
        ...(parsed.address || {}),
      },
    };
  } catch {
    return fallback;
  }
}

function writeSession(state: Persisted) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

type SessionState = Persisted & {
  sheet: StoreSheet;
  priorSheet: StoreSheet;
  sheetTone: SheetTone;
  orderPlaced: boolean;
  kirkOpen: boolean;
  setKirkOpen: (open: boolean) => void;
  kirkShopPage: boolean;
  setKirkShopPage: (open: boolean) => void;
  setSheet: (sheet: StoreSheet, tone?: SheetTone) => void;
  closeSheet: () => void;
  signIn: (displayName: string, email: string) => void;
  signOut: () => void;
  addMembership: (number: string) => void;
  removeMembership: () => void;
  setDelivery: (windowId: string, address: DeliveryAddress) => void;
  setSpecialRequest: (note: string) => void;
  placeOrder: () => void;
  clearOrder: () => void;
};

function persistable(state: SessionState): Persisted {
  return {
    signedIn: state.signedIn,
    displayName: state.displayName,
    email: state.email,
    membershipAdded: state.membershipAdded,
    membershipNumber: state.membershipNumber,
    windowId: state.windowId,
    address: state.address,
    specialRequest: state.specialRequest,
  };
}

export const useSessionStore = create<SessionState>((set, get) => ({
  ...fallback,
  sheet: null,
  priorSheet: null,
  sheetTone: "sameday",
  orderPlaced: false,
  kirkOpen: true,
  setKirkOpen: (kirkOpen) => set({ kirkOpen }),
  kirkShopPage: false,
  setKirkShopPage: (kirkShopPage) => set({ kirkShopPage }),
  setSheet: (sheet, tone = "sameday") => {
    if (sheet === null) {
      set({ sheet: null, priorSheet: null, sheetTone: "sameday" });
      return;
    }
    const current = get().sheet;
    set({
      priorSheet: current === "checkout" ? "checkout" : get().priorSheet,
      sheet,
      sheetTone: tone,
    });
  },
  closeSheet: () => {
    set({
      sheet: get().priorSheet,
      priorSheet: null,
      sheetTone: "sameday",
    });
  },
  signIn: (displayName, email) => {
    const next = {
      ...get(),
      signedIn: true,
      displayName: displayName.trim() || KIRK_NAME,
      email: email.trim() || KIRK_EMAIL,
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  signOut: () => {
    const next = {
      ...get(),
      signedIn: false,
      displayName: "",
      email: "",
      orderPlaced: false,
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  addMembership: (number) => {
    const cleaned = number.replace(/\s+/g, " ").trim();
    const next = {
      ...get(),
      membershipAdded: true,
      membershipNumber: cleaned || KIRK_MEMBERSHIP,
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  removeMembership: () => {
    const next = {
      ...get(),
      membershipAdded: false,
      membershipNumber: "",
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  setDelivery: (windowId, address) => {
    const next = {
      ...get(),
      windowId,
      address: {
        line1: address.line1.trim() || DEFAULT_ADDRESS.line1,
        city: address.city.trim() || DEFAULT_ADDRESS.city,
        zip: address.zip.trim() || DEFAULT_ADDRESS.zip,
      },
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  setSpecialRequest: (note) => {
    const next = {
      ...get(),
      specialRequest: note.trim(),
      sheet: get().priorSheet,
      priorSheet: null as StoreSheet,
      sheetTone: "sameday" as SheetTone,
    };
    writeSession(persistable(next));
    set(next);
  },
  placeOrder: () => set({ orderPlaced: true }),
  clearOrder: () => set({ orderPlaced: false }),
}));

export function hydrateSession() {
  useSessionStore.setState({
    ...readSession(),
    sheet: null,
    priorSheet: null,
    sheetTone: "sameday",
    orderPlaced: false,
    kirkShopPage: false,
  });
}

export function deliveryWindow(windowId: string): DeliveryWindow {
  return DELIVERY_WINDOWS.find((w) => w.id === windowId) || DELIVERY_WINDOWS[0];
}

export function formatAddress(address: DeliveryAddress): string {
  return `${address.zip} ${address.city}`;
}

/** Sit below lockup + search + Shop/Flyers/Lists/Meals so titles are not under the sticky header. */
export const HEADER_LOCKUP_OFFSET = "top-[156px]";

/** Leave the Ask Kirk rail uncovered unless Kirk is the Costco shop page. */
export function kirkDrawerOffset(open: boolean, shopPage = false) {
  if (!open || shopPage) return "";
  return "lg:right-[380px] xl:right-[420px]";
}

/** Storefront overlay: below the header, beside the idle rail or full-width on shop page. */
export function storefrontOverlayClass(open: boolean, shopPage = false) {
  return `inset-x-0 bottom-0 ${HEADER_LOCKUP_OFFSET} ${kirkDrawerOffset(open, shopPage)}`;
}

export function useStorefrontOverlayClass(open: boolean) {
  const shopPage = useSessionStore((s) => s.kirkShopPage);
  return storefrontOverlayClass(open, shopPage);
}
