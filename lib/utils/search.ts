import { SearchFilters } from "@/store/search.store";

export function buildSearchParams(filters: Partial<SearchFilters>): string {
  const params = new URLSearchParams();

  if (filters.city) params.set("city", filters.city);
  if (filters.country) params.set("country", filters.country);
  if (filters.propertyType) params.set("propertyType", filters.propertyType);
  if (filters.checkIn) params.set("checkIn", filters.checkIn.toISOString());
  if (filters.checkOut) params.set("checkOut", filters.checkOut.toISOString());
  if (filters.adults && filters.adults !== 1)
    params.set("adults", String(filters.adults));
  if (filters.children && filters.children > 0)
    params.set("children", String(filters.children));
  if (filters.infants && filters.infants > 0)
    params.set("infants", String(filters.infants));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));

  return params.toString();
}