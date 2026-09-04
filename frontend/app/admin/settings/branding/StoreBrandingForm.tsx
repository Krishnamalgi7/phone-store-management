"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Upload, X } from "lucide-react";
import Loader from "../../../../components/Loader";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export default function StoreBrandingForm() {
  const [currentBrandName, setCurrentBrandName] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  const [editing, setEditing] = useState(false);

  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/store-settings`);

        if (!response.ok) {
          throw new Error("Failed to fetch store branding");
        }

        const data = await response.json();

        setCurrentBrandName(data.brandName || "");
        setCurrentLogo(
          data.logo ? `${process.env.NEXT_PUBLIC_API_URL}${data.logo}` : "",
        );
      } catch (error) {
        console.error("Failed to fetch store branding:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranding();
  }, []);

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

      setCurrentBrandName(result.setting.brandName);

      setCurrentLogo(
        result.setting.logo
          ? `${process.env.NEXT_PUBLIC_API_URL}${result.setting.logo}`
          : "",
      );

      setMessage("Store branding updated successfully.");
      setEditing(false);
    } catch (error) {
      console.error("Save branding error:", error);
      setMessage("Failed to update store branding.");
    } finally {
      setBrandingSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      {!editing ? (
        /* CURRENT BRANDING */
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Current Branding</h2>

              <p
                className="mt-2 text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Your currently active store identity.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setBrandName(currentBrandName);
                setLogoPreview(currentLogo);
                setLogo(null);
                setMessage("");
                setEditing(true);
              }}
              className="theme-accent-hover flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2 font-semibold transition"
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>

          <div className="mt-6 flex items-center gap-6">
            <div
              className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              {currentLogo ? (
                <img
                  src={currentLogo}
                  alt={currentBrandName}
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlus
                  size={25}
                  style={{
                    color: "var(--text-secondary)",
                  }}
                />
              )}
            </div>

            <div>
              <p className="text-lg font-semibold">
                {currentBrandName || "No brand name"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* EDIT BRANDING */
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Edit Store Branding</h2>

            <p
              className="mt-1 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Update your store name and logo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* BRAND NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Brand Name
              </label>

              <input
                type="text"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="Enter brand name"
                className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-1 focus:ring-accent"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>

            {/* LOGO */}

            <div>
              <label className="mb-2 block text-sm font-medium">Logo</label>

              <label
                className="flex h-25 cursor-pointer flex-col items-center justify-center rounded-xl border  transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {logoPreview ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-16 max-w-[160px] object-contain"
                    />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setLogo(null);
                        setLogoPreview("");
                      }}
                      className="absolute right-2 top-2 flex cursor-pointer items-center justify-center rounded-full border p-1.5 transition-opacity hover:opacity-70"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="mb-2 flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--accent-color)",
                      }}
                    >
                      <Upload size={18} />
                    </div>

                    <span className="text-sm font-semibold">
                      Choose your logo
                    </span>

                    <span
                      className="mt-1 text-xs"
                      style={{
                        color: "var(--text-secondary)",
                      }}
                    >
                      PNG, JPG or WEBP
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (!file) {
                      return;
                    }

                    setLogo(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                  className="sr-only"
                />
              </label>
            </div>
          </div>

          {message && (
            <div
              className="mt-5 rounded-xl border px-4 py-3 text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              {message}
            </div>
          )}

          <div
            className="mt-6 flex justify-end gap-3 border-t pt-5"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setLogo(null);
                setLogoPreview("");
                setMessage("");
              }}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-3 py-3 font-semibold text-white transition hover:bg-red-500 hover:text-white"
              style={{
                border: "1px solid var(--border-color)",
              }}
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveBranding}
              disabled={brandingSaving}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-black px-3 py-3 font-semibold text-white transition hover:bg-yellow-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                border: "1px solid var(--border-color)",
              }}
            >
              <Pencil size={17} />
              {brandingSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
