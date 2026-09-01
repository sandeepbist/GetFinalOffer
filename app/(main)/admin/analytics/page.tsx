import type { Metadata } from "next";
import { AdminAnalyticsDashboard } from "@/features/admin/dashboard/AdminAnalyticsDashboard";

export const metadata: Metadata = {
  title: "Admin Analytics",
  robots: { index: false, follow: false },
};

export default function AdminAnalyticsPage() {
  return <AdminAnalyticsDashboard />;
}
