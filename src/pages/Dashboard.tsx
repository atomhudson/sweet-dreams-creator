import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Home, User, Map, PlusCircle, MessageSquare, Bell, FileText, HelpCircle, ChevronRight, Users, Shield,
} from "lucide-react";
import summerCrops from "@/assets/summer-crops.jpg";
import winterCrops from "@/assets/winter-crops.jpg";
import monsoonCrops from "@/assets/monsoon-crops.jpg";

const Dashboard = () => {
  const { user, profile, role } = useAuth();
  const [stats, setStats] = useState({ lands: 0, contracts: 0, notifications: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const [landsRes, contractsRes, notifRes] = await Promise.all([
        supabase.from("lands").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        role === "farmer"
          ? supabase.from("contracts").select("id", { count: "exact", head: true }).eq("farmer_id", user.id)
          : role === "contractor"
          ? supabase.from("contracts").select("id", { count: "exact", head: true }).eq("contractor_id", user.id)
          : supabase.from("contracts").select("id", { count: "exact", head: true }),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_read", false),
      ]);
      setStats({
        lands: landsRes.count || 0,
        contracts: contractsRes.count || 0,
        notifications: notifRes.count || 0,
      });
    };
    fetchStats();
  }, [user, role]);

  const farmerMenu = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Map, label: "My Lands", href: "/my-lands" },
    { icon: PlusCircle, label: "Add Land", href: "/add-land" },
    { icon: FileText, label: "Contracts", href: "/contracts" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help Centre", href: "/dashboard" },
  ];

  const contractorMenu = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: Map, label: "Browse Lands", href: "/my-lands" },
    { icon: FileText, label: "Contracts", href: "/contracts" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: HelpCircle, label: "Help Centre", href: "/dashboard" },
  ];

  const adminMenu = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Manage Users", href: "/admin" },
    { icon: FileText, label: "All Contracts", href: "/contracts" },
    { icon: Shield, label: "Approvals", href: "/admin" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
  ];

  const menuItems = role === "admin" ? adminMenu : role === "contractor" ? contractorMenu : farmerMenu;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint">
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent font-bold text-lg">🙏 NAMASTE, {profile?.full_name || "User"}!</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Welcome to your {role === "admin" ? "Admin" : role === "contractor" ? "Contractor" : "Farmer"} Dashboard.
                Manage your {role === "farmer" ? "lands, contracts" : role === "contractor" ? "contracts, agreements" : "users, contracts"} and stay updated.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">{stats.lands}</p>
                  <p className="text-xs text-muted-foreground">{role === "farmer" ? "My Lands" : "Available Lands"}</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">{stats.contracts}</p>
                  <p className="text-xs text-muted-foreground">Contracts</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
                  <p className="text-2xl font-bold text-accent">{stats.notifications}</p>
                  <p className="text-xs text-muted-foreground">Unread Alerts</p>
                </div>
              </div>

              {role === "farmer" && (
                <div className="flex items-center gap-4 mb-8">
                  <Link to="/add-land" className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                    <PlusCircle className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium text-foreground">Add your land</span>
                  </Link>
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <Link to="/contracts" className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer">
                    <FileText className="w-8 h-8 text-primary" />
                    <span className="text-xs font-medium text-foreground">View Contracts</span>
                  </Link>
                </div>
              )}

              <h2 className="text-2xl font-bold text-foreground leading-tight">
                Empowering Farmers, Connecting Markets:
              </h2>
              <p className="text-accent font-bold text-xl mt-1">Secure Your Harvest, Grow Your Future.</p>
            </div>

            <div className="w-full md:w-64 bg-card rounded-xl shadow-lg border border-border p-4 space-y-1 h-fit">
              {menuItems.map((item, i) => (
                <Link key={i} to={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-foreground">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "BEST SUMMER CROPS TO GROW", image: summerCrops },
                { label: "BEST WINTER CROPS TO GROW", image: winterCrops },
                { label: "BEST MONSOON CROPS TO GROW", image: monsoonCrops },
              ].map((crop, i) => (
                <div key={i} className="relative h-40 rounded-lg overflow-hidden group cursor-pointer">
                  <img src={crop.image} alt={crop.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
