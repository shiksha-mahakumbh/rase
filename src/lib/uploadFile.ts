export interface UploadResult {
  name: string;
  url: string;
  path: string;
  contentType: string;
  size: number;
}

export async function uploadFile(
  file: File,
  folder: string,
  registrationType = "NGO",
  field = "attachment"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("registrationType", registrationType);
  formData.append("field", field);

  const res = await fetch("/api/registration/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "File upload failed"
    );
  }

  const body = await res.json();
  const uploaded = body.file as UploadResult;
  return uploaded;
}

export async function uploadFiles(
  files: File[],
  folder: string,
  registrationType = "NGO",
  field = "attachment"
): Promise<UploadResult[]> {
  return Promise.all(
    files.map((file) => uploadFile(file, folder, registrationType, field))
  );
}
