import { create } from "zustand";

/** UI bridge so the Costco header Search can ask Kirk. Not sent to the model. */
type KirkAskState = {
  ask: ((text: string) => void) | null;
  speak: (() => void) | null;
  speaking: boolean;
  recording: boolean;
  transcribing: boolean;
  loading: boolean;
  registerAsk: (fn: ((text: string) => void) | null) => void;
  registerSpeak: (fn: (() => void) | null) => void;
  setVoice: (next: {
    speaking: boolean;
    recording: boolean;
    transcribing: boolean;
    loading: boolean;
  }) => void;
};

export const useKirkAskStore = create<KirkAskState>((set) => ({
  ask: null,
  speak: null,
  speaking: false,
  recording: false,
  transcribing: false,
  loading: false,
  registerAsk: (ask) => set({ ask }),
  registerSpeak: (speak) => set({ speak }),
  setVoice: (next) => set(next),
}));
