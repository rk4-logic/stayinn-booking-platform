import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PropertyType } from "@/types/property.types";
import { Currency } from "@/types/common.types";

export interface SearchFilters {
  city: string;
  country: string;
  propertyType: PropertyType | "";
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  infants: number;
  minPrice: number | null;
  maxPrice: number | null;
  currency: Currency;
}

interface SearchStore {
  filters: SearchFilters;
  setFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: SearchFilters = Object.freeze({
  city: "",
  country: "",
  propertyType: "" as const,
  checkIn: null,
  checkOut: null,
  adults: 1,
  children: 0,
  infants: 0,
  minPrice: null,
  maxPrice: null,
  currency: Currency.USD,
});

export const useSearchStore = create<SearchStore>()(
  devtools(
    persist(
      (set) => ({
        filters: { ...DEFAULT_FILTERS },

        setFilter: (key, value) =>
          set(
            (state) => ({
              filters: { ...state.filters, [key]: value },
            }),
            false,
            "search/setFilter"
          ),

        setFilters: (filters) =>
          set(
            (state) => ({
              filters: { ...state.filters, ...filters },
            }),
            false,
            "search/setFilters"
          ),

        resetFilters: () =>
          set(
            { filters: { ...DEFAULT_FILTERS } },
            false,
            "search/resetFilters"
          ),
      }),
      {
        name: "stayinn-search-filters",
        partialize: (state) => ({
          filters: {
            ...state.filters,
            checkIn: null,
            checkOut: null,
          },
        }),
      }
    ),
    { name: "SearchStore" }
  )
);