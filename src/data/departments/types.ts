export type DepartmentMemberRecord = {
  name: string;
  position?: string;
  contact: string;
};

export type PrabandhanTeamRecord = {
  id: string;
  category: string;
  members: DepartmentMemberRecord[];
};
