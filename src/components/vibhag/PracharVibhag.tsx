"use client";

import React from "react";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable, {
  DepartmentMember,
} from "@/components/departments/DepartmentMemberTable";

const PracharVibhag: React.FC = () => {
  const members: DepartmentMember[] = [
    {
      name: "Shri Varinder Garg",
      position: "Joint Treasurer (Ex), BJP Haryana",
      contact: "9815697777",
    },
    {
      name: "Dr. Amit Kansal",
      position: "Independent Director (Ex), NHPC",
      contact: "9501898500",
    },
    {
      name: "Er. Anshul Bansal",
      position: "Founder, Technocrat Anshul",
      contact: "9058000045",
    },
    {
      name: "Shri Rupesh Kesari",
      position: "Founder, English Connection",
      contact: "8287977954",
    },
  ];

  return (
    <DepartmentPageShell
      departmentTitle="Prachar Vibhag"
      departmentTitleHindi="प्रचार विभाग"
    >
      <DepartmentMemberTable members={members} />
    </DepartmentPageShell>
  );
};

export default PracharVibhag;
