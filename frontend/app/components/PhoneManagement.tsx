"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import PhoneForm from "../phones/PhoneForm";
import ManagePhoneList from "../phones/ManagePhoneList";

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

export default function PhoneManagement() {
  const [showManager, setShowManager] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);

  const openAddForm = () => {
    setEditingPhone(null);
    setShowForm(true);
  };

  const openEditForm = (phone: Phone) => {
    setEditingPhone(phone);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingPhone(null);
  };

  const handleFormComplete = () => {
    closeForm();
  };

  return (
    <section
      className="mx-auto max-w-7xl px-8 pb-16"
      style={{
        color: "var(--text-primary)",
      }}
    >
      {/* Manage Phones Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            setShowManager((current) => !current);
            closeForm();
          }}
          className="theme-accent-hover cursor-pointer rounded-full px-6 py-3 text-sm font-semibold transition"
          style={{
            backgroundColor: "var(--text-primary)",
            color: "var(--bg-primary)",
          }}
        >
          {showManager ? "Close Management" : "Manage Phones"}
        </button>
      </div>

      {/* Management Section */}
      {showManager && (
        <div
          className="mt-8 rounded-2xl border p-6 shadow-sm"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Manage Phones</h2>

              <p
                className="mt-1 text-sm"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                Add, update, or delete phones.
              </p>
            </div>

            {/* Add Phone */}
            <button
              type="button"
              onClick={openAddForm}
              className="theme-accent-hover flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
              style={{
                backgroundColor: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              <Plus size={16} strokeWidth={2.2} />
              Add Phone
            </button>
          </div>

          {/* Existing Phones */}
          <div
            className="mt-8 border-t pt-6"
            style={{
              borderColor: "var(--border-color)",
            }}
          >
            <ManagePhoneList onEdit={openEditForm} />
          </div>
        </div>
      )}

      {/* Add / Edit Popup */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeForm}
              className="theme-accent-hover absolute right-5 top-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                
              }}
              aria-label="Close"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Form */}
            <PhoneForm
              editingPhone={editingPhone}
              onEditComplete={handleFormComplete}
            />
          </div>
        </div>
      )}
    </section>
  );
}
