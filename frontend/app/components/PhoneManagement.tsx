"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ManagePhoneList from "../phones/ManagePhoneList";

type ReferenceValue =
  | string
  | {
      _id: string;
      name?: string;
      value?: string;
    };

type Phone = {
  _id: string;
  name: string;

  brand?: ReferenceValue;
  brandId?: ReferenceValue;

  price: number;
  description: string;

  image: string;
  imageUrl?: string | null;
  imageFileId?: string | null;

  isNewPhone: boolean;
  isActive: boolean;

  variant?: ReferenceValue;
  variantId?: ReferenceValue;

  ram?: ReferenceValue;
  ramId?: ReferenceValue;

  rom?: ReferenceValue;
  romId?: ReferenceValue;
};

export default function PhoneManagement() {
  const router = useRouter();

  return (
    <section
      className="mx-auto max-w-7xl px-8 pb-16"
      style={{
        color: "var(--text-primary)",
      }}
    >
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Manage Phones
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Add, update, or delete phones.
          </p>
        </div>

        {/* ADD PHONE
            IMPORTANT:
            This goes to the existing Add Phone PAGE.
            No popup.
        */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/phones/add")
          }
          className="theme-accent-hover flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-primary)",
          }}
        >
          <Plus
            size={16}
            strokeWidth={2.2}
          />

          Add Phone
        </button>
      </div>

      {/* EXISTING PHONES */}

      <ManagePhoneList
        onEdit={(phone: Phone) => {
          /*
           * Edit goes to the existing EDIT PAGE.
           * No popup.
           */
          router.push(
            `/admin/phones/edit/${phone._id}`,
          );
        }}
        refreshKey={0}
      />
    </section>
  );
}