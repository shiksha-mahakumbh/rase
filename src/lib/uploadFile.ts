export interface UploadResult {
  name: string;
  url: string;
  path: string;
  contentType: string;
  size: number;
}

async function fetchUploadToken(captchaToken: string): Promise<string> {
  const res = await fetch("/api/v2/registration/verify-captcha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: captchaToken, action: "registration" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Security check failed"
    );
  }
  const body = await res.json();
  if (!body.uploadToken) {
    throw new Error("Security check failed");
  }
  return body.uploadToken as string;
}

export async function uploadFile(
  file: File,
  folder: string,
  registrationType = "NGO",
  field = "attachment",
  options?: { captchaToken?: string; uploadToken?: string }
): Promise<UploadResult> {
  let uploadToken = options?.uploadToken;
  if (!uploadToken) {
    if (!options?.captchaToken) {
      throw new Error("Captcha or upload token required");
    }
    uploadToken = await fetchUploadToken(options.captchaToken);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("registrationType", registrationType);
  formData.append("field", field);
  formData.append("uploadToken", uploadToken);

  const res = await fetch("/api/v2/registration/upload", {
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
  field = "attachment",
  options?: { captchaToken?: string; uploadToken?: string }
): Promise<UploadResult[]> {
  let uploadToken = options?.uploadToken;
  if (!uploadToken && options?.captchaToken) {
    uploadToken = await fetchUploadToken(options.captchaToken);
  }
  if (!uploadToken) {
    throw new Error("Captcha or upload token required");
  }

  return Promise.all(
    files.map((file) =>
      uploadFile(file, folder, registrationType, field, { uploadToken })
    )
  );
}
