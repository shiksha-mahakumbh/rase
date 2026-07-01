/** Pure date formatting for CMS events — safe for client components. */
export function formatEventDateRange(startDate: string | null, endDate: string | null): string {
  if (!startDate) return "To Be Announced";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  if (!end || start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString("en-IN", opts);
  }
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `${start.getDate()}–${end.getDate()} ${start.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
  }
  return `${start.toLocaleDateString("en-IN", opts)} – ${end.toLocaleDateString("en-IN", opts)}`;
}
