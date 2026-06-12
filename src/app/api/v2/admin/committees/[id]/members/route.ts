import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import { addCommitteeMember, reorderCommitteeMembers } from "@/server/services/committee.service";

export const POST = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: committeeId } = await context.params;
    const body = assertBody<{
      fullName: string;
      designation?: string;
      bio?: string;
      photoUrl?: string;
      sortOrder?: number;
    }>(await request.json());
    const row = await addCommitteeMember({ committeeId, ...body });
    return { success: true, member: row };
  },
  { requireAdmin: true }
);

export const PUT = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id: committeeId } = await context.params;
    const body = assertBody<{ memberIds: string[] }>(await request.json());
    await reorderCommitteeMembers(committeeId, body.memberIds);
    return { success: true };
  },
  { requireAdmin: true }
);
