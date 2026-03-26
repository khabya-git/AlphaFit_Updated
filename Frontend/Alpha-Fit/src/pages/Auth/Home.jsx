import Header from "../../components/landing/Header";
import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import Pricing from "../../components/landing/Pricing";
import CallToAction from "../../components/landing/CallToAction";
import Footer from "../../components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-black selection:bg-rose-600 selection:text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}