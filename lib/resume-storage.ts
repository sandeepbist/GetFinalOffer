import { supabase } from "@/lib/supabase";

const RESUME_BUCKET = "Resume";
const RESUME_SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Resumes are private candidate documents. The bucket must be configured as
 * private in Supabase; access always goes through short-lived signed URLs
 * minted here. The canonical `resume_url` stored in the database is the
 * storage path (or legacy public URL), never a long-lived readable link.
 */
export function getResumeStoragePath(resumeUrl: string): string | null {
  if (!resumeUrl) return null;

  // Storage paths recorded as bare keys ("userId-...pdf").
  if (!resumeUrl.startsWith("http")) return resumeUrl;

  try {
    const url = new URL(resumeUrl);
    // Legacy public URLs embed "/storage/v1/object/public/<bucket>/<path>".
    const publicMatch = url.pathname.match(
      /^\/storage\/v1\/object\/public\/[^/]+\/(.+)$/
    );
    if (publicMatch) return decodeURIComponent(publicMatch[1]);
    return null;
  } catch {
    return null;
  }
}

export async function createResumeSignedUrl(
  resumeUrl: string,
  expiresIn = RESUME_SIGNED_URL_TTL_SECONDS
): Promise<string | null> {
  const path = getResumeStoragePath(resumeUrl);
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    console.warn("Failed to sign resume URL:", error?.message);
    return null;
  }
  return data.signedUrl;
}
