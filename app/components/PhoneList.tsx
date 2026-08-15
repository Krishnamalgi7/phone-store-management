"use client";
import { useEffect, useState } from "react";

import PhoneCard from "./PhoneCard";

type Phone = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  image: string;
  isNewPhone: boolean;
};

export default function PhoneList() {
  const [phones, setPhones] = useState<Phone[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  useEffect(() => {
  const fetchPhones = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/phones", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch phones");
      }

      const data = await response.json();

      setPhones(data);
    } catch (error) {
      console.error("Error fetching phones:", error);
      setError("Unable to load phones.");
    } finally {
      setLoading(false);
    }
  };

  fetchPhones();
}, []);

  return (
    <section
  id="phones"
  className="px-6 py-12 md:px-12 lg:px-24"
  style={{
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  }}
>

      {/* Section container */}

      <div className="mx-auto max-w-7xl">

        {/* Section heading */}

        <h2
  className="text-3xl font-bold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Explore Our Phones
</h2>

        {/*phone grid */}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {loading && (
  <p
    className="col-span-full text-center"
    style={{
      color: "var(--text-secondary)",
    }}
  >
    Loading phones...
  </p>
)}

{error && (
  <p
    className="col-span-full text-center"
    style={{
      color: "var(--text-secondary)",
    }}
  >
    {error}
  </p>
)}

{!loading &&
  !error &&
  phones.map((phone) => (
    <PhoneCard
  key={phone._id}
  id={phone._id}
  brand={phone.brand}
  name={phone.name}
  description={phone.description}
  price={phone.price}
  image={phone.image}
  isNew={phone.isNewPhone}
/>
  ))}

        </div>

      </div>
    </section>
  );
}