"use client";

import React from "react";
import { motion } from "framer-motion";

export interface DepartmentMember {
  name: string;
  position?: string;
  contact: string;
}

interface DepartmentMemberTableProps {
  members: DepartmentMember[];
}

const DepartmentMemberTable: React.FC<DepartmentMemberTableProps> = ({
  members,
}) => {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-100 md:block">
        <table className="w-full min-w-[480px] border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-brand-navy to-brand-navy-light text-white">
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold">
                Name
              </th>
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold">
                Position
              </th>
              <th scope="col" className="px-5 py-3.5 text-sm font-semibold">
                Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="border-t border-slate-100 transition hover:bg-brand-surface-warm"
              >
                <td className="px-5 py-3.5 font-medium text-brand-navy">
                  {member.name}
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {member.position || "N/A"}
                </td>
                <td className="px-5 py-3.5">
                  <a
                    href={`tel:${member.contact.replace(/\s/g, "")}`}
                    className="font-semibold text-brand-saffron-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-saffron"
                  >
                    {member.contact}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-brand-surface-warm p-4 shadow-sm"
          >
            <p className="font-bold text-brand-navy">{member.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              {member.position || "N/A"}
            </p>
            <a
              href={`tel:${member.contact.replace(/\s/g, "")}`}
              className="mt-2 inline-block min-h-[44px] text-sm font-semibold leading-[44px] text-brand-saffron-dark"
            >
              {member.contact}
            </a>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default DepartmentMemberTable;
