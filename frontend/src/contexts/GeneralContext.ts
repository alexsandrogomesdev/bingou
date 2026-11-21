import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GeneralContext {
  // PERSISTENT
  userId: number | null;
  setUserId: (value: number) => void;
  plan: number;
  setPlan: (value: number) => void;
  dueAt: number;
  setDueAt: (value: number) => void;
  showAds: boolean;
  setShowAds: (value: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;

  logOut: () => void;
}

export const useGeneralContext = create(
  persist(
    (set) => ({
      // PERSISTENT
      userId: null,
      setUserId: (value: number) => set({ userId: value }),
      plan: 0,
      setPlan: (value: number) => set({ plan: value }),
      dueAt: 0,
      setDueAt: (value: number) => set({ dueAt: value }),
      showAds: false,
      setShowAds: (value: boolean) => set({ showAds: value }),
      menuOpen: false,
      setMenuOpen: (value: boolean) => set({ menuOpen: value }),

      logOut: () => set({ userId: null, showAds: false }),
    }),
    {
      name: "@app:bingou-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state: GeneralContext) => ({
        userId: state.userId,
        plan: state.plan,
        dueAt: state.dueAt,
        showAds: state.showAds,

        menuOpen: state.menuOpen,
      }),
    },
  ),
);
