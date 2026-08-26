"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import PhoneForm from "../../../phones/PhoneForm";

export default function AddPhonePage() {
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
      <div className="mx-auto max-w-5xl px-8 py-6">
        {/* BACK */}
        <button
          type="button"
          onClick={() =>
            router.push("/admin/phones")
          }
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-semibold transition-colors hover:!text-[var(--accent-color)]"
  style={{
    color: "var(--text-primary)",
  }}
>
  <ArrowLeft size={18} />
  Back to Manage Phones
</button>

        {/* EXISTING PHONE FORM */}
        <PhoneForm
          editingPhone={null}
          onEditComplete={() =>
            router.push("/admin/phones")
          }
        />
      </div>
    </main>
  );
}