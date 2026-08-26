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
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [theme, setTheme] =
    useState("default");

  const settingsRef =
    useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------
   * LOGIN
   * ---------------------------------------------
   */

  const handleLogin = () => {
    window.location.href =
      "/admin/login";
  };

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

  const changeTheme = (
    selectedTheme: string,
  ) => {
    setTheme(selectedTheme);

    if (
      selectedTheme === "default"
    ) {
      document.documentElement.removeAttribute(
        "data-theme",
      );
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        selectedTheme,
      );
    }

    setIsSettingsOpen(false);
  };

  /*
   * ---------------------------------------------
   * CLOSE SETTINGS WHEN CLICKING OUTSIDE
   * ---------------------------------------------
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div className="relative mx-auto mt-4 max-w-7xl">

      {/* =================================================
          PUBLIC NAVBAR
      ================================================== */}

      <nav
        className="flex items-center rounded-full border px-7 py-4 pr-20 shadow-sm"
        style={{
          backgroundColor:
            "var(--bg-primary)",

          borderColor:
            "var(--border-color)",

          color:
            "var(--text-primary)",
        }}
      >

        {/* LOGO */}

        <a
          href="#home"
          className="flex items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="Phone Store Nova"
            className="h-10 w-auto"
          />

          <span
            className="text-2xl font-bold"
            style={{
              color:
                "var(--text-primary)",
            }}
          >
            Phone Store
          </span>
        </a>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div className="ml-auto hidden items-center gap-7 md:flex">

          {/* HOME */}

          <a
            href="#home"
            className="nav-link flex items-center gap-2 transition"
            style={{
              color:
                "var(--text-primary)",
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
              color:
                "var(--text-primary)",
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
              color:
                "var(--text-primary)",
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
              color:
                "var(--text-primary)",
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
          onClick={() =>
            setIsMenuOpen(
              !isMenuOpen,
            )
          }
          className="ml-auto cursor-pointer rounded-full p-2 transition hover:bg-gray-100 hover:text-yellow-600 md:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </nav>

      {/* =================================================
          SETTINGS
      ================================================== */}

      <div
        ref={settingsRef}
        className="absolute right-3 top-4 z-50"
      >

        {/* SETTINGS BUTTON */}

        <button
          type="button"
          onClick={() =>
            setIsSettingsOpen(
              !isSettingsOpen,
            )
          }
          className="cursor-pointer rounded-full p-3 shadow-md transition hover:bg-gray-100 hover:text-yellow-600"
          style={{
            backgroundColor:
              "var(--bg-primary)",

            color:
              "var(--text-primary)",
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
              backgroundColor:
                "var(--bg-primary)",

              borderColor:
                "var(--border-color)",

              color:
                "var(--text-primary)",
            }}
          >
            <h2
              className="mb-3 text-sm font-semibold"
              style={{
                color:
                  "var(--text-primary)",
              }}
            >
              Select Theme
            </h2>

            {/* DEFAULT */}

            <button
              type="button"
              onClick={() =>
                changeTheme(
                  "default",
                )
              }
              className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
            >
              <span>
                Default
              </span>

              {theme ===
                "default" && (
                <span
                  style={{
                    color:
                      "var(--accent-color)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>

            {/* DARK */}

            <button
              type="button"
              onClick={() =>
                changeTheme(
                  "dark",
                )
              }
              className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
            >
              <span>
                Dark
              </span>

              {theme === "dark" && (
                <span
                  style={{
                    color:
                      "var(--accent-color)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>

            {/* OCEAN */}

            <button
              type="button"
              onClick={() =>
                changeTheme(
                  "ocean",
                )
              }
              className="theme-option flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition"
            >
              <span>
                ocean
              </span>

              {theme ===
                "ocean" && (
                <span
                  style={{
                    color:
                      "var(--accent-color)",
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          MOBILE MENU
      ================================================== */}

      {isMenuOpen && (
        <div
          className="absolute right-4 top-20 z-40 w-56 rounded-2xl border p-4 shadow-2xl md:hidden"
          style={{
            backgroundColor:
              "var(--bg-primary)",

            borderColor:
              "var(--border-color)",

            color:
              "var(--text-primary)",
          }}
        >
          <div className="flex flex-col gap-2">

            {/* HOME */}

            <a
              href="#home"
              onClick={
                handleNavClick
              }
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <House size={18} />
              Home
            </a>

            {/* PHONES */}

            <a
              href="#phones"
              onClick={
                handleNavClick
              }
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <Smartphone
                size={18}
              />
              Phones
            </a>

            {/* ABOUT */}

            <a
              href="#about"
              onClick={
                handleNavClick
              }
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-gray-100 hover:text-yellow-600"
            >
              <Info size={18} />
              About
            </a>

            {/* CONTACT */}

            <a
              href="#contact"
              onClick={
                handleNavClick
              }
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