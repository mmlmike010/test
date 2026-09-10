"use client";

import { create } from "zustand";
import {
  DEFAULT_FURNITURE_ID,
  type SceneId,
} from "@/lib/placeInRoom";

type PlaceInRoomState = {
  lastProductId: string;
  pdpOpen: boolean;
  pdpProductId: string | null;
  preferredScene: SceneId | null;
  uploadRequested: boolean;
  setLastProduct: (id: string) => void;
  openPdp: (productId: string, opts?: { scene?: SceneId; upload?: boolean }) => void;
  closePdp: () => void;
  clearUploadRequest: () => void;
};

export const usePlaceInRoomStore = create<PlaceInRoomState>((set) => ({
  lastProductId: DEFAULT_FURNITURE_ID,
  pdpOpen: false,
  pdpProductId: null,
  preferredScene: null,
  uploadRequested: false,
  setLastProduct: (id) => set({ lastProductId: id }),
  openPdp: (productId, opts) =>
    set({
      lastProductId: productId,
      pdpOpen: true,
      pdpProductId: productId,
      preferredScene: opts?.scene ?? null,
      uploadRequested: Boolean(opts?.upload),
    }),
  closePdp: () =>
    set({
      pdpOpen: false,
      pdpProductId: null,
      preferredScene: null,
      uploadRequested: false,
    }),
  clearUploadRequest: () => set({ uploadRequested: false }),
}));
