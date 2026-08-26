"use client";

import PhoneManagement from "../../components/PhoneManagement";
import AdminSettingsPage from "../settings/page";

import { X, MessageSquare, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState("");
  
  const [showSettings, setShowSettings] = useState(false);

  const [phones, setPhones] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  const [showQueries, setShowQueries] = useState(false);

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
  onClick={() => router.push("/admin/phones")}
  className="cursor-pointer rounded-lg px-4 py-2 font-medium transition hover:!bg-[var(--accent-color)]"
  style={{
    backgroundColor: "var(--text-primary)",
    color: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
  }}
>
  Manage Phones
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
            className="theme-danger-hover cursor-pointer rounded-lg px-4 py-2 font-medium transition"
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

                    <button
                      type="button"
                      onClick={() => setShowQueries(true)}
                      className="theme-accent-hover mt-5 w-full cursor-pointer rounded-lg border px-4 py-2.5 text-sm font-medium transition"
                      style={{
                        backgroundColor: "var(--text-primary)",
                        color: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      View Queries
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showQueries && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setShowQueries(false);
                  }
                }}
              >
                <div
                  className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border p-6 shadow-2xl"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowQueries(false)}
                    className="theme-accent-hover absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition"
                    style={{
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                    }}
                    aria-label="Close customer queries"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>

                  <div className="pr-12">
                    <h3 className="text-2xl font-bold">Customer Queries</h3>

                    <p
                      className="mt-1 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      View and manage messages received from customers.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {contacts.length === 0 ? (
                      <div
                        className="rounded-xl border p-6 text-center"
                        style={{
                          borderColor: "var(--border-color)",
                          backgroundColor: "var(--bg-secondary)",
                        }}
                      >
                        <p style={{ color: "var(--text-secondary)" }}>
                          No customer queries yet.
                        </p>
                      </div>
                    ) : (
                      contacts.map((contact) => (
                        <div
                          key={contact._id}
                          className="rounded-xl border p-5"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-color)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold">{contact.name}</h4>

                              <p
                                className="mt-1 text-sm"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                {contact.phone}
                              </p>
                            </div>

                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor:
                                  contact.status === "completed"
                                    ? "var(--bg-primary)"
                                    : "var(--accent-color)",
                                color:
                                  contact.status === "completed"
                                    ? "var(--text-secondary)"
                                    : "var(--text-primary)",
                              }}
                            >
                              {contact.status === "completed"
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-6">
                            {contact.message}
                          </p>

                          {contact.status === "pending" && (
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleCompleteQuery(contact._id)}
                                className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-green-500 hover:text-white"
                                style={{
                                  borderColor: "var(--border-color)",
                                }}
                              >
                                Mark Complete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            

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
