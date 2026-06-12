import { prisma } from "@/server/db/prisma";

export async function getDashboardStats() {
  const [
    totalRegistrations,
    recentRegistrations,
    paidCount,
    pendingPaymentCount,
    recentUploads,
    committeeCount,
    memberCount,
    eventCount,
    feedbackCount,
    contactCount,
    newsletterCount,
  ] = await Promise.all([
    prisma.registration.count({ where: { deletedAt: null } }),
    prisma.registration.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        registrationId: true,
        fullName: true,
        registrationType: true,
        paymentStatus: true,
        createdAt: true,
      },
    }),
    prisma.registration.count({ where: { deletedAt: null, paymentStatus: "Paid" } }),
    prisma.registration.count({ where: { deletedAt: null, paymentStatus: "Pending_Payment" } }),
    prisma.uploadedFile.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        originalName: true,
        bucket: true,
        createdAt: true,
      },
    }),
    prisma.committee.count({ where: { deletedAt: null } }),
    prisma.committeeMember.count({ where: { deletedAt: null } }),
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.feedback.count({ where: { deletedAt: null } }),
    prisma.contactMessage.count({ where: { deletedAt: null } }),
    prisma.newsletterSubscription.count({ where: { deletedAt: null, status: "subscribed" } }),
  ]);

  return {
    registrations: {
      total: totalRegistrations,
      paid: paidCount,
      pendingPayment: pendingPaymentCount,
      recent: recentRegistrations,
    },
    payments: {
      paid: paidCount,
      pending: pendingPaymentCount,
    },
    uploads: { recent: recentUploads },
    committees: { committees: committeeCount, members: memberCount },
    events: { total: eventCount },
    feedback: { total: feedbackCount },
    contact: { total: contactCount },
    newsletter: { subscribed: newsletterCount },
  };
}
