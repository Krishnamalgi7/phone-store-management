"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

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
};

type ManagePhoneListProps = {
  onEdit: (phone: Phone) => void;
};

export default function ManagePhoneList({
  onEdit,
}: ManagePhoneListProps) {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhones = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/phones"
      );

      const data = await response.json();

      setPhones(data);
    } catch (error) {
      console.error("Failed to fetch phones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this phone?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/phones/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete phone"
        );
      }

      setPhones((currentPhones) =>
        currentPhones.filter(
          (phone) => phone._id !== id
        )
      );
    } catch (error) {
      console.error("Delete phone error:", error);
    }
  };

  if (loading) {
    return (
      <p className="mt-12">
        Loading phones...
      </p>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold">
        Existing Phones
      </h2>

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
              <p className="text-sm text-gray-500">
                {phone.brand}
              </p>

              <h3 className="text-xl font-bold">
                {phone.name}
              </h3>

              <p className="mt-1">
                ₹{phone.price.toLocaleString("en-IN")}
              </p>
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
                onClick={() =>
                  handleDelete(phone._id)
                }
                className="cursor-pointer rounded-full border border-red-500 px-5 py-2 text-red-500 hover:bg-red-500 hover:text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}