"use client";

import React from "react";
import { motion } from "framer-motion";
import DepartmentPageShell from "@/components/departments/DepartmentPageShell";
import DepartmentMemberTable from "@/components/departments/DepartmentMemberTable";
import { PRABANDHAN_TEAMS } from "@/data/departments/prabandhan-members";

const PrabandhanVibhag: React.FC = () => {
  return (
    <DepartmentPageShell
      departmentTitle="Prabandhan Vibhag"
      departmentTitleHindi="प्रबंधन विभाग"
      hideTitleCard
    >
      <div id="coordinators" className="space-y-10 scroll-mt-24">
        {PRABANDHAN_TEAMS.map((team, index) => (
          <motion.section
            key={team.id}
            id={team.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="relative scroll-mt-24"
            aria-labelledby={`prabandhan-${team.id}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                {index + 1}
              </span>
              <h2 id={`prabandhan-${team.id}`} className="text-xl font-bold text-brand-navy md:text-2xl">
                {team.category}
              </h2>
            </div>
            <DepartmentMemberTable members={team.members} />
            {index < PRABANDHAN_TEAMS.length - 1 && (
              <div
                aria-hidden="true"
                className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
              />
            )}
          </motion.section>
        ))}
      </div>
    </DepartmentPageShell>
  );
};

export default PrabandhanVibhag;
