"use client";

import { useEffect, useState } from "react";

type Phone = {
  _id: string;
  name: string;

  brand:
    | string
    | {
        _id: string;
        name: string;
      };

  brandId?: string;

  variant:
    | string
    | {
        _id: string;
        name: string;
      };

  variantId?: string;

  ram:
    | string
    | {
        _id: string;
        value: string;
      };

  ramId?: string;

  rom:
    | string
    | {
        _id: string;
        value: string;
      };

  romId?: string;

  price: number;
  description: string;
  image: string;
  imageUrl?: string | null;
  imageFileId?: string | null;
  isNewPhone: boolean;
};

type PhoneFormProps = {
  editingPhone: Phone | null;
  onEditComplete?: () => void;
};

type MasterItem = {
  _id: string;
  name?: string;
  value?: string;
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

  const [brands, setBrands] = useState<MasterItem[]>([]);

  const [variants, setVariants] = useState<MasterItem[]>([]);

  const [rams, setRams] = useState<MasterItem[]>([]);

  const [roms, setRoms] = useState<MasterItem[]>([]);

  /*
   * ------------------------------------------------
   * LOAD EDITING PHONE
   * ------------------------------------------------
   */

  useEffect(() => {
    if (editingPhone) {
      setFormData({
        name: editingPhone.name,

        brand:
          editingPhone.brandId ||
          (typeof editingPhone.brand === "string"
            ? editingPhone.brand
            : editingPhone.brand?._id || ""),

        variant:
          editingPhone.variantId ||
          (typeof editingPhone.variant === "string"
            ? editingPhone.variant
            : editingPhone.variant?._id || ""),

        ram:
          editingPhone.ramId ||
          (typeof editingPhone.ram === "string"
            ? editingPhone.ram
            : editingPhone.ram?._id || ""),

        rom:
          editingPhone.romId ||
          (typeof editingPhone.rom === "string"
            ? editingPhone.rom
            : editingPhone.rom?._id || ""),

        price: String(editingPhone.price),

        description: editingPhone.description,

        imageUrl: editingPhone.imageUrl || "",

        isNewPhone: editingPhone.isNewPhone,
      });

      setImageFile(null);

      setImageType(editingPhone.imageUrl ? "url" : "upload");

      setImagePreview(editingPhone.image);

      setImageRemoved(false);
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
      setImageRemoved(false);
      setStatus("");
    }
  }, [editingPhone]);

  /*
   * ------------------------------------------------
   * FETCH BRAND / VARIANT / RAM / ROM
   * ------------------------------------------------
   */

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [brandsResponse, variantsResponse, ramsResponse, romsResponse] =
          await Promise.all([
            fetch("http://localhost:5000/api/brands?page=1&limit=100", {
              headers,
            }),

            fetch("http://localhost:5000/api/variants?page=1&limit=100", {
              headers,
            }),

            fetch("http://localhost:5000/api/rams?page=1&limit=100", {
              headers,
            }),

            fetch("http://localhost:5000/api/roms?page=1&limit=100", {
              headers,
            }),
          ]);

        const [brandsData, variantsData, ramsData, romsData] =
          await Promise.all([
            brandsResponse.json(),
            variantsResponse.json(),
            ramsResponse.json(),
            romsResponse.json(),
          ]);

        if (
          !brandsResponse.ok ||
          !variantsResponse.ok ||
          !ramsResponse.ok ||
          !romsResponse.ok
        ) {
          throw new Error("Failed to fetch master data");
        }

        setBrands(brandsData.items || []);

        setVariants(variantsData.items || []);

        setRams(ramsData.items || []);

        setRoms(romsData.items || []);
      } catch (error) {
        console.error("Master data error:", error);

        setStatus("Failed to load phone options.");
      }
    };

    fetchMasterData();
  }, []);

  /*
   * ------------------------------------------------
   * HANDLE INPUT
   * ------------------------------------------------
   */

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

    if (name === "imageUrl" && value) {
      setImagePreview(value);
      setImageRemoved(false);
    }
  };

  /*
   * ------------------------------------------------
   * HANDLE IMAGE FILE
   * ------------------------------------------------
   */

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setImageFile(file);

    setImageRemoved(false);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  /*
   * ------------------------------------------------
   * REMOVE IMAGE
   * ------------------------------------------------
   */

  const handleRemoveImage = () => {
    setImageFile(null);

    setImagePreview(null);

    setImageRemoved(true);

    setFormData((current) => ({
      ...current,
      imageUrl: "",
    }));

    const fileInput = document.getElementById(
      "phone-image",
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  };

  /*
   * ------------------------------------------------
   * RESET FORM
   * ------------------------------------------------
   */

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

    setImageRemoved(false);

    setStatus("");
  };

  /*
   * ------------------------------------------------
   * SUBMIT
   * ------------------------------------------------
   */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setStatus(editingPhone ? "Updating phone..." : "Adding phone...");

      const data = new FormData();

      data.append("name", formData.name);

      /*
       * Send reference IDs
       */
      data.append("brandId", formData.brand);

      data.append("variantId", formData.variant);

      data.append("ramId", formData.ram);

      data.append("romId", formData.rom);

      data.append("price", formData.price);

      data.append("description", formData.description);

      data.append("isNewPhone", String(formData.isNewPhone));

      /*
       * Upload image
       */
      if (imageType === "upload" && imageFile) {
        data.append("image", imageFile);
      }

      /*
       * Image URL
       */
      if (imageType === "url" && formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      /*
       * Image removed
       */
      if (imageRemoved) {
        data.append("imageRemoved", "true");
      }

      const url = editingPhone
        ? `http://localhost:5000/api/phones/${editingPhone._id}`
        : "http://localhost:5000/api/phones";

      const method = editingPhone ? "PUT" : "POST";

      const token = localStorage.getItem("adminToken");

      //temp debug logs for check
      // console.log("EDIT PHONE FORM DATA:", formData);
      // console.log("RAM ID BEING SENT:", formData.ram);
      // console.log("ROM ID BEING SENT:", formData.rom);

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

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
        onEditComplete?.();
        return;
      }

      // Add Phone successful
      onEditComplete?.();
    } catch (error) {
      console.error("Phone form error:", error);

      setStatus(
        editingPhone ? "Failed to update phone." : "Failed to add phone.",
      );
    }
  };

  /*
   * ------------------------------------------------
   * UI
   * ------------------------------------------------
   */

  return (
    <section
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: "var(--bg-secondary)",

        color: "var(--text-primary)",

        borderColor: "var(--border-color)",

        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* TITLE */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME / BRAND / VARIANT */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* PHONE NAME */}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Phone name"
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          />

          {/* BRAND */}

          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full cursor-pointer rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          >
            <option value="">Select Brand</option>

            {brands
              .filter((brand) => brand.isActive)
              .map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
          </select>

          {/* VARIANT */}

          <select
            name="variant"
            value={formData.variant}
            onChange={handleChange}
            required
            className="w-full cursor-pointer rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          >
            <option value="">Select Variant</option>

            {variants
              .filter((variant) => variant.isActive)
              .map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.name}
                </option>
              ))}
          </select>
        </div>

        {/* RAM / ROM / PRICE */}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* RAM */}

          <select
            name="ram"
            value={formData.ram}
            onChange={handleChange}
            required
            className="w-full cursor-pointer rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          >
            <option value="">Select RAM</option>

            {rams
              .filter((ram) => ram.isActive)
              .map((ram) => (
                <option key={ram._id} value={ram._id}>
                  {ram.value}
                </option>
              ))}
          </select>

          {/* ROM */}

          <select
            name="rom"
            value={formData.rom}
            onChange={handleChange}
            required
            className="w-full cursor-pointer rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          >
            <option value="">Select ROM</option>

            {roms
              .filter((rom) => rom.isActive)
              .map((rom) => (
                <option key={rom._id} value={rom._id}>
                  {rom.value}
                </option>
              ))}
          </select>

          {/* PRICE */}

          <input
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",

              borderColor: "var(--border-color)",

              outlineColor: "var(--accent-color)",
            }}
          />
        </div>

        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={3}
          required
          className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-1"
          style={{
            backgroundColor: "var(--bg-primary)",

            color: "var(--text-primary)",

            borderColor: "var(--border-color)",

            outlineColor: "var(--accent-color)",
          }}
        />

        {/* PHONE IMAGE */}

        <div>
          <p
            className="mb-2 text-sm font-semibold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            Phone Image
          </p>

          {/* IMAGE TYPE */}

          <div className="mb-3 flex gap-5 text-sm">
            {/* UPLOAD */}

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
                className="cursor-pointer accent-[var(--accent-color)]"
              />
              Upload from computer
            </label>

            {/* URL */}

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
                className="cursor-pointer accent-[var(--accent-color)]"
              />
              Use image URL
            </label>
          </div>

          {/* FILE INPUT */}

          {imageType === "upload" && (
            <label
              htmlFor="phone-image"
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--accent-color)",
                }}
              >
                ↑
              </div>
              <span className="text-sm font-semibold">
                Choose a phone image
              </span>
              <span
                className="mt-1 text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                PNG, JPG or WEBP
              </span>
              <input
                id="phone-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!editingPhone}
                className="sr-only"
              />
            </label>
          )}

          {/* URL INPUT */}

          {imageType === "url" && (
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/phone-image.jpg"
              type="url"
              required
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-1"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          )}

          {/* IMAGE PREVIEW */}

          {imagePreview && (
            <div
              className="mt-4 rounded-xl border p-4"
              style={{
                backgroundColor: "var(--bg-primary)",

                borderColor: "var(--border-color)",
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Image Preview
                </p>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition hover:opacity-70"
                  style={{
                    color: "var(--text-primary)",

                    borderColor: "var(--border-color)",

                    backgroundColor: "var(--bg-secondary)",
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

        {/* NEW PHONE */}

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
            className="cursor-pointer accent-[var(--accent-color)]"
          />

          <span>New Phone</span>
        </label>

        {/* SUBMIT */}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="theme-accent-hover cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition"
            style={{
              backgroundColor: "var(--text-primary)",

              color: "var(--bg-primary)",

              border: "1px solid var(--border-color)",
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
