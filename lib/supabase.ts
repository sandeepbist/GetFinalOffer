import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Without storage credentials the app still serves every page and API —
  // only resume upload/verification-document flows need the bucket. Tests
  // and local runs without Supabase configured get a stub that fails those
  // paths with a clear error instead of crashing the process at import.
  console.warn("[Supabase] Storage not configured; document flows disabled");
}

export const supabase = createClient(supabaseUrl ?? "http://localhost:0", supabaseKey ?? "stub");
