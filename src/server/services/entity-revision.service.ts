import type { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export type RevisionEntityType =
  | "committee"
  | "committee_member"
  | "speaker"
  | "partner"
  | "event"
  | "media_entry";

async function nextVersion(entityType: string, entityId: string) {
  const last = await prisma.entityRevision.findFirst({
    where: { entityType, entityId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  return (last?.version ?? 0) + 1;
}

export async function saveEntityRevision(input: {
  entityType: RevisionEntityType;
  entityId: string;
  snapshot: Prisma.InputJsonValue;
  createdById?: string | null;
}) {
  return prisma.entityRevision.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      version: await nextVersion(input.entityType, input.entityId),
      snapshot: input.snapshot,
      createdById: input.createdById ?? null,
    },
  });
}

export async function listEntityRevisions(entityType: RevisionEntityType, entityId: string) {
  return prisma.entityRevision.findMany({
    where: { entityType, entityId },
    orderBy: { version: "desc" },
    take: 20,
  });
}
