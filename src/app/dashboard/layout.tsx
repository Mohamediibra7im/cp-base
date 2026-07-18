import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CP-Base",
  description:
    "Your personal competitive programming dashboard. Track progress, manage templates, and monitor your CP ratings.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
