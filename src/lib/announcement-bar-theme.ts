export type AnnouncementColorTheme = "primary" | "navy" | "saffron" | "emerald" | string;

export function welcomeModalPanelClass(colorTheme?: AnnouncementColorTheme): string {
  switch (colorTheme) {
    case "saffron":
      return "bg-brand-saffron text-brand-navy";
    case "navy":
      return "bg-brand-navy text-white";
    case "emerald":
      return "bg-brand-emerald text-white";
    case "primary":
    default:
      return "bg-primary text-white";
  }
}

export function welcomeModalSubtitleClass(colorTheme?: AnnouncementColorTheme): string {
  switch (colorTheme) {
    case "saffron":
      return "text-brand-navy/80";
    case "emerald":
      return "text-emerald-100";
    case "navy":
    case "primary":
    default:
      return "text-white/90";
  }
}

export function welcomeModalCtaClass(colorTheme?: AnnouncementColorTheme): string {
  switch (colorTheme) {
    case "saffron":
      return "border-brand-navy/30 bg-white/80 text-brand-navy decoration-brand-navy/40 hover:bg-white hover:text-brand-navy focus-visible:outline-brand-navy";
    default:
      return "border-white/30 bg-white/10 text-white decoration-white/50 hover:bg-white/20 hover:text-amber-100 focus-visible:outline-amber-200";
  }
}
