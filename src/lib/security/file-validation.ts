import { ServiceError } from "@/server/lib/errors";

function extOf(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

/** Basic magic-byte validation — blocks mismatched extensions (ClamAV hook point). */
export function assertFileMagicBytes(file: Buffer, fileName: string): void {
  if (file.length < 4) {
    throw new ServiceError("File too small", 400, "FILE_INVALID");
  }

  const ext = extOf(fileName);
  const head = file.subarray(0, 12);

  const isPdf = head[0] === 0x25 && head[1] === 0x50 && head[2] === 0x44 && head[3] === 0x46;
  const isJpeg = head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  const isPng =
    head[0] === 0x89 && head[1] === 0x50 && head[2] === 0x4e && head[3] === 0x47;
  const isWebp =
    head[0] === 0x52 &&
    head[1] === 0x49 &&
    head[2] === 0x46 &&
    head[3] === 0x46 &&
    file.length >= 12 &&
    file.subarray(8, 12).toString("ascii") === "WEBP";
  const isGif = head[0] === 0x47 && head[1] === 0x49 && head[2] === 0x46;
  const isZip =
    head[0] === 0x50 && head[1] === 0x4b && (head[2] === 0x03 || head[2] === 0x05);

  const checks: Record<string, boolean> = {
    pdf: isPdf,
    jpg: isJpeg,
    jpeg: isJpeg,
    png: isPng,
    webp: isWebp,
    gif: isGif,
    docx: isZip,
    xlsx: isZip,
    csv: true,
    txt: true,
    mp4: true,
    doc: true,
    xls: true,
  };

  if (ext in checks && !checks[ext]) {
    throw new ServiceError("File content does not match extension", 400, "FILE_MAGIC_MISMATCH");
  }
}
