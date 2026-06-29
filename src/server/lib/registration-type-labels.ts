const PRISMA_TYPE_LABEL: Record<string, string> = {
  Conclave: "Conclave",
  Delegate: "Delegate Registration",
  Exhibition: "Projects / Exhibition",
  Accommodation: "Accommodation",
  Volunteer: "Volunteer",
  Participant: "School Program",
  Olympiad: "Olympiad",
  Awards: "Awards",
  Best_Practices: "Best Practices",
  Talent: "Cultural Program",
  NGO: "NGO",
  Legacy_Other: "Other",
};

export function displayRegistrationType(type: string): string {
  return PRISMA_TYPE_LABEL[type] ?? type.replace(/_/g, " ");
}
