"use client";

import { create } from "zustand";
import { DEFAULT_FURNITURE_ID } from "@/lib/placeInRoom";

type PlaceInRoomState = {
  lastProductId: string;
  setLastProduct: (id: string) => void;
};

export const usePlaceInRoomStore = create<PlaceInRoomState>((set) => ({
  lastProductId: DEFAULT_FURNITURE_ID,
  setLastProduct: (id) => set({ lastProductId: id }),
}));
