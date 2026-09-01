import type { Metadata } from "next";
import { VerificationReviewDashboard } from "@/features/admin/dashboard/VerificationReviewDashboard";

export const metadata: Metadata = {
  title: "Admin Verifications",
  robots: { index: false, follow: false },
};

export default function AdminVerificationPage() {
  return <VerificationReviewDashboard />;
}
