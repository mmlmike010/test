"use client";

import { create } from "zustand";
import { DEFAULT_FURNITURE_ID } from "@/lib/placeInRoom";

type PlaceInRoomState = {
  lastProductId: string;
  pendingRoomImage: string | null;
  setLastProduct: (id: string) => void;
  setPendingRoomImage: (url: string | null) => void;
};

export const usePlaceInRoomStore = create<PlaceInRoomState>((set) => ({
  lastProductId: DEFAULT_FURNITURE_ID,
  pendingRoomImage: null,
  setLastProduct: (id) => set({ lastProductId: id }),
  setPendingRoomImage: (url) => set({ pendingRoomImage: url }),
}));
