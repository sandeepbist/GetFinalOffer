import type { Metadata } from "next";
import { VerificationReviewDashboard } from "@/features/admin/VerificationReviewDashboard";

export const metadata: Metadata = {
  title: "Verification Review",
  robots: { index: false, follow: false },
};

export default function AdminVerificationPage() {
  return <VerificationReviewDashboard />;
}
