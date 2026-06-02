"use client";

import React from "react";
import DepartmentPageShell from "../ui/DepartmentPageShell";
import DepartmentMemberTable, {
  DepartmentMember,
} from "../ui/DepartmentMemberTable";

const VittVibhag: React.FC = () => {
  const members: DepartmentMember[] = [
    {
      name: "Shri Mandeep Tiwari",
      position: "Entrepreneur, Jalandhar",
      contact: "9814978666",
    },
    {
      name: "Dr. Jatinder Garg",
      position: "Associate Professor, Government College, Sangrur",
      contact: "9501956000",
    },
  ];

  return (
    <DepartmentPageShell
      departmentTitle="Vitt Vibhag"
      departmentTitleHindi="वित्त विभाग"
    >
      <DepartmentMemberTable members={members} />
    </DepartmentPageShell>
  );
};

export default VittVibhag;
