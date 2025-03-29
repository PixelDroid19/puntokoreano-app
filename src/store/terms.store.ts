// src/store/terms.store.ts
import { create } from "zustand";

interface TermsState {
  isOpen: boolean;
  hasAccepted: boolean;
  openTerms: () => void;
  closeTerms: () => void;
  acceptTerms: () => void;
  checkInitialAcceptanceAndOpen: () => void;
}

export const useTermsStore = create<TermsState>((set) => ({
  isOpen: false,
  hasAccepted: false,
  openTerms: () => set({ isOpen: true }),
  closeTerms: () => set({ isOpen: false }),
  acceptTerms: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("termsAccepted", "true");
    }
    set({ hasAccepted: true, isOpen: false });
  },

  checkInitialAcceptanceAndOpen: () => {
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("termsAccepted");
      if (accepted === "true") {
        set({ hasAccepted: true, isOpen: false });
      } else {
        set({ hasAccepted: false, isOpen: true });
      }
    } else {
      set({ hasAccepted: false, isOpen: false });
    }
  },
}));
