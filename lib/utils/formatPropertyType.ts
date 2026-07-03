export function formatPropertyType(propertyType: string): string {
  return propertyType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}