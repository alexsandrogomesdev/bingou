import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ContextState {
  // RANDOMIZER
  drawnBalls: number[];
  remainingBalls: number[];
  lastBall: number;
  setDrawnBalls: (value: number[]) => void;
  setRemainingBalls: (value: number[]) => void;
  setLastBall: (value: number) => void;
  clearRandomizer: () => void;
}

export const useRandomizerContext = create(
  persist(
    (set) => ({
      drawnBalls: [],
      remainingBalls: Array.from({ length: 75 }, (_, i) => i + 1).sort(),
      lastBall: 0,

      setDrawnBalls: (value: number[]) =>
        set({
          drawnBalls: value,
        }),
      setRemainingBalls: (value: number[]) =>
        set({
          remainingBalls: value,
        }),
      setLastBall: (value: number) =>
        set({
          lastBall: value,
        }),

      clearRandomizer: () =>
        set({ drawnBalls: [], remainingBalls: Array.from({ length: 75 }, (_, i) => i + 1).sort(), lastBall: 0 }),
    }),
    {
      name: "@app-randomizer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: ContextState) => ({
        drawnBalls: state.drawnBalls,
        remainingBalls: state.remainingBalls,
        lastBall: state.lastBall,
      }),
    },
  ),
);
