"use client";

import dynamic from "next/dynamic";

const NavBarTools = dynamic(() => import("@/components/nav/NavBarTools"), { ssr: false });

type Props = {
  visibility?: "desktop" | "mobile" | "always";
};

export default function NavBarToolsDeferred({ visibility = "desktop" }: Props) {
  return <NavBarTools visibility={visibility} />;
}
