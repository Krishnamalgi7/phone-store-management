"use client";

import {
  House,
  MessageSquare,
  Smartphone,
  LogOut,
  Settings,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    router.replace("/");
  };

  return (
    <div className="mx-auto mt-4 flex w-full max-w-7xl items-center gap-3">
      <nav
        className="flex flex-1 items-center justify-between rounded-full border px-7 py-4 shadow-sm"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <h1 className="text-xl font-bold">Admin</h1>

        <div className="flex items-center gap-6">
          {/* HOME */}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <House size={17} />
            Home
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

          {/* ADD PHONE */}

          <button
            type="button"
            onClick={() => router.push("/admin/phones/add")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Plus size={17} />
            Add Phone
          </button>

          {/* SHOW PHONES */}

          <button
            type="button"
            onClick={() => router.push("/admin/phones")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Smartphone size={17} />
            Show Phones
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            onClick={() => router.push("/admin/settings")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Settings size={17} />
            Settings
          </button>

          {/* VIEW QUERIES */}

          <button
            type="button"
            onClick={() => router.push("/admin/queries")}
            className="nav-link flex cursor-pointer items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <MessageSquare size={17} />
            View Queries
          </button>
        </div>
      </nav>

      {/* LOGOUT */}

      <button
        type="button"
        onClick={handleLogout}
        className="flex cursor-pointer items-center gap-3 rounded-full border px-5 py-4 font-medium transition hover:!border-red-500 hover:!bg-red-500 hover:!text-white"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)",
        }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}