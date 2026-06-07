"use client";

import React from "react";
import { motion } from "framer-motion";
import DepartmentPageShell from "../ui/DepartmentPageShell";
import DepartmentMemberTable, {
  DepartmentMember,
} from "../ui/DepartmentMemberTable";

interface CategoryGroup {
  category: string;
  members: DepartmentMember[];
}

const PrabandhanVibhag: React.FC = () => {
  const members: CategoryGroup[] = [
    {
      category: "Anchoring",
      members: [
        {
          name: "Smt. Neha Sachdeva",
          position: "Gita Niketan Awasiya Vidyalay",
          contact: "7015300835",
        },
      ],
    },
    {
      category: "Hall Management",
      members: [
        {
          name: "Dr. Vikas Garg",
          position: "Assistant Professor, SLIET",
          contact: "9988610629",
        },
        {
          name: "Dr. Mohit Tyagi",
          position: "Associate Professor, PEC",
          contact: "8826841129",
        },
      ],
    },
    {
      category: "Registration",
      members: [
        { name: "Dr. Pooja Mahajan", position: "DHE", contact: "9465262383" },
      ],
    },
    {
      category: "Transport",
      members: [
        { name: "Dr. Jitesh Pandey", position: "DHE", contact: "8360990494" },
      ],
    },
    {
      category: "Accommodation",
      members: [
        {
          name: "Dr. Parveen Sharma",
          position: "Associate Professor, CU Jammu",
          contact: "9988625485",
        },
        { name: "Dr. Shiksha Sharma", position: "DHE", contact: "9878890303" },
        { name: "Shri Aman Kumar", position: "DHE", contact: "79054 16059" },
      ],
    },
    {
      category: "Food",
      members: [
        { name: "Shri Sanjay Chaudhary", position: "DHE", contact: "9812154381" },
      ],
    },
    {
      category: "Medical Services",
      members: [
        { name: "Dr. Ankit Goel", position: "DHE", contact: "9466747047" },
      ],
    },
    {
      category: "Photography",
      members: [
        { name: "Shri Praveen Chandel", position: "DHE", contact: "8725050733" },
      ],
    },
    {
      category: "Exhibition",
      members: [
        { name: "Shri Aman Shrivastav", position: "DHE", contact: "7905416059" },
        { name: "Shri Sanjay Soni", position: "DHE", contact: "9355542751" },
        { name: "Shri Vinay Kumar", position: "DHE", contact: "82904 63378" },
      ],
    },
    {
      category: "War Room",
      members: [
        { name: "Shri Chander Has Gupta", position: "DHE", contact: "9417050631" },
        { name: "Smt. Pratibha Gupta", position: "DHE", contact: "9814738016" },
        { name: "Shri Ramendra Singh", position: "DHE", contact: "7903431900" },
        { name: "Shushri Sonal Kandari", position: "DHE", contact: "9816941951" },
        { name: "Shri Deepak Kumar", position: "DHE", contact: "70183 18078" },
      ],
    },
  ];

  return (
    <DepartmentPageShell
      departmentTitle="Prabandhan Vibhag"
      departmentTitleHindi="प्रबंधन विभाग"
    >
      <div className="space-y-10">
        {members.map((category, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="relative"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                {index + 1}
              </span>
              <h4 className="text-xl font-bold text-brand-navy md:text-2xl">
                {category.category}
              </h4>
            </div>
            <DepartmentMemberTable members={category.members} />
            {index < members.length - 1 && (
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
