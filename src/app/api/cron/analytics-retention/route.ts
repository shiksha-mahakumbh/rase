import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  purgeAuditLogsOlderThan,
  purgeEmailLogsOlderThan,
  purgeVisitorSessionsOlderThan,
} from "@/server/services/retention.service";
import { withCronAuth } from "@/server/lib/cron-route";

export const dynamic = "force-dynamic";

const VISITOR_RETENTION_MONTHS = 12;
const AUDIT_LOG_RETENTION_MONTHS = 24;
const EMAIL_LOG_RETENTION_MONTHS = 12;

function monthsAgo(months: number): Date {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  return cutoff;
}

/** Cron: purge visitor analytics, audit logs, and email logs past retention windows. */
export const GET = withCronAuth(async (_request: NextRequest) => {
  const visitorCutoff = monthsAgo(VISITOR_RETENTION_MONTHS);
  const auditCutoff = monthsAgo(AUDIT_LOG_RETENTION_MONTHS);
  const emailCutoff = monthsAgo(EMAIL_LOG_RETENTION_MONTHS);

  const [deletedVisitorSessions, deletedAuditLogs, deletedEmailLogs] = await Promise.all([
    purgeVisitorSessionsOlderThan(visitorCutoff),
    purgeAuditLogsOlderThan(auditCutoff),
    purgeEmailLogsOlderThan(emailCutoff),
  ]);

  return NextResponse.json({
    ok: true,
    deletedVisitorSessions,
    deletedAuditLogs,
    deletedEmailLogs,
    cutoffs: {
      visitorSessions: visitorCutoff.toISOString(),
      auditLogs: auditCutoff.toISOString(),
      emailLogs: emailCutoff.toISOString(),
    },
  });
});
