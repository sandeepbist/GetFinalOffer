import { supabase } from "@/lib/supabase";

const BUCKET = "Verifications";

export interface UploadedDocMeta {
  storagePath: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
}

/**
 * Upload a verification document to the private Supabase bucket.
 *
 * @param prefix  Folder prefix, e.g. "profile/{userId}" or "interview/{progId}"
 * @param file    Web API File from multipart form
 * @returns       Metadata needed for the `gfo_verification_documents` row
 */
export async function uploadVerificationDoc(
  prefix: string,
  file: File
): Promise<UploadedDocMeta> {
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${prefix}/${Date.now()}-${sanitized}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return {
    storagePath,
    originalFileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
}

/**
 * Generate a time-limited signed URL for a private verification document.
 *
 * @param storagePath  The key stored in `gfo_verification_documents.storage_path`
 * @param expiresIn    Seconds until the URL expires (default 1 hour)
 */
export async function getVerificationSignedUrl(
  storagePath: string,
  expiresIn = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

/**
 * Best-effort cleanup of uploaded files from Supabase.
 * Returns paths that failed to delete so callers can log/handle them.
 *
 * Supabase `.remove()` reports failures via the response object, not by
 * throwing, so we must inspect `error` explicitly.
 */
export async function removeVerificationDocs(
  storagePaths: string[]
): Promise<string[]> {
  if (storagePaths.length === 0) return [];
  try {
    const { error } = await supabase.storage.from(BUCKET).remove(storagePaths);
    if (error) {
      console.error(
        "[verification-storage] Failed to remove files from Supabase:",
        error.message,
        "Orphaned paths:",
        storagePaths
      );
      return storagePaths;
    }
    return [];
  } catch (err) {
    console.error(
      "[verification-storage] Unexpected error removing files:",
      err,
      "Orphaned paths:",
      storagePaths
    );
    return storagePaths;
  }
}
