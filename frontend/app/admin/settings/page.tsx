"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  X,
  Upload,
} from "lucide-react";

type SectionType = "brands" | "variants" | "rams" | "roms";

type StatusFilter = "all" | "active" | "inactive";

type MasterItem = {
  _id: string;
  name?: string;
  value?: string;
  isActive: boolean;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type MetaData = {
  total: number;
  active: number;
  inactive: number;
};

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const sections = [
  {
    key: "brands" as SectionType,
    title: "Brands",
    description: "Manage phone brands",
  },
  {
    key: "variants" as SectionType,
    title: "Variants",
    description: "Manage phone variants",
  },
  {
    key: "rams" as SectionType,
    title: "RAM",
    description: "Manage RAM options",
  },
  {
    key: "roms" as SectionType,
    title: "ROM",
    description: "Manage storage options",
  },
];

export default function AdminSettingsPage() {
  const router = useRouter();

  const [openSection, setOpenSection] = useState<SectionType | null>(null);

  const [items, setItems] = useState<MasterItem[]>([]);

  const [meta, setMeta] = useState<Record<SectionType, MetaData>>({
    brands: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    variants: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    rams: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    roms: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  });

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<StatusFilter>("all");

  const [loading, setLoading] = useState(false);

  const [metaLoading, setMetaLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [brandingSaving, setBrandingSaving] = useState(false);

  const handleSaveBranding = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      setBrandingSaving(true);

      const data = new FormData();

      data.append("brandName", brandName);

      if (logo) {
        data.append("logo", logo);
      }

      const response = await fetch(`${API_BASE_URL}/store-settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update branding");
      }

      setMessage("Store branding updated successfully.");
    } catch (error) {
      console.error("Save branding error:", error);

      setMessage("Failed to update store branding.");
    } finally {
      setBrandingSaving(false);
    }
  };

  const [editing, setEditing] = useState<{
    id: string;
    value: string;
  } | null>(null);

  const [confirmItem, setConfirmItem] = useState<MasterItem | null>(null);

  /*
   * ------------------------------------------------
   * FETCH METADATA
   * ------------------------------------------------
   *
   * Gets only counts.
   *
   * It does NOT download all brands/variants/RAM/ROM.
   */

  const fetchMeta = async () => {
    try {
      setMetaLoading(true);

      const responses = await Promise.all([
        fetch(`${API_BASE_URL}/brands/meta`),
        fetch(`${API_BASE_URL}/variants/meta`),
        fetch(`${API_BASE_URL}/rams/meta`),
        fetch(`${API_BASE_URL}/roms/meta`),
      ]);

      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to fetch metadata");
      }

      const [brands, variants, rams, roms] = await Promise.all(
        responses.map((response) => response.json()),
      );

      setMeta({
        brands,
        variants,
        rams,
        roms,
      });
    } catch (error) {
      console.error("Failed to fetch metadata:", error);
    } finally {
      setMetaLoading(false);
    }
  };

  /*
   * ------------------------------------------------
   * INITIAL METADATA LOAD
   * ------------------------------------------------
   */

  useEffect(() => {
    fetchMeta();
  }, []);

  /*
   * ------------------------------------------------
   * FETCH ITEMS
   * ------------------------------------------------
   *
   * Only the currently selected section
   * is fetched.
   */

  const fetchItems = async (section: SectionType, page = 1) => {
    try {
      setLoading(true);
      setMessage("");

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        search: search.trim(),
        status,
      });

      const response = await fetch(
        `${API_BASE_URL}/${section}?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load data");
      }

      setItems(data.items || []);

      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      );
    } catch (error) {
      console.error("Failed to fetch settings data:", error);

      setMessage("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * ------------------------------------------------
   * OPEN SECTION
   * ------------------------------------------------
   */

  useEffect(() => {
    if (!openSection) {
      return;
    }

    const timer = setTimeout(() => {
      fetchItems(openSection, 1);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [openSection, search, status]);

  /*
   * ------------------------------------------------
   * GET DISPLAY VALUE
   * ------------------------------------------------
   */

  const getDisplayValue = (item: MasterItem) => {
    return item.name || item.value || "";
  };

  /*
   * ------------------------------------------------
   * CHECK DUPLICATE
   * ------------------------------------------------
   *
   * Used before adding a new value.
   */

  const checkDuplicate = async (value: string) => {
    if (!openSection) {
      return false;
    }

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "10",
        search: value,
        status: "all",
      });

      const response = await fetch(
        `${API_BASE_URL}/${openSection}?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        return false;
      }

      const existingItems = data.items || [];

      return existingItems.some(
        (item: MasterItem) =>
          getDisplayValue(item).trim().toLowerCase() ===
          value.trim().toLowerCase(),
      );
    } catch (error) {
      console.error("Duplicate check failed:", error);

      return false;
    }
  };

  /*
   * ------------------------------------------------
   * ADD ITEM
   * ------------------------------------------------
   */

  const handleAdd = async () => {
    if (!openSection) {
      return;
    }

    const value = search.trim();

    if (!value) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      /*
       * Check if exact value already exists.
       */

      const alreadyExists = await checkDuplicate(value);

      if (alreadyExists) {
        setMessage(`"${value}" already exists.`);

        return;
      }

      const isNameField =
        openSection === "brands" || openSection === "variants";

      const body = isNameField ? { name: value } : { value };

      const response = await fetch(`${API_BASE_URL}/${openSection}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add item.");

        return;
      }

      setMessage(data.message || "Added successfully.");

      setSearch("");

      /*
       * Refresh list.
       */

      await fetchItems(openSection, 1);

      /*
       * Refresh counts.
       */

      await fetchMeta();
    } catch (error) {
      console.error("Failed to add item:", error);

      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------------
   * UPDATE ITEM
   * ------------------------------------------------
   */

  const handleUpdate = async () => {
    if (!openSection || !editing) {
      return;
    }

    const value = editing.value.trim();

    if (!value) {
      setMessage("Value cannot be empty.");

      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const isNameField =
        openSection === "brands" || openSection === "variants";

      const body = isNameField ? { name: value } : { value };

      const response = await fetch(
        `${API_BASE_URL}/${openSection}/${editing.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update item.");

        return;
      }

      setEditing(null);

      setMessage(data.message || "Updated successfully.");

      await fetchItems(openSection, pagination.page);

      await fetchMeta();
    } catch (error) {
      console.error("Failed to update item:", error);

      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------------
   * ACTIVATE / DEACTIVATE
   * ------------------------------------------------
   */
  const confirmToggle = async () => {
    if (!confirmItem) {
      return;
    }

    await handleToggle(confirmItem);

    setConfirmItem(null);
  };

  const handleToggle = async (item: MasterItem) => {
    if (!openSection) {
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/${openSection}/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !item.isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update status.");

        return;
      }

      await fetchItems(openSection, pagination.page);

      await fetchMeta();
    } catch (error) {
      console.error("Failed to update status:", error);

      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  /*
   * ------------------------------------------------
   * BACK TO SETTINGS
   * ------------------------------------------------
   */

  const handleBack = () => {
    setOpenSection(null);
    setItems([]);
    setSearch("");
    setStatus("all");
    setMessage("");
    setEditing(null);

    /*
     * Refresh counts when returning.
     */

    fetchMeta();
  };

  /*
   * ------------------------------------------------
   * CLEAR SEARCH
   * ------------------------------------------------
   */

  const clearSearch = () => {
    setSearch("");
  };

  const currentSection = sections.find(
    (section) => section.key === openSection,
  );

  /*
   * =================================================
   * MANAGEMENT VIEW
   * =================================================
   */

  if (openSection) {
    return (
      <main
        className="min-h-screen px-6 py-10"
        style={{
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* BACK TO settings */}

          <button
            type="button"
            onClick={handleBack}
            className="mb-8 flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent-color)]"
          >
            <ArrowLeft size={17} />
            Back to Settings
          </button>

          {/* HEADER */}

          <div className="mb-10">
            <p
              className="mb-2 text-sm font-semibold uppercase tracking-wider"
              style={{
                color: "var(--accent-primary)",
              }}
            >
              Settings
            </p>

            <h1 className="text-3xl font-bold">{currentSection?.title}</h1>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {currentSection?.description}
            </p>
          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className="mb-6 flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <span>{message}</span>

              <button
                type="button"
                onClick={() => setMessage("")}
                className="cursor-pointer rounded-full p-1 transition-opacity hover:opacity-60"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* SEARCH + STATUS */}

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                style={{
                  color: "var(--text-secondary)",
                }}
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleAdd();
                  }
                }}
                placeholder={`Search or add ${currentSection?.title.toLowerCase()}...`}
                className="w-full rounded-xl border py-3 pl-11 pr-11 outline-none"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 transition-opacity hover:opacity-60"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              className="cursor-pointer rounded-xl border px-4 py-3 outline-none"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="all">All</option>

              <option value="active">Active</option>

              <option value="inactive">Inactive</option>
            </select>

            {search.trim() && (
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--accent-primary)",
                  color: "var(--button-text)",
                }}
              >
                <Plus size={17} />
                Add
              </button>
            )}
          </div>

          {/* RESULTS */}

          {loading ? (
            <div
              className="rounded-2xl border p-10 text-center"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div
              className="rounded-2xl border p-10 text-center"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <p className="font-medium">No results found.</p>

              {search.trim() && (
                <p
                  className="mt-2 text-sm"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  If this is a new value, click Add to create "{search.trim()}".
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => {
                const value = getDisplayValue(item);

                const isEditing = editing?.id === item._id;

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
                    style={{
                      borderColor: "var(--border-color)",
                      background: "var(--bg-secondary)",
                    }}
                  >
                    {/* VALUE */}

                    {isEditing ? (
                      <input
                        type="text"
                        value={editing.value}
                        onChange={(event) =>
                          setEditing((current) =>
                            current
                              ? {
                                  ...current,
                                  value: event.target.value,
                                }
                              : null,
                          )
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleUpdate();
                          }

                          if (event.key === "Escape") {
                            setEditing(null);
                          }
                        }}
                        className="min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none"
                        style={{
                          borderColor: "var(--border-color)",
                          background: "var(--bg-primary)",
                          color: "var(--text-primary)",
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="min-w-0 flex-1 font-medium">
                        {value}
                      </span>
                    )}

                    {/* STATUS */}

                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: item.isActive
                          ? "rgba(34,197,94,0.12)"
                          : "rgba(239,68,68,0.12)",
                        color: item.isActive ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>

                    {/* ACTIONS */}

                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleUpdate}
                          disabled={saving}
                          className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                          style={{
                            background: "var(--accent-primary)",
                            color: "var(--button-text)",
                          }}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="cursor-pointer rounded-lg border px-3 py-2 text-sm transition-opacity hover:opacity-70"
                          style={{
                            borderColor: "var(--border-color)",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmItem(item)}
                          disabled={saving}
                          className="cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                          style={{
                            borderColor: "var(--border-color)",
                          }}
                        >
                          {item.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION */}

          {!loading && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p
                className="text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fetchItems(openSection, pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="cursor-pointer rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    borderColor: "var(--border-color)",
                  }}
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() => fetchItems(openSection, pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || loading}
                  className="cursor-pointer rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    borderColor: "var(--border-color)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Popup */}
        {confirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div
              className="w-full max-w-md rounded-2xl border p-6 shadow-xl"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <h2 className="text-xl font-bold">
                {confirmItem.isActive
                  ? "Confirm Deactivation"
                  : "Confirm Activation"}
              </h2>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Are you sure you want to{" "}
                {confirmItem.isActive ? "deactivate" : "activate"}{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  "{confirmItem.name || confirmItem.value}"
                </span>
                ?
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmItem(null)}
                  className="cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
                  style={{
                    borderColor: "var(--border-color)",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmToggle}
                  disabled={saving}
                  className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                    confirmItem.isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {confirmItem.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  /*
   * =================================================
   * SETTINGS LANDING PAGE
   * =================================================
   */

  return (
    <main
      className="min-h-screen px-6 py-8"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mb-10">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors hover:!text-[var(--accent-color)]"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <p
            className="mb-2 text-sm font-semibold uppercase tracking-wider"
            style={{
              color: "var(--accent-primary)",
            }}
          >
            Administration
          </p>

          <h1 className="text-3xl font-bold">Settings</h1>

          <p
            className="mt-2 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Manage phone master data.
          </p>
        </div>

        {/* STORE BRANDING CARD */}
        <button
          type="button"
          onClick={() => router.push("/admin/settings/branding")}
          className="group mb-4 flex w-full cursor-pointer items-center gap-5 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
          style={{
            borderColor: "var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Store Branding</h2>
            </div>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Manage your store name and logo
            </p>
          </div>

          <ChevronRight
            size={21}
            className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            style={{
              color: "var(--text-secondary)",
            }}
          />
        </button>

        {/* SETTINGS CARDS */}

        <div className="space-y-4">
          {sections.map((section) => {
            const sectionMeta = meta[section.key];

            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setOpenSection(section.key)}
                className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-secondary)",
                }}
              >
                {/* LEFT */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{section.title}</h2>

                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: "rgba(255,193,7,0.12)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {metaLoading ? "..." : sectionMeta.total}
                    </span>
                  </div>

                  <p
                    className="mt-1 text-sm"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {section.description}
                  </p>

                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {metaLoading
                      ? "Loading..."
                      : `${sectionMeta.active} active · ${sectionMeta.inactive} inactive`}
                  </p>
                </div>

                {/* ARROW */}

                <ChevronRight
                  size={21}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                  style={{
                    color: "var(--text-secondary)",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
