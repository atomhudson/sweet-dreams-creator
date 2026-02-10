import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  User, Shield, CreditCard, Star, ChevronRight, Save,
} from "lucide-react";

const ProfilePage = () => {
  const { profile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    pin_code: "",
    aadhaar_number: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name,
        phone_number: profile.phone_number,
        address: profile.address,
        pin_code: profile.pin_code,
        aadhaar_number: profile.aadhaar_number,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(form)
      .eq("user_id", profile.user_id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!", description: "Your changes have been saved." });
      await refreshProfile();
      setEditing(false);
    }
    setSaving(false);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const profileSections = [
    { icon: Shield, title: "Privacy & Security", subtitle: "Block messages, disappearing messages" },
    { icon: CreditCard, title: "Payment & Transactions", subtitle: "Payment mode, Transaction History" },
    { icon: Star, title: "My Reviews & Certificates", subtitle: "My Ratings, Reviews and Certificates" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-foreground font-display mb-8 underline underline-offset-8 decoration-primary">
            My Profile
          </h1>

          {/* Personal Info - Editable */}
          <div className="bg-card rounded-xl border border-border p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Personal Info</p>
                  <p className="text-sm text-muted-foreground">Name, Phone number, Address</p>
                </div>
              </div>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              ) : (
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div>
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={handleChange("full_name")} className="mt-1" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input value={form.phone_number} onChange={handleChange("phone_number")} className="mt-1" />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={form.address} onChange={handleChange("address")} className="mt-1" />
                </div>
                <div>
                  <Label>Pin Code</Label>
                  <Input value={form.pin_code} onChange={handleChange("pin_code")} className="mt-1" />
                </div>
                <div>
                  <Label>Aadhaar Number</Label>
                  <Input value={form.aadhaar_number} onChange={handleChange("aadhaar_number")} className="mt-1" />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {profile?.full_name || "—"}</p>
                <p><span className="font-medium">Phone:</span> {profile?.phone_number || "—"}</p>
                <p><span className="font-medium">Address:</span> {profile?.address || "—"}</p>
                <p><span className="font-medium">Pin Code:</span> {profile?.pin_code || "—"}</p>
                <p><span className="font-medium">Role:</span> <span className="capitalize">{profile?.role}</span></p>
                <p><span className="font-medium">Status:</span> {profile?.is_approved ? "✅ Approved" : "⏳ Pending Approval"}</p>
              </div>
            )}
          </div>

          {/* Other sections */}
          <div className="space-y-3">
            {profileSections.map((section, i) => (
              <button key={i} className="w-full flex items-center gap-4 p-4 bg-secondary rounded-xl hover:bg-primary/10 transition-colors text-left">
                <section.icon className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{section.title}</p>
                  <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
