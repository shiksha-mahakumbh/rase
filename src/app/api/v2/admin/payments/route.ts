import { NextRequest } from "next/server";
import { createApiHandler } from "@/server/lib/api-handler";
import { listAdminPayments } from "@/server/services/admin/payments-admin.service";

export const GET = createApiHandler(
  async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    return listAdminPayments({
      limit: Number(searchParams.get("limit") ?? 25),
      offset: Number(searchParams.get("offset") ?? 0),
      search: searchParams.get("search") ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo: searchParams.get("dateTo") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      paymentStatus: searchParams.get("paymentStatus") ?? undefined,
      registrationStatus: searchParams.get("registrationStatus") ?? undefined,
      emailStatus: searchParams.get("emailStatus") ?? undefined,
    });
  },
  { requireAdmin: true, adminResource: "payments", rateLimitKey: "admin-payments", limit: 120 }
);
