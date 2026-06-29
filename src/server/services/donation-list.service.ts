import type { Prisma } from "@prisma/client";
import { SITE_URL } from "@/config/site";
import { prisma } from "@/server/db/prisma";

/** Admin list — kept separate from donation.service to avoid PDF/Chromium in the bundle. */
export async function listDonationRecords(options: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const limit = Math.min(options.limit ?? 50, 100);
  const offset = options.offset ?? 0;
  const search = options.search?.trim();

  const where: Prisma.DonationRecordWhereInput = {
    deletedAt: null,
    ...(search
      ? {
          OR: [
            { donationId: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
            { panNumber: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.donationRecord.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      select: {
        donationId: true,
        donationKind: true,
        fullName: true,
        email: true,
        phone: true,
        amount: true,
        receiptSentAt: true,
        receiptToken: true,
        createdAt: true,
      },
    }),
    prisma.donationRecord.count({ where }),
  ]);

  return {
    items: items.map((row) => ({
      donationId: row.donationId,
      donationKind: row.donationKind,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      amount: Number(row.amount),
      receiptSentAt: row.receiptSentAt,
      createdAt: row.createdAt,
      receiptDownloadUrl: `${SITE_URL}/api/donation/receipt?token=${row.receiptToken}`,
    })),
    total,
    limit,
    offset,
  };
}
