"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  isNewPhone: boolean;
};

export default function PhoneDetailsPage() {
  const params = useParams();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/phones/${params.id}`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch phone",
          );
        }

        setPhone(data);
      } catch (error) {
        console.error("Phone details error:", error);
        setError("Unable to load phone details.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPhone();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Loading phone details...
        </p>
      </main>
    );
  }

  if (error || !phone) {
    return (
      <main
        className="flex min-h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
        }}
      >
        <p>{error || "Phone not found."}</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen px-6 py-10"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="grid gap-8 rounded-2xl border p-6 md:grid-cols-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex min-h-[400px] items-center justify-center rounded-xl">
            <img
              src={phone.image}
              alt={phone.name}
              className="max-h-[450px] w-full object-contain"
            />
          </div>

          <div>
            {phone.isNewPhone && (
              <span className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                New
              </span>
            )}

            <h1 className="text-3xl font-bold">
              {phone.name}
            </h1>

            <p
              className="mt-2 text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              {phone.brand}
            </p>

            <p className="mt-6 text-2xl font-bold">
              ₹{phone.price.toLocaleString("en-IN")}
            </p>

            <div
              className="mt-8 border-t pt-6"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <h2 className="text-xl font-semibold">
                Technical Details
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    Brand
                  </span>
                  <span className="font-medium">
                    {phone.brand}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    Variant
                  </span>
                  <span className="font-medium">
                    {phone.variant}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    RAM
                  </span>
                  <span className="font-medium">
                    {phone.ram}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span
                    style={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    ROM
                  </span>
                  <span className="font-medium">
                    {phone.rom}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-8 border-t pt-6"
              style={{
                borderColor: "var(--border-color)",
              }}
            >
              <h2 className="text-xl font-semibold">
                Description
              </h2>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {phone.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}