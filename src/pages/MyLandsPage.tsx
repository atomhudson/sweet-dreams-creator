import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Land {
  id: string;
  area: string;
  location: string;
  price: number;
  is_lended: boolean;
  land_quality: string;
  crop_feasibility: string;
}

const MyLandsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<"lended" | "nonLended">("nonLended");
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLands = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("lands")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setLands((data || []) as Land[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLands();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lands").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Land removed" });
      fetchLands();
    }
  };

  const filteredLands = lands.filter((l) => (tab === "lended" ? l.is_lended : !l.is_lended));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground font-display underline underline-offset-8 decoration-primary">
              My Lands
            </h1>
            <Link to="/add-land">
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Land</Button>
            </Link>
          </div>

          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setTab("nonLended")}
              className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                tab === "nonLended" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              Non Lended
            </button>
            <button
              onClick={() => setTab("lended")}
              className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                tab === "lended" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              Lended
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filteredLands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No {tab === "lended" ? "lended" : "available"} lands yet.</p>
              <Link to="/add-land">
                <Button>Add Your First Land</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLands.map((land) => (
                <div key={land.id} className="flex gap-4 bg-card rounded-xl p-4 border border-border shadow-sm">
                  <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center text-2xl">🌾</div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground"><span className="font-semibold">Area:</span> {land.area}</p>
                    <p className="text-sm text-foreground mt-1"><span className="font-semibold">Location:</span> {land.location}</p>
                    <p className="text-sm text-foreground mt-1"><span className="font-semibold">Price:</span> ₹{land.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">Quality: {land.land_quality} | Crop: {land.crop_feasibility || "—"}</p>
                  </div>
                  <button onClick={() => handleDelete(land.id)} className="text-destructive hover:text-destructive/80">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyLandsPage;
