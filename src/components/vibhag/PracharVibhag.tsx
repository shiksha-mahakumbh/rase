"use client";

import React from "react";
import Link from "next/link";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable from "@/components/departments/DepartmentMemberTable";
import { PRACHAR_MEMBERS } from "@/data/departments/prachar-members";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

const PracharVibhag: React.FC = () => {
  return (
    <DepartmentPageShell
      departmentTitle="Prachar Vibhag"
      departmentTitleHindi="प्रचार विभाग"
      hideTitleCard
    >
      <div id="coordinators" className="scroll-mt-24">
        <DepartmentMemberTable members={PRACHAR_MEMBERS} />
      </div>
      <p className="mt-8 text-center text-sm text-slate-600">
        Media coverage:{" "}
        <Link href={CANONICAL_ROUTES.press} className="font-semibold text-brand-blue hover:underline">
          Press releases
        </Link>
        {" · "}
        <Link href={CANONICAL_ROUTES.mediaCenter} className="font-semibold text-brand-blue hover:underline">
          Media Centre
        </Link>
      </p>
    </DepartmentPageShell>
  );
};

export default PracharVibhag;
