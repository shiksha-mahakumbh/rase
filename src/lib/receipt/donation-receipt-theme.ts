/** Matches tailwind `brand.*` tokens — keep receipt aligned with site UI */
export const DONATION_RECEIPT_THEME = {
  navy: "#0B1F3B",
  navyLight: "#1E3A5F",
  blue: "#1A56DB",
  saffron: "#FF9933",
  saffronDark: "#B45309",
  surface: "#F8FAFC",
  surfaceWarm: "#FFFBF5",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#CBD5E1",
  thanksBg: "#FFFBF5",
  thanksBorder: "#FF9933",
  thanksText: "#0B1F3B",
} as const;

export function rgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}
