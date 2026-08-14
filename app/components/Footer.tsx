import { Smartphone, Info, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-6 py-10">

      {/* Footer container */}

      <div className="mx-auto max-w-7xl rounded-3xl border border-gray-200 bg-gray-100 p-6 sm:p-8">

        {/* Main footer content */}

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          {/* Brand */}

          <div>

            <h2 className="text-xl font-bold">
              NOVA
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Technology made personal.
            </p>

          </div>

          {/* Footer links */}

          <div className="flex flex-wrap gap-x-3 gap-y-4 text-sm">

            <a
              href="#phones"
              className="flex items-center gap-2 transition hover:text-yellow-600"
            >
              <Smartphone size={17} />
              Phones
            </a>

            <a
              href="#about"
              className="flex items-center gap-2 transition hover:text-yellow-600"
            >
              <Info size={17} />
              About
            </a>

            <a
              href="#contact"
              className="flex items-center gap-2 transition hover:text-yellow-600"
            >
              <Mail size={17} />
              Contact
            </a>

          </div>

        </div>

        {/* Copyright */}

        <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-500">
          © 2026 NOVA. All rights reserved.
        </div>

      </div>

    </footer>
  );
}