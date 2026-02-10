import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Home,
  User,
  Map,
  PlusCircle,
  MessageSquare,
  Bell,
  FileText,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import farmLand from "@/assets/farm-land.jpg";
import summerCrops from "@/assets/summer-crops.jpg";
import winterCrops from "@/assets/winter-crops.jpg";
import monsoonCrops from "@/assets/monsoon-crops.jpg";

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: Map, label: "My Lands", href: "/my-lands" },
  { icon: PlusCircle, label: "Add Lands", href: "/dashboard" },
  { icon: MessageSquare, label: "Messenger", href: "/dashboard" },
  { icon: Bell, label: "Notifications", href: "/dashboard" },
  { icon: FileText, label: "Govt. Schemes", href: "/dashboard" },
  { icon: HelpCircle, label: "Help Centre", href: "/dashboard" },
];

const Dashboard = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface-mint">
        {/* Welcome Banner */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent font-bold text-lg">🙏 NAMASTE!</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Welcome to our Contract Farming platform that connects you with trusted buyers and
                  helps you manage contracts easily. On this dashboard, you can get important updates,
                  and notifications, dedicated to making farming easier.
                </p>

                {/* Action Cards */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                    <PlusCircle className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium text-foreground">Add your land</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                    <User className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium text-foreground">Receive Contractor</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  Empowering Farmers, Connecting Markets:
                </h2>
                <p className="text-accent font-bold text-xl mt-1">
                  Secure Your Harvest, Grow Your Future.
                </p>
              </div>

              {/* Right Menu */}
              <div className="w-full md:w-64 bg-card rounded-xl shadow-lg border border-border p-4 space-y-1 h-fit">
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-foreground"
                  >
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seasonal Crops */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "BEST SUMMER CROPS TO GROW", image: summerCrops },
                { label: "BEST WINTER CROPS TO GROW", image: winterCrops },
                { label: "BEST MONSOON CROPS TO GROW", image: monsoonCrops },
              ].map((crop, i) => (
                <div
                  key={i}
                  className="relative h-40 rounded-lg overflow-hidden group cursor-pointer"
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
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
