"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PhoneForm from "../../../../phones/PhoneForm";

type Phone = {
  _id: string;
  name: string;
  brand: string;
  variant: string;
  ram: string;
  rom: string;
  price: number;
  description: string;
  image: string;
  imageUrl?: string | null;
  imageFileId?: string | null;
  isNewPhone: boolean;
};

export default function EditPhonePage() {
  const router = useRouter();
  const params = useParams();

  const phoneId = params.id as string;

  const [phone, setPhone] =
    useState<Phone | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phones/${phoneId}`,
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch phone",
          );
        }

        setPhone(data);
      } catch (error) {
        console.error(
          "Failed to fetch phone:",
          error,
        );

        setError(
          "Unable to load phone.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (phoneId) {
      fetchPhone();
    }
  }, [phoneId]);

  if (loading) {
    return (
      <main
        className="min-h-screen p-8"
        style={{
          backgroundColor:
            "var(--bg-primary)",
          color:
            "var(--text-primary)",
        }}
      >
        Loading phone...
      </main>
    );
  }

  if (error || !phone) {
    return (
      <main
        className="min-h-screen p-8"
        style={{
          backgroundColor:
            "var(--bg-primary)",
          color:
            "var(--text-primary)",
        }}
      >
        <button
          type="button"
          onClick={() =>
            router.push("/admin/phones")
          }
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Manage Phones
        </button>

        <p className="mt-8">
          {error || "Phone not found."}
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor:
          "var(--bg-primary)",
        color:
          "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-5xl px-8 py-6">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/phones")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          <ArrowLeft size={18} />

          Back to Manage Phones
        </button>

        {/* EXISTING EDIT FORM */}
        <PhoneForm
          editingPhone={phone}
          onEditComplete={() =>
            router.push("/admin/phones")
          }
        />
      </div>
    </main>
  );
}