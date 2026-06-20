"use client";

import React from "react";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable, {
  DepartmentMember,
} from "@/components/departments/DepartmentMemberTable";

const SamparkVibhag: React.FC = () => {
  const members: DepartmentMember[] = [
    {
      name: "Dr. Manjo Teotia",
      position: "Assistant Professor, ICSSR-CRRID Chandigarh",
      contact: "8283825534",
    },
    {
      name: "Dr. Nitya Sharma",
      position: "PTU Jalandhar",
      contact: "9814733309",
    },
    {
      name: "Dr. Neelam Sharma",
      position: "LPU Jalandhar",
      contact: "6239612140",
    },
    {
      name: "Dr. Gaurav Kumar",
      position: "IIT Delhi",
      contact: "9023925400",
    },
    {
      name: "Dr. Rajneesh Talwar",
      position: "Chitkara University, DHE",
      contact: "9815779477",
    },
  ];

  return (
    <DepartmentPageShell
      departmentTitle="Sampark Vibhag"
      departmentTitleHindi="संपर्क विभाग"
    >
      <DepartmentMemberTable members={members} />
    </DepartmentPageShell>
  );
};

export default SamparkVibhag;
