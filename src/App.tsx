import { useEffect, useState } from "react";
import {
  Menu,
  X,
  House,
  Smartphone,
  Info,
  Mail,
  Settings,
} from "lucide-react";

import Hero from "./components/Hero";
import PhoneSection from "./components/PhoneSection";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  // Controls whether the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Stores the currently selected theme
  const [theme, setTheme] = useState("default");

  // Controls whether the settings menu is visible
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply the selected theme to the HTML element
  useEffect(() => {
    if (theme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  // Close mobile menu after clicking a navigation link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <main>

      {/*  NAVBAR  */}

      <nav
        className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border px-6 py-4 shadow-sm"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-color)",
        }}
      >

        {/* Logo */}
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          NOVA
        </h1>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">

          {/* Home */}
          <a
            href="#home"
            className="flex items-center gap-2 text-sm font-medium transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <House size={17} />
            Home
          </a>

          {/* Phones */}
          <a
            href="#phones"
            className="flex items-center gap-2 text-sm font-medium transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <Smartphone size={17} />
            Phones
          </a>

          {/* About */}
          <a
            href="#about"
            className="flex items-center gap-2 text-sm font-medium transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <Info size={17} />
            About
          </a>

          {/* Contact */}
          <a
            href="#contact"
            className="flex items-center gap-2 text-sm font-medium transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <Mail size={17} />
            Contact
          </a>

        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer rounded-full p-2 transition hover:opacity-60 md:hidden"
          style={{ color: "var(--text-primary)" }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="cursor-pointer rounded-full p-2 transition hover:opacity-60"
          style={{ color: "var(--text-primary)" }}
          aria-label="Open settings"
        >
          <Settings size={20} />
        </button>

      </nav>

      {/* SETTINGS MENU */}

      {isSettingsOpen && (
        <div
          className="fixed right-6 top-20 z-50 w-56 rounded-2xl border p-4 shadow-2xl"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >

          {/* Settings title */}
          <h2 className="mb-3 text-sm font-semibold">
            Choose Theme
          </h2>

          {/* Default theme */}
          <button
            onClick={() => {
              setTheme("default");
              setIsSettingsOpen(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Default</span>

            {theme === "default" && (
              <span className="text-yellow-500">
                ✓
              </span>
            )}
          </button>

          {/* Dark theme */}
          <button
            onClick={() => {
              setTheme("dark");
              setIsSettingsOpen(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Dark</span>

            {theme === "dark" && (
              <span className="text-yellow-500">
                ✓
              </span>
            )}
          </button>

          {/* Gold theme */}
          <button
            onClick={() => {
              setTheme("gold");
              setIsSettingsOpen(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm transition hover:opacity-60"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Gold</span>

            {theme === "gold" && (
              <span className="text-yellow-500">
                ✓
              </span>
            )}
          </button>

        </div>
      )}

      {/*  MOBILE SIDEBAR  */}

      {isMenuOpen && (
        <div
          className="fixed right-6 top-20 z-50 w-56 rounded-2xl border p-4 shadow-2xl md:hidden"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >

          <div className="flex flex-col gap-2">

            {/* Home */}
            <a
              href="#home"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:opacity-60"
              style={{ color: "var(--text-primary)" }}
            >
              Home
            </a>

            {/* Phones */}
            <a
              href="#phones"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:opacity-60"
              style={{ color: "var(--text-primary)" }}
            >
              Phones
            </a>

            {/* About */}
            <a
              href="#about"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:opacity-60"
              style={{ color: "var(--text-primary)" }}
            >
              About
            </a>

            {/* Contact */}
            <a
              href="#contact"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:opacity-60"
              style={{ color: "var(--text-primary)" }}
            >
              Contact
            </a>

          </div>

        </div>
      )}

      {/* PAGE SECTIONS */}

      {/* Hero */}
      <Hero />

      {/* Phones */}
      <PhoneSection />

      {/* About */}
      <About />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />

    </main>
  );
}

export default App;