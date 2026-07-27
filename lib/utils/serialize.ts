/**
 * Safely converts Mongoose Lean documents / ObjectIds / Dates 
 * into plain JSON-serializable objects for Next.js Client Components.
 */
export function serializeData<T>(data: T): T {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data));
}