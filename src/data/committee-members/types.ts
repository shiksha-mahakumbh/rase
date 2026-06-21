export type CommitteeMember = {
  name: string;
  designation: string;
};

export type CommitteeSection = {
  title: string;
  badge?: string;
  members: CommitteeMember[];
};

export type CommitteeEditionData = {
  edition: string;
  /** Public URL slug — e.g. "Shiksha Mahakumbh 6.0" */
  slug: string;
  /** Internal module id — e.g. "shiksha-mahakumbh-6-0" */
  moduleKey: string;
  breadcrumbLabel: string;
  pageTitle: string;
  venue: string;
  dates: string;
  theme: string;
  year: string;
  eventHref: string;
  sections: CommitteeSection[];
};

export function countCommitteeMembers(edition: CommitteeEditionData): number {
  return edition.sections.reduce((sum, section) => sum + section.members.length, 0);
}

function m(name: string, designation: string): CommitteeMember {
  return { name, designation };
}

export { m };
