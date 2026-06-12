"use client";
import { redirect } from "next/navigation";

export default function LegacyCmsRedirectPage() {
  redirect("/admin/cms/notices");
}
