"use client";

import { useState } from "react";

export default function AddPhone() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    description: "",
    imageUrl: "",
    isNewPhone: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState<"upload" | "url">("upload");
  const [status, setStatus] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    });
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;

    setImageFile(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setStatus("Adding phone...");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append(
        "isNewPhone",
        String(formData.isNewPhone)
      );

      if (imageType === "upload" && imageFile) {
        data.append("image", imageFile);
      }

      if (imageType === "url" && formData.imageUrl) {
        data.append("imageUrl", formData.imageUrl);
      }

      const response = await fetch(
        "http://localhost:5000/api/phones",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to add phone"
        );
      }

      setStatus("Phone added successfully.");

      setFormData({
        name: "",
        brand: "",
        price: "",
        description: "",
        imageUrl: "",
        isNewPhone: false,
      });

      setImageFile(null);
    } catch (error) {
      console.error("Add phone error:", error);

      setStatus("Failed to add phone.");
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h2 className="text-3xl font-bold">
        Add Phone
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Phone name"
          required
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          required
          className="w-full rounded-xl border px-4 py-3"
        />

        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full rounded-xl border px-4 py-3"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          required
          className="w-full rounded-xl border px-4 py-3"
        />

        {/* Image selection */}
        <div className="space-y-4">
          <p className="font-semibold">Phone Image</p>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageType"
                checked={imageType === "upload"}
                onChange={() => setImageType("upload")}
              />
              Upload from computer
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="imageType"
                checked={imageType === "url"}
                onChange={() => setImageType("url")}
              />
              Use image URL
            </label>
          </div>

          {imageType === "upload" && (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full rounded-xl border px-4 py-3"
            />
          )}

          {imageType === "url" && (
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Paste image URL"
              type="url"
              required
              className="w-full rounded-xl border px-4 py-3"
            />
          )}
        </div>

        <label className="flex items-center gap-2">
          <input
            name="isNewPhone"
            type="checkbox"
            checked={formData.isNewPhone}
            onChange={handleChange}
          />

          <span>New Phone</span>
        </label>

        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 font-semibold text-white"
        >
          Add Phone
        </button>

        {status && (
          <p className="text-sm">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}