import type { Metadata } from "next";
import { AdminGraphHealthDashboard } from "@/features/admin/dashboard/AdminGraphHealthDashboard";

export const metadata: Metadata = {
  title: "Admin System",
  robots: { index: false, follow: false },
};

export default function AdminGraphHealthPage() {
  return <AdminGraphHealthDashboard />;
}
