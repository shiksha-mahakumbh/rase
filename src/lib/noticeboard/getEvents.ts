import { prisma } from "@/server/db/prisma";

export type NoticeboardEvent = {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
};

/** Server-safe CMS read for noticeboard (ISR / RSC). */
export async function getNoticeboardEvents(): Promise<NoticeboardEvent[]> {
  try {
    const notices = await prisma.notice.findMany({
      where: {
        status: "published",
        deletedAt: null,
        OR: [{ expireAt: null }, { expireAt: { gt: new Date() } }],
      },
      orderBy: [{ isPinned: "desc" }, { publishAt: "desc" }],
      take: 20,
      select: {
        id: true,
        title: true,
        publishAt: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return notices.map((n) => ({
      id: n.id,
      title: n.title,
      date: (n.publishAt ?? n.publishedAt ?? n.createdAt).toISOString(),
      imageUrl: "",
    }));
  } catch {
    return [];
  }
}
