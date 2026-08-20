"use client";

import PhoneManagement from "../../components/PhoneManagement";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");

    if (!token || !adminData) {
      router.replace("/admin/login");
      return;
    }

    try {
      const admin = JSON.parse(adminData);
      setAdminName(admin.name);
    } catch (error) {
      console.error("Failed to read admin data:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    router.replace("/admin/login");
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <nav
        className="flex items-center justify-between border-b px-6 py-4"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        <h1 className="text-xl font-bold">Phone Store Nova</h1>

        <button
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 font-medium transition cursor-pointer"
          style={{
            backgroundColor: "var(--accent-color)",
            color: "var(--text-primary)",
          }}
        >
          Logout
        </button>
      </nav>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Welcome, {adminName}</h2>

          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Manage your Phone Store Nova administration panel.
          </p>

          <div className="mt-8">
            <PhoneManagement />
          </div>
          
        </div>
      </section>
    </main>
  );
}
