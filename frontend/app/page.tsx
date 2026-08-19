import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PhoneList from "./components/PhoneList";
import PhoneManagement from "./components/PhoneManagement";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">

      <Navbar />

      <Hero />

      <PhoneList />

      <PhoneManagement />

      <About />

      <Contact />

      <Footer />

    </main>
  );
}