"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SettingType = "variant" | "brand" | "ram" | "rom";

type Setting = {
  _id: string;
  type: SettingType;
  value: string;
  isActive: boolean;
};

const settingTypes: SettingType[] = ["variant", "brand", "ram", "rom"];

export default function AdminSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState<Setting[]>([]);
  const [type, setType] = useState<SettingType>("variant");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        "http://localhost:5000/api/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch phone settings");
      }

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Phone settings error:", error);
    }
  };

  fetchSettings();
}, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Settings fetch error:", error);
      setStatus("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    try {
      setStatus("");

      const token = localStorage.getItem("adminToken");

      const response = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          value: value.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Failed to add setting");
        return;
      }

      setValue("");
      setStatus("Setting added successfully.");

      fetchSettings();
    } catch (error) {
      console.error("Add setting error:", error);
      setStatus("Failed to add setting");
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(
        `http://localhost:5000/api/settings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Failed to update status");
        return;
      }

      fetchSettings();
    } catch (error) {
      console.error("Update setting error:", error);
      setStatus("Failed to update setting status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`http://localhost:5000/api/settings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.message || "Failed to delete setting");
        return;
      }

      fetchSettings();
    } catch (error) {
      console.error("Delete setting error:", error);
      setStatus("Failed to delete setting");
    }
  };

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        Loading settings....
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Phone Settings</h1>

          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Manage variants, brands, RAM and ROM options.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="mb-8 flex flex-col gap-4 rounded-2xl border p-6 md:flex-row cursor-pointer"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SettingType)}
            className="rounded-lg border px-4 py-2.5 outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="variant">Variant</option>
            <option value="brand">Brand</option>
            <option value="ram">RAM</option>
            <option value="rom">ROM</option>
          </select>

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="flex-1 rounded-lg border px-4 py-2.5 outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <button
            type="submit"
            className="theme-accent-hover rounded-lg px-5 py-2.5 font-semibold cursor-pointer"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            Add Setting
          </button>
        </form>

        {status && (
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {status}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {settingTypes.map((settingType) => (
            <section
              key={settingType}
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <h2 className="mb-4 text-xl font-bold">
                {settingType.toUpperCase()}
              </h2>

              <div className="space-y-3">
                {settings
                  .filter((setting) => setting.type === settingType)
                  .map((setting) => (
                    <div
                      key={setting._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div>
                        <p className="font-medium">{setting.value}</p>

                        <p
                          className="text-sm"
                          style={{
                            color: "var(--text-secondary)",
                          }}
                        >
                          {setting.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(setting._id, !setting.isActive)
                          }
                          className={`rounded-lg border px-3 py-2 text-sm cursor-pointer transition ${
                            setting.isActive
                              ? "hover:bg-red-400 hover:text-white hover:border-red-400"
                              : "hover:bg-green-400 hover:text-white hover:border-green-400"
                          }`}
                          style={{
                            borderColor: "var(--border-color)",
                          }}
                        >
                          {setting.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(setting._id)}
                          className="rounded-lg border px-3 py-2 text-sm cursor-pointer hover:bg-red-500"
                          style={{
                            borderColor: "var(--border-color)",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                {settings.filter((setting) => setting.type === settingType)
                  .length === 0 && (
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    No {settingType} settings yet.
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
