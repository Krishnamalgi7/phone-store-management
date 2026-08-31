"use client";

import AdminNavbar from "./AdminNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/signup";

  return (
    <>
      {!isAuthPage && <AdminNavbar />}
      {children}
    </>
  );
}