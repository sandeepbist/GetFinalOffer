import type { Metadata } from "next";
import { AdminOverviewDashboard } from "@/features/admin/dashboard/AdminOverviewDashboard";

export const metadata: Metadata = {
  title: "Admin Overview",
  robots: { index: false, follow: false },
};

export default function AdminOverviewPage() {
  return <AdminOverviewDashboard />;
}
