"use client";

import PhoneManagement from "../../components/PhoneManagement";
// import AdminSettingsPage from "../settings/page";

import {
  X,
  MessageSquare,
  Smartphone,
  LogOut,
  Settings,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");

  // const [showSettings, setShowSettings] = useState(false);

  const [phones, setPhones] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // const [showQueries, setShowQueries] = useState(false);

  //Count phone brands
  const brandCounts = phones.reduce((counts: Record<string, number>, phone) => {
    const brand = phone.brand || "Unknown";

    counts[brand] = (counts[brand] || 0) + 1;

    return counts;
  }, {});

  //filter pending and update get in touch status
  const totalQueries = contacts.length;

  const pendingQueries = contacts.filter(
    (contact) => contact.status === "pending",
  ).length;

  const completedQueries = contacts.filter(
    (contact) => contact.status === "completed",
  ).length;

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

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      const [phonesResponse, contactsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/phones"),
        fetch("http://localhost:5000/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!phonesResponse.ok || !contactsResponse.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const phonesData = await phonesResponse.json();
      const contactsData = await contactsResponse.json();

      setPhones(phonesData.phones);

      setContacts(contactsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const handleCompleteQuery = async (contactId: string) => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/contacts/${contactId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update query status");
      }

      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to complete customer query:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    router.replace("/");
  };

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="mx-auto mt-4 max-w-7xl">
        <nav
          className="flex items-center justify-between rounded-full border px-7 py-4 shadow-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {/* existing navbar content */}

          <h1 className="text-xl font-bold">Admin</h1>

          <div className="flex items-center gap-6">
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

            <button
              type="button"
              onClick={handleLogout}
              className="admin-logout-link flex cursor-pointer items-center gap-2 transition"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </nav>
      </div>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Welcome, {adminName}</h2>

          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Manage your Phone Store Nova administration panel.
          </p>

          <div className="mt-8">
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Total Phones */}
              <div
                className="rounded-2xl border p-6 shadow-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <Smartphone size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Total Phones</h3>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--accent-color)" }}
                    >
                      {phones.length}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 border-t pt-4"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="space-y-2">
                    {Object.entries(brandCounts).map(([brand, count]) => (
                      <div
                        key={brand}
                        className="flex items-center justify-between text-sm"
                      >
                        <span style={{ color: "var(--text-secondary)" }}>
                          {brand}
                        </span>

                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Queries */}
              <div
                className="rounded-2xl border p-6 shadow-sm"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Customer Queries</h3>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: "var(--accent-color)" }}
                    >
                      {totalQueries}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-5 grid grid-cols-2 gap-4 border-t pt-4"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Pending
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {pendingQueries}
                    </p>
                  </div>

                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Completed
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {completedQueries}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
