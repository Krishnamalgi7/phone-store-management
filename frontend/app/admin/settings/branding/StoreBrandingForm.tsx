"use client";

import { useState } from "react";
import { Pencil, Upload, X } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export default function StoreBrandingForm() {
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [brandingSaving, setBrandingSaving] = useState(false);
  const [message, setMessage] = useState("");

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

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* BRANDING FIELDS */}

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
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
            className="flex h-25 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-opacity hover:opacity-70"
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

      {/* MESSAGE */}

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

      {/* SAVE */}

      <div
        className="mt-6 flex justify-end border-t pt-5"
        style={{
          borderColor: "var(--border-color)",
        }}
      >
        <button
          type="button"
          onClick={handleSaveBranding}
          disabled={brandingSaving}
          className="theme-accent-hover flex cursor-pointer items-center gap-2 rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--button-text)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Pencil size={17} />
          {brandingSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}