import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const AddLandPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    area: "",
    location: "",
    pin_code: "",
    land_quality: "good",
    crop_feasibility: "",
    price: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase.from("lands").insert({
      user_id: user.id,
      area: form.area,
      location: form.location,
      pin_code: form.pin_code,
      land_quality: form.land_quality,
      crop_feasibility: form.crop_feasibility,
      price: parseFloat(form.price) || 0,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Land added successfully!" });
      navigate("/my-lands");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-lg mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-foreground font-display mb-8 underline underline-offset-8 decoration-primary">
            Add Land
          </h1>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div>
              <Label>Area (e.g., 1000*1000 sq. feet) *</Label>
              <Input value={form.area} onChange={handleChange("area")} placeholder="1000*1000 sq. feet" required className="mt-1" />
            </div>
            <div>
              <Label>Location *</Label>
              <Input value={form.location} onChange={handleChange("location")} placeholder="Village, District, State" required className="mt-1" />
            </div>
            <div>
              <Label>Pin Code</Label>
              <Input value={form.pin_code} onChange={handleChange("pin_code")} placeholder="201002" className="mt-1" />
            </div>
            <div>
              <Label>Land Quality</Label>
              <select
                value={form.land_quality}
                onChange={handleChange("land_quality")}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="average">Average</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <Label>Crop Feasibility</Label>
              <Input value={form.crop_feasibility} onChange={handleChange("crop_feasibility")} placeholder="Wheat, Rice, Sugarcane..." className="mt-1" />
            </div>
            <div>
              <Label>Price (₹) *</Label>
              <Input type="number" value={form.price} onChange={handleChange("price")} placeholder="10000" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Adding..." : "Add Land"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddLandPage;
