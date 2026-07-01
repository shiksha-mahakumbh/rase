export class AdminCmsApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "AdminCmsApiError";
  }
}

export async function adminCmsFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const normalized = path.replace(/^\//, "");
  const headers = new Headers(init.headers);

  const res = await fetch(`/api/admin/gateway/${normalized}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err = (data as { error?: string; code?: string }) ?? {};
    if (res.status === 401 || res.status === 403) {
      throw new AdminCmsApiError(
        "Session expired or insufficient permissions. Sign in again.",
        res.status,
        err.code
      );
    }
    throw new AdminCmsApiError(
      err.error ?? `Request failed (${res.status})`,
      res.status,
      err.code
    );
  }

  return data as T;
}

export async function adminCmsUpload(path: string, formData: FormData): Promise<unknown> {
  return adminCmsFetch(path, {
    method: "POST",
    body: formData,
  });
}
