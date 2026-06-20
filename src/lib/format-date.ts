/** Format registration timestamps (ISO string, Date, or legacy { seconds } / toDate shapes). */
export function formatRegistrationDate(value: unknown): string {
  if (!value) return "—";
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString("en-IN");
  }
  if (value instanceof Date) {
    return value.toLocaleString("en-IN");
  }
  if (typeof value === "object" && value !== null) {
    const v = value as { seconds?: number; toDate?: () => Date };
    if (typeof v.toDate === "function") {
      return v.toDate().toLocaleString("en-IN");
    }
    if (typeof v.seconds === "number") {
      return new Date(v.seconds * 1000).toLocaleString("en-IN");
    }
  }
  return String(value);
}
