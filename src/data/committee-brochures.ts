/** Official edition brochures — Google Drive folder shared for Shiksha Mahakumbh Abhiyan. */
export const COMMITTEE_BROCHURES_FOLDER_URL =
  "https://drive.google.com/drive/folders/1ZmE0eSM4yGF2Ep58lB7TInop4df4MBMH?usp=sharing";

export type CommitteeBrochureRecord = {
  edition: string;
  driveFileId: string;
  fileName: string;
  fileSize: string;
};

export const COMMITTEE_BROCHURES: CommitteeBrochureRecord[] = [
  {
    edition: "1.0",
    driveFileId: "1lFkiHPlIKFcD1FYILU984a0_4uWYZLWb",
    fileName: "Brochure Shiksha Mahakumbh 1.0.pdf",
    fileSize: "413 KB",
  },
  {
    edition: "2.0",
    driveFileId: "1gwRa6BlsSmIUfK0KnY9NSRp3L7tTRIz7",
    fileName: "Brochure Shiksha Mahakumbh 2.0.pdf",
    fileSize: "4 MB",
  },
  {
    edition: "3.0",
    driveFileId: "1Kz8A4jpUz-4cw_k750vmpxP2hBCC-yoz",
    fileName: "Brochure Shiksha Mahakumbh 3.0.pdf",
    fileSize: "956 KB",
  },
  {
    edition: "4.0",
    driveFileId: "19273esr2lk-XzQk-sC4UKaJeIZxvLlXC",
    fileName: "Brochure Shiksha Mahakumbh 4.0.pdf",
    fileSize: "3.1 MB",
  },
  {
    edition: "5.0",
    driveFileId: "1Lgc0sAN79gu0qN1m9dgYr264er_DY0LO",
    fileName: "Brochure Shiksha Mahakumbh 5.0.pdf",
    fileSize: "11.1 MB",
  },
  {
    edition: "6.0",
    driveFileId: "1rokyd0hY6w_ekdk3jFvIYwkd-lDh_VYN",
    fileName: "Brochure Shiksha Mahakumbh 6.0.pdf",
    fileSize: "28.6 MB",
  },
];

export const COMMITTEE_BROCHURE_BY_EDITION = Object.fromEntries(
  COMMITTEE_BROCHURES.map((b) => [b.edition, b])
) as Record<string, CommitteeBrochureRecord>;

export function getCommitteeBrochure(edition: string): CommitteeBrochureRecord | undefined {
  return COMMITTEE_BROCHURE_BY_EDITION[edition];
}

export function getBrochureViewUrl(driveFileId: string): string {
  return `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`;
}

export function getBrochureDownloadUrl(driveFileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${driveFileId}`;
}
