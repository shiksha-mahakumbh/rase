import { saveRegistration } from "@/lib/saveRegistration";
import { uploadFile } from "@/lib/uploadFile";

export async function submitLegacyForm(options: {
  registrationType: string;
  data: Record<string, unknown>;
  file?: File | null;
  uploadFolder?: string;
  fileField?: string;
  files?: Array<{ file: File; field: string; folder?: string }>;
}) {
  const payload = { ...options.data };

  if (options.file) {
    const uploaded = await uploadFile(
      options.file,
      options.uploadFolder ?? "registrations",
      options.registrationType,
      options.fileField ?? "feeReceipt"
    );
    const field = options.fileField ?? "feeReceipt";
    payload[field] = uploaded.url;
  }

  if (options.files?.length) {
    for (const item of options.files) {
      const uploaded = await uploadFile(
        item.file,
        item.folder ?? options.uploadFolder ?? "registrations",
        options.registrationType,
        item.field
      );
      payload[item.field] = uploaded.url;
    }
  }

  return saveRegistration({
    registrationType: options.registrationType as Parameters<
      typeof saveRegistration
    >[0]["registrationType"],
    data: payload,
  });
}
