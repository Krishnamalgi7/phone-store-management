"use client";

import PhoneManagement from "../../components/PhoneManagement";
import AdminSettingsPage from "../settings/page";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  const [showManager, setShowManager] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
        <h1 className="text-xl font-bold">Phone Store settings</h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowManager((current) => {
                const nextState = !current;

                if (nextState) {
                  setTimeout(() => {
                    document
                      .getElementById("manage-phones-section")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      });
                  }, 0);
                }

                return nextState;
              });
            }}
            className="cursor-pointer rounded-lg px-4 py-2 font-medium transition hover:!bg-[var(--accent-color)]"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {showManager ? "Close Phones" : "Manage Phones"}
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="cursor-pointer rounded-lg px-4 py-2 font-medium transition hover:!bg-[var(--accent-color)]"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="cursor-pointer rounded-lg px-4 py-2 font-medium transition hover:!bg-[var(--accent-color)]"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-secondary)",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Welcome, {adminName}</h2>

          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Manage your Phone Store Nova administration panel.
          </p>

          <div className="mt-8">
            <div id="manage-phones-section">
              <PhoneManagement
                showManager={showManager}
                onShowManagerChange={setShowManager}
              />
            </div>
            {showSettings && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowSettings(false);
                  }
                }}
              >
                <div
                  className="relative max-h-[90vh] w-full max-w-7xl overflow-y-auto rounded-2xl border shadow-2xl"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="theme-accent-hover absolute right-5 top-5 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                    }}
                    aria-label="Close settings"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>

                  <AdminSettingsPage />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
