import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-farmer.jpg";
import summerCrops from "@/assets/summer-crops.jpg";
import winterCrops from "@/assets/winter-crops.jpg";
import monsoonCrops from "@/assets/monsoon-crops.jpg";

const processSteps = [
  { label: "Feasibility Assessment", step: 1 },
  { label: "Getting Stakeholders Buy In", step: 2 },
  { label: "Farmers Selection", step: 3 },
  { label: "Contract Development & Signature", step: 4 },
  { label: "Preparation", step: 5 },
  { label: "Management & Evaluation", step: 6 },
  { label: "Termination / Renewal", step: 7 },
];

const quickLinks = [
  { label: "Government schemes for Farmers", href: "#" },
  { label: "Government schemes for Contract Buyers", href: "#" },
  { label: "Know more about Soils", href: "#" },
  { label: "Know more about Crops", href: "#" },
];

const seasonalCrops = [
  { label: "BEST SUMMER CROPS TO GROW", image: summerCrops },
  { label: "BEST WINTER CROPS TO GROW", image: winterCrops },
  { label: "BEST MONSOON CROPS TO GROW", image: monsoonCrops },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={heroImage}
          alt="Indian farmer in wheat field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <h1 className="text-3xl md:text-5xl font-bold text-card font-display leading-tight max-w-lg">
              REVOLUTIONIZING INDIAN AGRICULTURE
            </h1>
            <p className="text-card/80 mt-3 text-sm md:text-base max-w-md">
              WE AIM TO TRANSFORM AGRI VALUE CHAIN WITH OUR TECHNOLOGY
            </p>
            <div className="flex gap-3 mt-6">
              <Link to="/auth?mode=login">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button variant="outline" size="lg" className="bg-card/10 border-card/30 text-card hover:bg-card/20">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Carousel dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-card" />
          <div className="w-3 h-3 rounded-full bg-card/40" />
          <div className="w-3 h-3 rounded-full bg-card/40" />
          <div className="w-3 h-3 rounded-full bg-card/40" />
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-12 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {processSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-full text-xs md:text-sm font-medium text-center min-w-[120px] border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                  {step.label}
                </div>
                {i < processSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-primary hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-surface-light">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">QUICK LINKS</h2>
          <div className="space-y-3">
            {quickLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="block text-primary font-medium underline underline-offset-4 hover:text-accent transition-colors text-lg"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Crops */}
      <section className="py-12 bg-card">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-2">
            Empowering Farmers, Connecting Markets
          </h2>
          <p className="text-center text-accent font-semibold text-lg mb-8">
            Secure Your Harvest, Grow Your Future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seasonalCrops.map((crop, i) => (
              <div
                key={i}
                className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={crop.image}
                  alt={crop.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-foreground/40 flex items-end p-4">
                  <h3 className="text-card font-bold text-sm">{crop.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
