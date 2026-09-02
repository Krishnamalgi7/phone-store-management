"use client";

import { useEffect, useRef, useState } from "react";
import {
  House,
  Smartphone,
  Info,
  Mail,
  Settings,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [theme, setTheme] = useState("default");

  const [brandName, setBrandName] = useState("Phone Store");
  const [logo, setLogo] = useState("/logo.png");
  const [adminName, setAdminName] = useState("");

  const settingsRef = useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------
   * LOGIN
   * ---------------------------------------------
   */

  const handleLogin = () => {
    window.location.href = "/admin/login";
  };

  useEffect(() => {
    const adminData = localStorage.getItem("admin");

    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        setAdminName(admin.name);
      } catch (error) {
        console.error("Failed to read admin data:", error);
        setAdminName("");
      }
    } else {
      setAdminName("");
    }
  }, []);

  /*
   * ---------------------------------------------
   * NAVIGATION
   * ---------------------------------------------
   */

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  /*
   * ---------------------------------------------
   * THEME
   * ---------------------------------------------
   */

  const changeTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);

    if (selectedTheme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", selectedTheme);
    }

    setIsSettingsOpen(false);
  };

  /*
   * ---------------------------------------------
   * CLOSE SETTINGS WHEN CLICKING OUTSIDE
   * ---------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchStoreBranding = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/store-settings`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch store branding");
        }

        const data = await response.json();

        setBrandName(data.brandName);
        setLogo(`${process.env.NEXT_PUBLIC_API_URL}${data.logo}`);
      } catch (error) {
        console.error("Failed to fetch store branding:", error);
      }
    };

    fetchStoreBranding();
  }, []);

  return (
    <div className="relative mx-auto mt-4 flex w-full max-w-7xl items-center gap-3">
      
      <nav

  className="flex min-w-0 flex-1 items-center justify-between rounded-full border px-7 py-4 shadow-sm"
        style={{
          backgroundColor: "var(--bg-primary)",

          borderColor: "var(--border-color)",

          color: "var(--text-primary)",
        }}
      >
        {/* LOGO */}

        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt={brandName} className="h-10 w-auto object-contain rounded-xl" />

          <span
            className="text-2xl font-bold"
            style={{
              color: "var(--text-primary)",
            }}
          >
            {brandName}
          </span>
        </a>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div className="ml-auto flex items-center gap-5">
          {/* HOME */}

          <a
            href="#home"
            className="nav-link flex items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <House size={18} />
            Home
          </a>

          {/* PHONES */}

          <a
            href="#phones"
            className="nav-link flex items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Smartphone size={18} />
            Phones
          </a>

          {/* ABOUT */}

          <a
            href="#about"
            className="nav-link flex items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Info size={18} />
            About
          </a>

          {/* CONTACT */}

          <a
            href="#contact"
            className="nav-link flex items-center gap-2 transition"
            style={{
              color: "var(--text-primary)",
            }}
          >
            <Mail size={18} />
            Contact
          </a>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
          ================================================== */}

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto cursor-pointer rounded-full p-2 transition hover:bg-gray-100 hover:text-yellow-600 md:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* SETTINGS */}

        <div ref={settingsRef} className="relative z-[100] ml-2">
          {/* SETTINGS BUTTON */}

          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="cursor-pointer rounded-full p-3 shadow-md transition hover:bg-gray-100 hover:text-yellow-600"
            style={{
              backgroundColor: "var(--bg-primary)",

              color: "var(--text-primary)",
            }}
            aria-label="Open settings"
          >
            <Settings size={22} />
          </button>

          {/* SETTINGS MENU */}

          {isSettingsOpen && (
            <div
              className="absolute right-0 top-14 w-56 rounded-2xl border p-4 shadow-2xl"
              style={{
                backgroundColor: "var(--bg-primary)",

                borderColor: "var(--border-color)",

                color: "var(--text-primary)",
              }}
            >
              <h2
                className="mb-3 text-sm font-semibold"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                Select Theme
              </h2>

              {/* DEFAULT */}

              <button
                type="button"
                onClick={() => changeTheme("default")}
                className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
              >
                <span>Default</span>

                {theme === "default" && (
                  <span
                    style={{
                      color: "var(--accent-color)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>

              {/* DARK */}

              <button
                type="button"
                onClick={() => changeTheme("dark")}
                className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
              >
                <span>Dark</span>

                {theme === "dark" && (
                  <span
                    style={{
                      color: "var(--accent-color)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>

              {/* OCEAN */}

              <button
                type="button"
                onClick={() => changeTheme("ocean")}
                className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
              >
                <span>ocean</span>

                {theme === "ocean" && (
                  <span
                    style={{
                      color: "var(--accent-color)",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </nav>

      {adminName ? (
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-3 rounded-full border px-5 py-4 font-medium"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          >
            Welcome, {adminName}
          </div>

          <button
            type="button"
            onClick={() => (window.location.href = "/admin/dashboard")}
            className="flex cursor-pointer items-center justify-center rounded-full border p-3 transition hover:opacity-80"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
            aria-label="Open Admin Panel"
            title="Admin Panel"
          >
            <LayoutDashboard size={20} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className="theme-accent-hover flex cursor-pointer items-center gap-3 rounded-full border px-5 py-4 font-medium transition"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderColor: "var(--border-color)",
          }}
        >
          <LogIn size={18} />
          Login
        </button>
      )}

      {/* =================================================
          MOBILE MENU
      ================================================== */}

      {isMenuOpen && (
        <div
          className="absolute right-4 top-20 z-40 w-56 rounded-2xl border p-4 shadow-2xl md:hidden"
          style={{
            backgroundColor: "var(--bg-primary)",

            borderColor: "var(--border-color)",

            color: "var(--text-primary)",
          }}
        >
          <div className="flex flex-col gap-2">
            {/* HOME */}

            <a
              href="#home"
              onClick={handleNavClick}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <House size={18} />
              Home
            </a>

            {/* PHONES */}

            <a
              href="#phones"
              onClick={handleNavClick}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <Smartphone size={18} />
              Phones
            </a>

            {/* ABOUT */}

            <a
              href="#about"
              onClick={handleNavClick}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <Info size={18} />
              About
            </a>

            {/* CONTACT */}

            <a
              href="#contact"
              onClick={handleNavClick}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <Mail size={18} />
              Contact
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
