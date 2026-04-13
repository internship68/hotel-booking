"use client";

import { usePathname } from "next/navigation";
import { AdminAppShell } from "@/modules/admin/components/AdminAppShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  return <AdminAppShell>{children}</AdminAppShell>;
}
