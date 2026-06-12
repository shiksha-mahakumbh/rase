import { NextRequest } from "next/server";
import { createApiHandler, assertBody } from "@/server/lib/api-handler";
import {
  removeCommitteeMember,
  toggleCommitteeMemberActive,
  updateCommitteeMember,
} from "@/server/services/committee.service";

export const PATCH = createApiHandler(
  async (request: NextRequest, context: { params: Promise<{ memberId: string }> }) => {
    const { memberId } = await context.params;
    const body = assertBody<{
      isActive?: boolean;
      fullName?: string;
      designation?: string;
      institution?: string;
      email?: string;
      phone?: string;
      bio?: string;
      photoUrl?: string;
      mediaAssetId?: string;
      sortOrder?: number;
      socialLinks?: Record<string, string>;
    }>(await request.json());

    if (Object.keys(body).length === 1 && body.isActive !== undefined) {
      const member = await toggleCommitteeMemberActive(memberId, body.isActive);
      return { success: true, member };
    }

    const member = await updateCommitteeMember(memberId, body);
    return { success: true, member };
  },
  { requireAdmin: true }
);

export const DELETE = createApiHandler(
  async (_request: NextRequest, context: { params: Promise<{ memberId: string }> }) => {
    const { memberId } = await context.params;
    await removeCommitteeMember(memberId);
    return { success: true };
  },
  { requireAdmin: true }
);
