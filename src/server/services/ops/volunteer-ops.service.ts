import { prisma } from "@/server/db/prisma";
import { ServiceError } from "@/server/lib/errors";
import { writeAuditLog } from "@/server/services/audit.service";
import { displayRegistrationType } from "@/server/services/admin/receipt-admin.service";

export async function listVolunteers(options: {
  limit?: number;
  offset?: number;
  department?: string;
}) {
  const { limit = 50, offset = 0, department } = options;

  const where = {
    deletedAt: null,
    registrationType: "Volunteer" as const,
  };

  const [items, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      include: {
        volunteerApplication: true,
        volunteerAssignment: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.registration.count({ where }),
  ]);

  const rows = items.map((r) => ({
    id: r.id,
    registrationId: r.registrationId,
    name: r.fullName,
    email: r.email,
    mobile: r.contactNumber,
    role: r.volunteerApplication?.volunteerRole ?? "—",
    availability: r.volunteerApplication?.availability ?? "—",
    department: r.volunteerAssignment?.department ?? null,
    shiftStart: r.volunteerAssignment?.shiftStart?.toISOString() ?? null,
    shiftEnd: r.volunteerAssignment?.shiftEnd?.toISOString() ?? null,
    supervisorName: r.volunteerAssignment?.supervisorName ?? null,
    attendedAt: r.volunteerAssignment?.attendedAt?.toISOString() ?? null,
    checkInStatus: r.checkInStatus.replace(/_/g, " "),
  }));

  const filtered = department
    ? rows.filter((r) => r.department?.toLowerCase() === department.toLowerCase())
    : rows;

  return { items: filtered, total, limit, offset };
}

export async function assignVolunteer(input: {
  registrationId: string;
  department: string;
  shiftStart?: string;
  shiftEnd?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  notes?: string;
  actorUserId?: string;
}) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId: input.registrationId, deletedAt: null, registrationType: "Volunteer" },
  });
  if (!reg) throw new ServiceError("Volunteer registration not found", 404);

  const assignment = await prisma.volunteerAssignment.upsert({
    where: { registrationId: reg.id },
    create: {
      registrationId: reg.id,
      department: input.department.trim(),
      shiftStart: input.shiftStart ? new Date(input.shiftStart) : null,
      shiftEnd: input.shiftEnd ? new Date(input.shiftEnd) : null,
      supervisorName: input.supervisorName,
      supervisorPhone: input.supervisorPhone,
      notes: input.notes,
    },
    update: {
      department: input.department.trim(),
      shiftStart: input.shiftStart ? new Date(input.shiftStart) : undefined,
      shiftEnd: input.shiftEnd ? new Date(input.shiftEnd) : undefined,
      supervisorName: input.supervisorName,
      supervisorPhone: input.supervisorPhone,
      notes: input.notes,
    },
  });

  await writeAuditLog({
    action: "volunteer_assigned",
    registrationId: reg.id,
    actorUserId: input.actorUserId,
    payload: { department: input.department, registrationId: input.registrationId },
  });

  return assignment;
}

export async function markVolunteerAttendance(registrationId: string) {
  const reg = await prisma.registration.findFirst({
    where: { registrationId, deletedAt: null },
    include: { volunteerAssignment: true },
  });
  if (!reg?.volunteerAssignment) throw new ServiceError("Volunteer assignment not found", 404);

  return prisma.volunteerAssignment.update({
    where: { id: reg.volunteerAssignment.id },
    data: { attendedAt: new Date() },
  });
}

export async function generateVolunteerRoster(department?: string) {
  const { items } = await listVolunteers({ limit: 500, department });
  const assigned = items.filter((v) => v.department);

  const byDept = new Map<string, typeof assigned>();
  for (const v of assigned) {
    const dept = v.department ?? "Unassigned";
    if (!byDept.has(dept)) byDept.set(dept, []);
    byDept.get(dept)!.push(v);
  }

  const lines: string[] = ["Volunteer Duty Roster — Shiksha Mahakumbh", ""];
  for (const [dept, volunteers] of Array.from(byDept.entries())) {
    lines.push(`## ${dept}`);
    for (const v of volunteers) {
      const shift =
        v.shiftStart && v.shiftEnd
          ? `${new Date(v.shiftStart).toLocaleString("en-IN")} – ${new Date(v.shiftEnd).toLocaleTimeString("en-IN")}`
          : "TBD";
      lines.push(
        `- ${v.name} (${v.registrationId}) | Shift: ${shift} | Supervisor: ${v.supervisorName ?? "TBD"}`
      );
    }
    lines.push("");
  }

  return { roster: lines.join("\n"), count: assigned.length, departments: Array.from(byDept.keys()) };
}
