import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;

  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setIsSearchModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchModalOpen: false,

      setIsMobileMenuOpen: (open) =>
        set({ isMobileMenuOpen: open }, false, "ui/setIsMobileMenuOpen"),

      toggleMobileMenu: () =>
        set(
          (state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
          false,
          "ui/toggleMobileMenu"
        ),

      setIsSearchModalOpen: (open) =>
        set(
          { isSearchModalOpen: open },
          false,
          "ui/setIsSearchModalOpen"
        ),
    }),
    { name: "UIStore" }
  )
);