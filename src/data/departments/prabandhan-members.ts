import type { PrabandhanTeamRecord } from "./types";

/** SMK 6.0 Prabandhan Vibhag — event operations & logistics coordinators */
export const PRABANDHAN_TEAMS: PrabandhanTeamRecord[] = [
  {
    id: "anchoring",
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
    id: "hall-management",
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
    id: "registration",
    category: "Registration",
    members: [{ name: "Dr. Pooja Mahajan", position: "DHE", contact: "9465262383" }],
  },
  {
    id: "transport",
    category: "Transport",
    members: [{ name: "Dr. Jitesh Pandey", position: "DHE", contact: "8360990494" }],
  },
  {
    id: "accommodation",
    category: "Accommodation",
    members: [
      {
        name: "Dr. Parveen Sharma",
        position: "Associate Professor, CU Jammu",
        contact: "9988625485",
      },
      { name: "Dr. Shiksha Sharma", position: "DHE", contact: "9878890303" },
      { name: "Shri Aman Kumar", position: "DHE", contact: "7905416059" },
    ],
  },
  {
    id: "food",
    category: "Food",
    members: [{ name: "Shri Sanjay Chaudhary", position: "DHE", contact: "9812154381" }],
  },
  {
    id: "medical",
    category: "Medical Services",
    members: [{ name: "Dr. Ankit Goel", position: "DHE", contact: "9466747047" }],
  },
  {
    id: "photography",
    category: "Photography",
    members: [{ name: "Shri Praveen Chandel", position: "DHE", contact: "8725050733" }],
  },
  {
    id: "exhibition",
    category: "Exhibition",
    members: [
      { name: "Shri Aman Shrivastav", position: "DHE", contact: "7905416059" },
      { name: "Shri Sanjay Soni", position: "DHE", contact: "9355542751" },
      { name: "Shri Vinay Kumar", position: "DHE", contact: "8290463378" },
    ],
  },
  {
    id: "war-room",
    category: "War Room",
    members: [
      { name: "Shri Chander Has Gupta", position: "DHE", contact: "9417050631" },
      { name: "Smt. Pratibha Gupta", position: "DHE", contact: "9814738016" },
      { name: "Shri Ramendra Singh", position: "DHE", contact: "7903431900" },
      { name: "Smt. Sonal Kandari", position: "DHE", contact: "9816941951" },
      { name: "Shri Deepak Kumar", position: "DHE", contact: "7018318078" },
    ],
  },
];

export function prabandhanMemberCount(): number {
  return PRABANDHAN_TEAMS.reduce((sum, team) => sum + team.members.length, 0);
}
