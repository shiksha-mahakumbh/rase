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
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gradient-to-r from-primary to-[#7a4343] text-white">
              <th className="px-5 py-3.5 text-sm font-semibold">Name</th>
              <th className="px-5 py-3.5 text-sm font-semibold">Position</th>
              <th className="px-5 py-3.5 text-sm font-semibold">Contact</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 transition hover:bg-[#faf7f5]"
              >
                <td className="px-5 py-3.5 font-medium text-gray-800">
                  {member.name}
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {member.position || "N/A"}
                </td>
                <td className="px-5 py-3.5">
                  <a
                    href={`tel:${member.contact.replace(/\s/g, "")}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {member.contact}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {members.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#faf7f5] p-4 shadow-sm"
          >
            <p className="font-bold text-primary">{member.name}</p>
            <p className="mt-1 text-sm text-gray-600">
              {member.position || "N/A"}
            </p>
            <a
              href={`tel:${member.contact.replace(/\s/g, "")}`}
              className="mt-2 inline-block text-sm font-semibold text-[#F59E0B]"
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
