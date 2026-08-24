import { Smartphone, Info, Mail, LogIn } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="px-6 py-10"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Footer container */}

      <div
        className="mx-auto max-w-7xl rounded-3xl border p-6 sm:p-8"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Main footer content */}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Brand */}

          <div>
            <h2
              className="text-xl font-bold"
              style={{
                color: "var(--text-primary)",
              }}
            >
              Sangam
            </h2>

            <p
              className="mt-2 text-sm"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Technology made personal.
            </p>
          </div>

          {/* Footer links */}

          <div className="flex flex-wrap gap-x-3 gap-y-4 text-sm">
            <a
              href="#phones"
              className="flex items-center gap-2 transition hover:text-yellow-600"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <Smartphone size={17} />
              Phones
            </a>

            <a
              href="#about"
              className="flex items-center gap-2 transition hover:text-yellow-600"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <Info size={17} />
              About
            </a>

            <a
              href="#contact"
              className="flex items-center gap-2 transition hover:text-yellow-600"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <Mail size={17} />
              Contact
            </a>

            <a
              href="/admin/login"
              className="nav-link flex items-center gap-2 transition"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <LogIn size={17} />
              Admin Auth
            </a>
          </div>
        </div>

        {/* Copyright */}

        <div
          className="mt-8 border-t pt-6 text-sm"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          © 2026 Sangam Mobiles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
