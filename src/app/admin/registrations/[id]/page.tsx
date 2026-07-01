import type { Metadata } from "next";
import { NO_INDEX_META } from "@/lib/seo/publicPages";
import { isAdminRegistrationIdentifier } from "@/lib/admin/registration-id";
import RegistrationDetailClient from "./RegistrationDetailClient";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const title = isAdminRegistrationIdentifier(id)
    ? `Registration ${id.trim()}`
    : "Registration detail";
  return {
    ...NO_INDEX_META.admin,
    title,
  };
}

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <RegistrationDetailClient id={id} />;
}
