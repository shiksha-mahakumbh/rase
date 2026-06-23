"use client";

import React from "react";
import Link from "next/link";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable from "@/components/departments/DepartmentMemberTable";
import { SAMPARK_MEMBERS } from "@/data/departments/sampark-members";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

const SamparkVibhag: React.FC = () => {
  return (
    <DepartmentPageShell
      departmentTitle="Sampark Vibhag"
      departmentTitleHindi="संपर्क विभाग"
      hideTitleCard
    >
      <div id="coordinators" className="scroll-mt-24">
        <DepartmentMemberTable members={SAMPARK_MEMBERS} />
      </div>
      <p className="mt-8 text-center text-sm text-slate-600">
        <Link href={CANONICAL_ROUTES.committees} className="font-semibold text-brand-blue hover:underline">
          View organising committees
        </Link>
        {" · "}
        <Link href={CANONICAL_ROUTES.contact} className="font-semibold text-brand-blue hover:underline">
          Contact DHE
        </Link>
      </p>
    </DepartmentPageShell>
  );
};

export default SamparkVibhag;
