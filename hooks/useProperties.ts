import { useQuery } from "@tanstack/react-query";
import {
  getPropertiesAction,
  getPropertyBySlugAction,
  getOwnerPropertiesAction,
  searchPropertiesAction,
} from "@/actions/property.actions";
import type { UsePropertiesOptions } from "@/types/property.types";
import { ONE_MINUTE, QUERY_STALE_TIME } from "@/lib/constants/query";


export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...propertyKeys.lists(), filters] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (slug: string) => [...propertyKeys.details(), slug] as const,
  owner: () => [...propertyKeys.all, "owner"] as const,
  search: (query: string) => [...propertyKeys.all, "search", query] as const,
};

export function useProperties(options: UsePropertiesOptions = {}) {
  return useQuery({
    queryKey: propertyKeys.list(options),
    queryFn: () => getPropertiesAction(options),
    staleTime: QUERY_STALE_TIME.MEDIUM
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: propertyKeys.detail(slug),
    queryFn: () => getPropertyBySlugAction(slug),
    enabled: !!slug,
    staleTime: QUERY_STALE_TIME.LONG
  });
}

export function useOwnerProperties() {
  return useQuery({
    queryKey: propertyKeys.owner(),
    queryFn: () => getOwnerPropertiesAction(),
    staleTime: ONE_MINUTE
  });
}

export function usePropertySearch(query: string) {
  return useQuery({
    queryKey: propertyKeys.search(query),
    queryFn: () => searchPropertiesAction(query),
    enabled: query.length >= 2, 
    staleTime: QUERY_STALE_TIME.SHORT 
  });
}