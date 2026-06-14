import type { HonorariumStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";

export async function listSpeakerOperations(options: { limit?: number; offset?: number }) {
  const { limit = 50, offset = 0 } = options;

  const [items, cmsSpeakers] = await Promise.all([
    prisma.speakerOperations.findMany({
      include: {
        registration: {
          select: {
            registrationId: true,
            fullName: true,
            email: true,
            contactNumber: true,
            institution: true,
          },
        },
        eventSession: { select: { id: true, title: true, startAt: true, venue: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.speakerProfile.findMany({
      where: { deletedAt: null, status: "published" },
      take: 20,
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const total = await prisma.speakerOperations.count();

  const opsRows = items.map((s) => ({
    id: s.id,
    registrationId: s.registration?.registrationId ?? null,
    name: s.registration?.fullName ?? "—",
    email: s.registration?.email ?? null,
    institution: s.registration?.institution ?? null,
    sessionTitle: s.eventSession?.title ?? null,
    sessionStart: s.eventSession?.startAt?.toISOString() ?? null,
    venue: s.eventSession?.venue ?? null,
    travelStatus: s.travelStatus,
    accommodationStatus: s.accommodationStatus,
    honorariumStatus: s.honorariumStatus,
    honorariumAmount: s.honorariumAmount ? Number(s.honorariumAmount) : null,
    scheduleNotes: s.scheduleNotes,
    speakerProfileId: s.speakerProfileId,
  }));

  const unlinkedProfiles = cmsSpeakers.filter(
    (p) => !items.some((i) => i.speakerProfileId === p.id)
  );

  return {
    items: opsRows,
    unlinkedProfiles: unlinkedProfiles.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      institution: p.institution,
      category: p.category,
    })),
    total,
    limit,
    offset,
  };
}

export async function upsertSpeakerOperations(input: {
  registrationId?: string;
  speakerProfileId?: string;
  eventSessionId?: string;
  travelStatus?: string;
  accommodationStatus?: string;
  honorariumStatus?: HonorariumStatus;
  honorariumAmount?: number;
  scheduleNotes?: string;
}) {
  let regUuid: string | undefined;
  if (input.registrationId) {
    const reg = await prisma.registration.findFirst({
      where: { registrationId: input.registrationId, deletedAt: null },
    });
    if (!reg) throw new ServiceError("Registration not found", 404);
    regUuid = reg.id;
  }

  if (regUuid) {
    return prisma.speakerOperations.upsert({
      where: { registrationId: regUuid },
      create: {
        registrationId: regUuid,
        speakerProfileId: input.speakerProfileId,
        eventSessionId: input.eventSessionId,
        travelStatus: input.travelStatus,
        accommodationStatus: input.accommodationStatus,
        honorariumStatus: input.honorariumStatus ?? "not_applicable",
        honorariumAmount: input.honorariumAmount,
        scheduleNotes: input.scheduleNotes,
      },
      update: {
        speakerProfileId: input.speakerProfileId,
        eventSessionId: input.eventSessionId,
        travelStatus: input.travelStatus,
        accommodationStatus: input.accommodationStatus,
        honorariumStatus: input.honorariumStatus,
        honorariumAmount: input.honorariumAmount,
        scheduleNotes: input.scheduleNotes,
      },
    });
  }

  return prisma.speakerOperations.create({
    data: {
      speakerProfileId: input.speakerProfileId,
      eventSessionId: input.eventSessionId,
      travelStatus: input.travelStatus,
      accommodationStatus: input.accommodationStatus,
      honorariumStatus: input.honorariumStatus ?? "not_applicable",
      honorariumAmount: input.honorariumAmount,
      scheduleNotes: input.scheduleNotes,
    },
  });
}

export async function generateSpeakerSchedule() {
  const speakers = await prisma.speakerOperations.findMany({
    include: {
      registration: { select: { fullName: true, registrationId: true, contactNumber: true } },
      eventSession: true,
    },
    orderBy: { eventSession: { startAt: "asc" } },
  });

  const lines = ["Speaker Schedule — Shiksha Mahakumbh", ""];
  for (const s of speakers) {
    if (!s.eventSession) continue;
    const start = s.eventSession.startAt.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    lines.push(
      `${start} | ${s.eventSession.title} @ ${s.eventSession.venue ?? "TBD"}`,
      `  Speaker: ${s.registration?.fullName ?? "TBD"} (${s.registration?.registrationId ?? "—"})`,
      `  Travel: ${s.travelStatus ?? "—"} | Accommodation: ${s.accommodationStatus ?? "—"} | Honorarium: ${s.honorariumStatus}`,
      ""
    );
  }

  return { schedule: lines.join("\n"), count: speakers.filter((s) => s.eventSession).length };
}
