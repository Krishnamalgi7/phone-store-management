"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

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

type ManagePhoneListProps = {
  onEdit: (phone: Phone) => void;
  refreshKey: number;
};

const getReferenceText = (
  value?: ReferenceValue,
) => {
  if (!value) {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.name || value.value || "—";
};

export default function ManagePhoneList({
  onEdit,
  refreshKey,
}: ManagePhoneListProps) {
  const [phones, setPhones] = useState<Phone[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  /*
   * Phone selected for deletion.
   *
   * null = confirmation popup is closed
   */
  const [phoneToDelete, setPhoneToDelete] =
    useState<Phone | null>(null);

  /*
   * -----------------------------------------
   * FETCH PHONES
   * -----------------------------------------
   */
  const fetchPhones = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/phones",
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch phones",
        );
      }

      setPhones(
        Array.isArray(data.phones)
          ? data.phones
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to fetch phones:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fetch when component loads.
   *
   * refreshKey changes after an edit,
   * so the Existing Phones section gets
   * the latest data.
   */
  useEffect(() => {
    fetchPhones();
  }, [refreshKey]);

  /*
   * -----------------------------------------
   * TOGGLE ACTIVE / INACTIVE
   * -----------------------------------------
   */
  const togglePhoneStatus = async (
    phone: Phone,
  ) => {
    try {
      setUpdatingId(phone._id);

      const token =
        localStorage.getItem(
          "adminToken",
        );

      const response = await fetch(
        `http://localhost:5000/api/phones/${phone._id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update phone status",
        );
      }

      setPhones(
        (currentPhones) =>
          currentPhones.map(
            (currentPhone) =>
              currentPhone._id ===
              phone._id
                ? {
                    ...currentPhone,
                    isActive:
                      data.phone
                        ?.isActive ??
                      !currentPhone.isActive,
                  }
                : currentPhone,
          ),
      );
    } catch (error) {
      console.error(
        "Toggle phone status error:",
        error,
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /*
   * -----------------------------------------
   * DELETE PHONE
   * -----------------------------------------
   *
   * This function runs only after the user
   * confirms deletion in the popup.
   */
  const confirmDelete = async () => {
    if (!phoneToDelete) {
      return;
    }

    const id =
      phoneToDelete._id;

    try {
      const token =
        localStorage.getItem(
          "adminToken",
        );

      const response = await fetch(
        `http://localhost:5000/api/phones/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete phone",
        );
      }

      /*
       * Remove the deleted phone from the
       * screen immediately.
       */
      setPhones(
        (currentPhones) =>
          currentPhones.filter(
            (phone) =>
              phone._id !== id,
          ),
      );

      /*
       * Close confirmation popup.
       */
      setPhoneToDelete(null);
    } catch (error) {
      console.error(
        "Delete phone error:",
        error,
      );
    }
  };

  /*
   * -----------------------------------------
   * LOADING
   * -----------------------------------------
   */
  if (loading) {
    return (
      <p
        className="mt-12"
        style={{
          color:
            "var(--text-secondary)",
        }}
      >
        Loading phones...
      </p>
    );
  }

  /*
   * -----------------------------------------
   * UI
   * -----------------------------------------
   */
  return (
    <section className="mt-16">
      <h2
        className="text-3xl font-bold"
        style={{
          color:
            "var(--text-primary)",
        }}
      >
        Existing Phones
      </h2>

      <div className="mt-8 space-y-4">
        {phones.length === 0 ? (
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              backgroundColor:
                "var(--bg-secondary)",
              color:
                "var(--text-secondary)",
              borderColor:
                "var(--border-color)",
            }}
          >
            No phones found.
          </div>
        ) : (
          phones.map((phone) => {
            const brand =
              phone.brandId ||
              phone.brand;

            const variant =
              phone.variantId ||
              phone.variant;

            const ram =
              phone.ramId ||
              phone.ram;

            const rom =
              phone.romId ||
              phone.rom;

            return (
              <div
                key={phone._id}
                className="flex items-center gap-6 rounded-2xl border p-5 transition"
                style={{
                  backgroundColor:
                    "var(--bg-primary)",
                  borderColor:
                    "var(--border-color)",
                }}
              >
                {/* IMAGE */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                  {phone.image ? (
                    <img
                      src={phone.image}
                      alt={phone.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span
                      className="text-xs"
                      style={{
                        color:
                          "var(--text-secondary)",
                      }}
                    >
                      No image
                    </span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1">
                  <p
                    className="text-sm"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    {getReferenceText(
                      brand,
                    )}
                  </p>

                  <h3
                    className="text-xl font-bold"
                    style={{
                      color:
                        "var(--text-primary)",
                    }}
                  >
                    {phone.name}
                  </h3>

                  <p
                    className="mt-1"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    ₹
                    {phone.price.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  <div
                    className="mt-2 flex flex-wrap gap-2 text-xs"
                    style={{
                      color:
                        "var(--text-secondary)",
                    }}
                  >
                    <span>
                      {getReferenceText(
                        variant,
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      {getReferenceText(
                        ram,
                      )}{" "}
                      RAM
                    </span>

                    <span>•</span>

                    <span>
                      {getReferenceText(
                        rom,
                      )}{" "}
                      ROM
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex shrink-0 items-center gap-3">
                  {/* EDIT */}
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(phone)
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition"
                    style={{
                      backgroundColor:
                        "var(--text-primary)",
                      color:
                        "var(--bg-primary)",
                    }}
                  >
                    <Pencil
                      size={15}
                    />

                    Edit
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() =>
                      setPhoneToDelete(
                        phone,
                      )
                    }
                    className="flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                    style={{
                      color:
                        "rgb(239 68 68)",
                      borderColor:
                        "rgb(239 68 68)",
                    }}
                  >
                    <Trash2
                      size={15}
                    />

                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* =====================================
          DELETE CONFIRMATION POPUP
          ===================================== */}

      {phoneToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.55)",
          }}
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setPhoneToDelete(null);
            }
          }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border p-6 shadow-2xl"
            style={{
              backgroundColor:
                "var(--bg-primary)",
              color:
                "var(--text-primary)",
              borderColor:
                "var(--border-color)",
            }}
          >
            {/* CLOSE */}
            <button
              type="button"
              onClick={() =>
                setPhoneToDelete(null)
              }
              className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition"
              style={{
                color:
                  "var(--text-primary)",
              }}
              aria-label="Close"
            >
              <X
                size={20}
                strokeWidth={2.5}
              />
            </button>

            {/* CONTENT */}
            <div className="pr-10">
              <h2 className="text-xl font-bold">
                Delete Phone?
              </h2>

              <p
                className="mt-3 text-sm leading-6"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                Are you sure you want
                to delete{" "}
                <span
                  className="font-semibold"
                  style={{
                    color:
                      "var(--text-primary)",
                  }}
                >
                  {phoneToDelete.name}
                </span>
                ?
              </p>

              <p
                className="mt-2 text-xs"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              >
                This action cannot be
                undone.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-end gap-3">
              {/* CANCEL */}
              <button
                type="button"
                onClick={() =>
                  setPhoneToDelete(null)
                }
                className="cursor-pointer rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                style={{
                  borderColor:
                    "var(--border-color)",
                  color:
                    "var(--text-primary)",
                  backgroundColor:
                    "transparent",
                }}
              >
                Cancel
              </button>

              {/* CONFIRM DELETE */}
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