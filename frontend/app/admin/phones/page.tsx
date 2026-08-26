"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PhoneManagement from "../../components/PhoneManagement";

export default function ManagePhonesPage() {
  const router = useRouter();

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
      <div className="mx-auto max-w-7xl px-8 py-6">
        {/* BACK TO DASHBOARD */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/dashboard")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{
            color:
              "var(--text-primary)",
          }}
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

        <PhoneManagement />
      </div>
    </main>
  );
}