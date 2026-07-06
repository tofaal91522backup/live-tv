export function toDatetimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return date.toISOString().slice(0, 16);
}
