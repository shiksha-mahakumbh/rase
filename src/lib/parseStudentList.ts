import * as XLSX from "xlsx";

export interface ParsedStudent {
  studentName: string;
  parentName: string;
  class: string;
  section: string;
  rollNo: string;
  school: string;
}

const COLUMN_ALIASES: Record<keyof ParsedStudent, string[]> = {
  studentName: ["student name", "studentname", "name"],
  parentName: ["parent name", "parentname", "parent"],
  class: ["class"],
  section: ["section"],
  rollNo: ["roll no", "rollno", "roll number", "roll"],
  school: ["school"],
};

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findColumnIndex(
  headers: string[],
  aliases: string[]
): number {
  return headers.findIndex((h) => aliases.includes(h));
}

export async function parseStudentListFile(
  file: File
): Promise<{ students: ParsedStudent[]; count: number }> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
  });

  if (!rows.length) {
    throw new Error("Student list file is empty");
  }

  const rawHeaders = Object.keys(rows[0]).map(normalizeHeader);
  const indices = Object.fromEntries(
    (Object.keys(COLUMN_ALIASES) as (keyof ParsedStudent)[]).map((key) => [
      key,
      findColumnIndex(rawHeaders, COLUMN_ALIASES[key]),
    ])
  ) as Record<keyof ParsedStudent, number>;

  const missing = (Object.keys(indices) as (keyof ParsedStudent)[]).filter(
    (key) => indices[key] === -1
  );
  if (missing.length) {
    throw new Error(
      `Missing required columns: ${missing.join(", ")}. Required: Student Name, Parent Name, Class, Section, Roll No, School`
    );
  }

  const originalKeys = Object.keys(rows[0]);
  const students: ParsedStudent[] = rows
    .map((row) => {
      const values = originalKeys.map((k) => row[k]);
      return {
        studentName: String(values[indices.studentName] ?? "").trim(),
        parentName: String(values[indices.parentName] ?? "").trim(),
        class: String(values[indices.class] ?? "").trim(),
        section: String(values[indices.section] ?? "").trim(),
        rollNo: String(values[indices.rollNo] ?? "").trim(),
        school: String(values[indices.school] ?? "").trim(),
      };
    })
    .filter((s) => s.studentName);

  return { students, count: students.length };
}

export function validateStudentListFile(file: File): string | null {
  const allowed = [".xls", ".xlsx", ".csv"];
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!allowed.includes(ext)) {
    return "Allowed formats: xls, xlsx, csv";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "Maximum file size is 10 MB";
  }
  return null;
}
