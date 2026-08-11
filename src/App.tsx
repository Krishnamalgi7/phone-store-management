import { useState } from "react";
import { Menu, X, House, Smartphone, Info, Mail } from "lucide-react";

import Hero from "./components/Hero";
import PhoneSection from "./components/PhoneSection";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  // Controls whether the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu after clicking a navigation link
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <main>

      {/* Navbar */}
      <nav className="mx-auto mt-4 flex max-w-7xl items-center justify-between rounded-full border border-gray-200 bg-white px-6 py-4 shadow-sm">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          NOVA
        </h1>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex">

                  <a
          href="#home"
          className="flex items-center gap-2 text-sm font-medium transition hover:text-yellow-500"
        >
          <House size={17} />
          Home
        </a>

                  <a
          href="#phones"
          className="flex items-center gap-2 text-sm font-medium transition hover:text-yellow-500"
        >
          <Smartphone size={17} />
          Phones
        </a>

                  <a
          href="#about"
          className="flex items-center gap-2 text-sm font-medium transition hover:text-yellow-500"
        >
          <Info size={17} />
          About
        </a>

        <a
          href="#contact"
          className="flex items-center gap-2 text-sm font-medium transition hover:text-yellow-500"
        >
          <Mail size={17} />
          Contact
        </a>

        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

      </nav>

      {/* Mobile sidebar */}
      {isMenuOpen && (
        <div className="fixed right-4 top-20 z-50 w-64 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl md:hidden">

          {/* Mobile navigation */}
          <div className="flex flex-col gap-2">

            <a
              href="#home"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-yellow-500"
            >
              Home
            </a>

            <a
              href="#phones"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-yellow-500"
            >
              Phones
            </a>

            <a
              href="#about"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-yellow-500"
            >
              About
            </a>

            <a
              href="#contact"
              onClick={handleNavClick}
              className="rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-yellow-500"
            >
              Contact
            </a>

          </div>

        </div>
      )}

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