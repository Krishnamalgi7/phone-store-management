"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

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

type ManagePhoneListProps = {
  onEdit: (phone: Phone) => void;
};

export default function ManagePhoneList({ onEdit }: ManagePhoneListProps) {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneToDelete, setPhoneToDelete] = useState<Phone | null>(null);

  const fetchPhones = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/phones");

      const data = await response.json();

      setPhones(data.phones);
      
    } catch (error) {
      console.error("Failed to fetch phones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const confirmDelete = async () => {
    if (!phoneToDelete) {
      return;
    }

    const id = phoneToDelete._id;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`http://localhost:5000/api/phones/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete phone");
      }

      setPhones((currentPhones) =>
        currentPhones.filter((phone) => phone._id !== id),
      );

      setPhoneToDelete(null);
    } catch (error) {
      console.error("Delete phone error:", error);
    }
  };

  if (loading) {
    return <p className="mt-12">Loading phones...</p>;
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold">Existing Phones</h2>

      <div className="mt-8 space-y-4">
        {phones.map((phone) => (
          <div
            key={phone._id}
            className="flex items-center gap-6 rounded-2xl border p-5"
          >
            <img
              src={phone.image}
              alt={phone.name}
              className="h-24 w-24 rounded-xl object-contain"
            />

            <div className="flex-1">
              <p className="text-sm text-gray-500">{phone.brand}</p>

              <h3 className="text-xl font-bold">{phone.name}</h3>

              <p className="mt-1">₹{phone.price.toLocaleString("en-IN")}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => onEdit(phone)}
                className="cursor-pointer rounded-full bg-black px-5 py-2 text-white hover:bg-amber-300"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => setPhoneToDelete(phone)}
                className="cursor-pointer rounded-full border border-red-500 px-5 py-2 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Delete Confirmation Modal */}
      {phoneToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPhoneToDelete(null);
            }
          }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPhoneToDelete(null)}
              className="theme-accent-hover absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-primary)",
              }}
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Content */}
            <div className="pr-10">
              <h2 className="text-xl font-bold">Delete Phone?</h2>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Are you sure you want to delete{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {phoneToDelete.name}
                </span>
                ?
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPhoneToDelete(null)}
                className="cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  backgroundColor: "transparent",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                className="cursor-pointer rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
