"use client";

import { CircleChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PhoneManagement from "../../components/PhoneManagement";

export default function ManagePhonesPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen py-8 px-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* BACK TO DASHBOARD outer Manage Phones */}
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors hover:!text-[var(--accent-color)]"
          style={{
            color: "var(--text-primary)",
          }}
        >
          <CircleChevronLeft size={18} />
          Back to Dashboard
        </button>

        <PhoneManagement />
      </div>
    </main>
  );
}
