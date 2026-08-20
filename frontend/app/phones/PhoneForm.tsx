"use client";

import { useEffect, useState } from "react";

type Phone = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  imageUrl?: string | null;
  imageFileId?: string | null;
  isNewPhone: boolean;
  variant: string;
  ram: string;
  rom: string;
};

type PhoneFormProps = {
  editingPhone: Phone | null;
  onEditComplete: () => void;
};

type Setting = {
  _id: string;
  type: "variant" | "brand" | "ram" | "rom";
  value: string;
  isActive: boolean;
};

export default function PhoneForm({
  editingPhone,
  onEditComplete,
}: PhoneFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    variant: "",
    ram: "",
    rom: "",
    price: "",
    description: "",
    imageUrl: "",
    isNewPhone: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imageType, setImageType] = useState<"upload" | "url">("upload");

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageRemoved, setImageRemoved] = useState(false);

  const [status, setStatus] = useState("");

  const [settings, setSettings] = useState<Setting[]>([]);

  useEffect(() => {
    if (editingPhone) {
      setFormData({
        name: editingPhone.name,
        brand: editingPhone.brand,
        variant: editingPhone.variant,
        ram: editingPhone.ram,
        rom: editingPhone.rom,
        price: String(editingPhone.price),
        description: editingPhone.description,
        imageUrl: editingPhone.imageUrl || "",
        isNewPhone: editingPhone.isNewPhone,
      });

      setImageFile(null);

      setImageType(editingPhone.imageUrl ? "url" : "upload");

      // Show existing image
      setImagePreview(editingPhone.image);

      setStatus("");
    } else {
      setFormData({
        name: "",
        brand: "",
        variant: "",
        ram: "",
        rom: "",
        price: "",
        description: "",
        imageUrl: "",
        isNewPhone: false,
      });

      setImageFile(null);
      setImagePreview(null);
      setImageType("upload");
      setStatus("");
    }
  }, [editingPhone]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch("http://localhost:5000/api/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    });

    // Show URL preview immediately
    if (name === "imageUrl" && value) {
      setImagePreview(value);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImageFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);

    setFormData((current) => ({
      ...current,
      imageUrl: "",
    }));

    // Reset file input
    const fileInput = document.getElementById(
      "phone-image",
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      variant: "",
      ram: "",
      rom: "",
      price: "",
      description: "",
      imageUrl: "",
      isNewPhone: false,
    });

    setImageFile(null);
    setImagePreview(null);
    setImageType("upload");
    setStatus("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setStatus(editingPhone ? "Updating phone..." : "Adding phone...");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("variant", formData.variant);
      data.append("ram", formData.ram);
      data.append("rom", formData.rom);
      data.append("price", formData.price);
      data.append("description", formData.description);

      data.append("isNewPhone", String(formData.isNewPhone));

      if (imageType === "upload" && imageFile) {
        data.append("image", imageFile);
      }

      if (imageType === "url" && formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      if (imageRemoved) {
        data.append("imageRemoved", "true");
      }

      const url = editingPhone
        ? `http://localhost:5000/api/phones/${editingPhone._id}`
        : "http://localhost:5000/api/phones";

      const method = editingPhone ? "PUT" : "POST";

      const token = localStorage.getItem("adminToken");

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      setStatus(
        editingPhone
          ? "Phone updated successfully."
          : "Phone added successfully.",
      );

      resetForm();

      if (editingPhone) {
        onEditComplete();
      }

      window.location.reload();
    } catch (error) {
      console.error("Phone form error:", error);

      setStatus(
        editingPhone ? "Failed to update phone." : "Failed to add phone.",
      );
    }
  };

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {editingPhone ? "Edit Phone" : "Add Phone"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name / Brand / Price */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Phone name"
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Select Brand</option>

            {settings
              .filter((setting) => setting.type === "brand" && setting.isActive)
              .map((setting) => (
                <option key={setting._id} value={setting.value}>
                  {setting.value}
                </option>
              ))}
          </select>

          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        {/* Variant / RAM / ROM */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Select Variant</option>

            {settings
              .filter(
                (setting) => setting.type === "variant" && setting.isActive,
              )
              .map((setting) => (
                <option key={setting._id} value={setting.value}>
                  {setting.value}
                </option>
              ))}
          </select>

          <select
            name="ram"
            value={formData.ram}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Select RAM</option>

            {settings
              .filter((setting) => setting.type === "ram" && setting.isActive)
              .map((setting) => (
                <option key={setting._id} value={setting.value}>
                  {setting.value}
                </option>
              ))}
          </select>

          <select
            name="rom"
            value={formData.rom}
            onChange={handleChange}
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            <option value="">Select ROM</option>

            {settings
              .filter((setting) => setting.type === "rom" && setting.isActive)
              .map((setting) => (
                <option key={setting._id} value={setting.value}>
                  {setting.value}
                </option>
              ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          required
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        />

        {/* Image */}
        <div>
          <p className="mb-2 text-sm font-semibold">Phone Image</p>

          <div className="mb-3 flex gap-5 text-sm">
            <label
              className="flex cursor-pointer items-center gap-2"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="radio"
                name="imageType"
                checked={imageType === "upload"}
                onChange={() => {
                  setImageType("upload");

                  if (!imageFile && editingPhone) {
                    setImagePreview(editingPhone.image);
                  }
                }}
              />
              Upload from computer
            </label>

            <label
              className="flex cursor-pointer items-center gap-2"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              <input
                type="radio"
                name="imageType"
                checked={imageType === "url"}
                onChange={() => {
                  setImageType("url");

                  if (formData.imageUrl) {
                    setImagePreview(formData.imageUrl);
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
              Use image URL
            </label>
          </div>

          {/* Upload */}
          {imageType === "upload" && (
            <input
              id="phone-image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!editingPhone}
              className="w-full cursor-pointer rounded-lg border px-3 py-2 text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          )}

          {/* URL */}
          {imageType === "url" && (
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL"
              type="url"
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div
              className="mt-4 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Image Preview</p>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition"
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  Remove Image
                </button>
              </div>

              <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={imagePreview}
                  alt="Phone preview"
                  className="h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* New Phone */}
        <label
          className="flex cursor-pointer items-center gap-2 text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          <input
            name="isNewPhone"
            type="checkbox"
            checked={formData.isNewPhone}
            onChange={handleChange}
          />

          <span>New Phone</span>
        </label>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="theme-accent-hover cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            {editingPhone ? "Update Phone" : "Add Phone"}
          </button>

          {status && (
            <p
              className="text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {status}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
