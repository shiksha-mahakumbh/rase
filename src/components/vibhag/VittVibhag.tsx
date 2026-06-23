"use client";

import React from "react";
import Link from "next/link";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable from "@/components/departments/DepartmentMemberTable";
import { VITT_MEMBERS } from "@/data/departments/vitt-members";
import { CANONICAL_ROUTES } from "@/constants/canonical-routes";

const VittVibhag: React.FC = () => {
  return (
    <DepartmentPageShell
      departmentTitle="Vitt Vibhag"
      departmentTitleHindi="वित्त विभाग"
      hideTitleCard
    >
      <div id="coordinators" className="scroll-mt-24">
        <DepartmentMemberTable members={VITT_MEMBERS} />
      </div>
      <div className="mt-8 rounded-2xl border border-brand-saffron/25 bg-brand-surface-warm p-6 text-center">
        <p className="text-sm font-semibold text-brand-navy">Support the Abhiyan</p>
        <p className="mt-2 text-sm text-slate-600">
          Secure donations with instant 80G receipts via Razorpay.
        </p>
        <Link
          href={CANONICAL_ROUTES.donation}
          className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
        >
          Donate with 80G receipt
        </Link>
      </div>
    </DepartmentPageShell>
  );
};

export default VittVibhag;
