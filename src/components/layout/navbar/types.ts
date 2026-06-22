export type Menu = {
  path: string;
  title: string;
  subMenu?: Menu[];
  subMenuGroups?: MenuGroup[];
};

export type MenuGroup = {
  /** Omit or leave empty to render links without a section heading */
  label?: string;
  items: Menu[];
};

export type AnnouncementBadge =
  | "New"
  | "Important"
  | "Upcoming"
  | "Registration Open"
  | "Featured";

export interface AnnouncementItem {
  imageUrl: string;
  text: string;
  link: string;
}

export interface AnnouncementPresentation {
  category: string;
  badges: AnnouncementBadge[];
  icon: "edition" | "concluded" | "register";
  timelineLabel?: string;
}
