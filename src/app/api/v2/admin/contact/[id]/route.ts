import { NextRequest } from "next/server";
import type { ContactStatus } from "@prisma/client";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { getContactMessage, updateContactMessage } from "@/server/services/contact.service";

export const GET = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const message = await getContactMessage(id);
    return { success: true, message };
  },
  { requireAdmin: true, adminResource: "contact" }
);

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    const body = assertBody<{
      status?: ContactStatus;
      adminReply?: string;
    }>(await request.json());

    const message = await updateContactMessage(id, body);
    return { success: true, message };
  },
  { requireAdmin: true, adminResource: "contact" }
);
