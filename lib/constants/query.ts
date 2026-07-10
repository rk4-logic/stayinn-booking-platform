export const QUERY_STALE_TIME = {
  SHORT: 30_000,       // 30 seconds — availability, prices
  MEDIUM: 2 * 60_000,  // 2 minutes — property lists
  LONG: 5 * 60_000,    // 5 minutes — property details
} as const;

export const ONE_MINUTE = 60_000 as const;