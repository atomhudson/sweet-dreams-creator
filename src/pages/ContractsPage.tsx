import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FileText, Plus, ChevronDown, ChevronUp } from "lucide-react";

interface Contract {
  id: string;
  title: string;
  description: string;
  crop_type: string;
  quantity: string;
  price: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  farmer_id: string;
  contractor_id: string;
  created_at: string;
  admin_notes: string;
}

const ContractsPage = () => {
  const { user, role } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    crop_type: "",
    quantity: "",
    price: "",
    counterparty_email: "",
    start_date: "",
    end_date: "",
  });

  const fetchContracts = async () => {
    if (!user) return;
    setLoading(true);
    let query;
    if (role === "admin") {
      query = supabase.from("contracts").select("*").order("created_at", { ascending: false });
    } else if (role === "farmer") {
      query = supabase.from("contracts").select("*").eq("farmer_id", user.id).order("created_at", { ascending: false });
    } else {
      query = supabase.from("contracts").select("*").eq("contractor_id", user.id).order("created_at", { ascending: false });
    }
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setContracts((data || []) as Contract[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContracts();
  }, [user, role]);

  const handleSubmitContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // For simplicity, use a placeholder contractor/farmer id
    const contractData: any = {
      title: form.title,
      description: form.description,
      crop_type: form.crop_type,
      quantity: form.quantity,
      price: parseFloat(form.price) || 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: "submitted" as const,
    };

    if (role === "farmer") {
      contractData.farmer_id = user.id;
      contractData.contractor_id = user.id; // Placeholder until matched
    } else {
      contractData.contractor_id = user.id;
      contractData.farmer_id = user.id; // Placeholder until matched
    }

    const { error } = await supabase.from("contracts").insert(contractData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Contract submitted!" });
      setShowCreate(false);
      setForm({ title: "", description: "", crop_type: "", quantity: "", price: "", counterparty_email: "", start_date: "", end_date: "" });
      fetchContracts();
    }
  };

  const handleStatusUpdate = async (contractId: string, newStatus: "draft" | "submitted" | "approved" | "rejected" | "active" | "completed" | "terminated") => {
    const { error } = await supabase
      .from("contracts")
      .update({ status: newStatus })
      .eq("id", contractId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Contract ${newStatus}` });
      fetchContracts();
    }
  };

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      submitted: "bg-accent/20 text-accent",
      approved: "bg-primary/20 text-primary",
      rejected: "bg-destructive/20 text-destructive",
      active: "bg-primary text-primary-foreground",
      completed: "bg-secondary text-secondary-foreground",
      terminated: "bg-destructive text-destructive-foreground",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground font-display underline underline-offset-8 decoration-primary">
              Contracts
            </h1>
            {role !== "admin" && (
              <Button size="sm" onClick={() => setShowCreate(!showCreate)}>
                <Plus className="w-4 h-4 mr-1" /> New Contract
              </Button>
            )}
          </div>

          {/* Create Contract Form */}
          {showCreate && (
            <form onSubmit={handleSubmitContract} className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
              <h3 className="font-semibold text-foreground">Create New Contract</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={handleChange("title")} placeholder="Contract title" required className="mt-1" />
                </div>
                <div>
                  <Label>Crop Type *</Label>
                  <Input value={form.crop_type} onChange={handleChange("crop_type")} placeholder="Wheat, Rice..." required className="mt-1" />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input value={form.quantity} onChange={handleChange("quantity")} placeholder="100 quintals" className="mt-1" />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={handleChange("price")} placeholder="50000" className="mt-1" />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={form.start_date} onChange={handleChange("start_date")} className="mt-1" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={form.end_date} onChange={handleChange("end_date")} className="mt-1" />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  placeholder="Contract details..."
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Submit Contract</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {/* Contracts List */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contracts yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-card rounded-xl border border-border shadow-sm">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left"
                    onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{contract.title}</p>
                        <p className="text-xs text-muted-foreground">{contract.crop_type} • ₹{contract.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                      {expandedId === contract.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedId === contract.id && (
                    <div className="px-4 pb-4 border-t border-border pt-3 space-y-2 text-sm">
                      <p><span className="font-medium">Description:</span> {contract.description || "—"}</p>
                      <p><span className="font-medium">Quantity:</span> {contract.quantity || "—"}</p>
                      <p><span className="font-medium">Period:</span> {contract.start_date || "—"} to {contract.end_date || "—"}</p>
                      <p><span className="font-medium">Created:</span> {new Date(contract.created_at).toLocaleDateString()}</p>
                      {contract.admin_notes && (
                        <p><span className="font-medium">Admin Notes:</span> {contract.admin_notes}</p>
                      )}

                      {/* Admin actions */}
                      {role === "admin" && contract.status === "submitted" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => handleStatusUpdate(contract.id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(contract.id, "rejected")}>Reject</Button>
                        </div>
                      )}

                      {/* Farmer/Contractor actions */}
                      {role !== "admin" && contract.status === "approved" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => handleStatusUpdate(contract.id, "active")}>Activate</Button>
                        </div>
                      )}
                      {role !== "admin" && contract.status === "active" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" onClick={() => handleStatusUpdate(contract.id, "completed")}>Mark Complete</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(contract.id, "terminated")}>Terminate</Button>
                        </div>
                      )}
                    </div>
                  )}
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

export default ContractsPage;
