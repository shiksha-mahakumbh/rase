import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadResult {
  name: string;
  url: string;
  path: string;
  contentType: string;
  size: number;
}

export async function uploadFile(
  file: File,
  folder: string
): Promise<UploadResult> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });
  const url = await getDownloadURL(snapshot.ref);

  return {
    name: file.name,
    url,
    path,
    contentType: file.type,
    size: file.size,
  };
}

export async function uploadFiles(
  files: File[],
  folder: string
): Promise<UploadResult[]> {
  return Promise.all(files.map((file) => uploadFile(file, folder)));
}
