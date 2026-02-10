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
  Users, FileText, CheckCircle, XCircle, LayoutDashboard, Map, Search,
  ChevronDown, ChevronUp, Shield, Wheat, TrendingUp, Clock, User, UserPlus,
} from "lucide-react";

interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  address: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

interface ContractRow {
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
  farmer_name?: string;
  contractor_name?: string;
}

interface LandRow {
  id: string;
  area: string;
  location: string;
  price: number;
  land_quality: string;
  crop_feasibility: string;
  is_lended: boolean;
  user_id: string;
  created_at: string;
  farmer_name?: string;
}

type AdminTab = "dashboard" | "users" | "contracts" | "lands";

const AdminPage = () => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [lands, setLands] = useState<LandRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [contractStatusFilter, setContractStatusFilter] = useState("all");
  const [landFilter, setLandFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Add Contractor form state
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [contractorForm, setContractorForm] = useState({ email: "", password: "", fullName: "" });
  const [addingContractor, setAddingContractor] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [usersRes, contractsRes, landsRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("contracts").select("*").order("created_at", { ascending: false }),
      supabase.from("lands").select("*").order("created_at", { ascending: false }),
    ]);

    const usersData = (usersRes.data || []) as ProfileRow[];
    const contractsData = (contractsRes.data || []) as ContractRow[];
    const landsData = (landsRes.data || []) as LandRow[];

    // Build name map from profiles
    const nameMap: Record<string, string> = {};
    usersData.forEach((u) => {
      nameMap[u.user_id] = u.full_name;
    });

    // Enrich contracts with names
    const enrichedContracts = contractsData.map((c) => ({
      ...c,
      farmer_name: nameMap[c.farmer_id] || "Unknown",
      contractor_name: nameMap[c.contractor_id] || "Unknown",
    }));

    // Enrich lands with farmer names
    const enrichedLands = landsData.map((l) => ({
      ...l,
      farmer_name: nameMap[l.user_id] || "Unknown",
    }));

    setUsers(usersData);
    setContracts(enrichedContracts);
    setLands(enrichedLands);
    setLoading(false);
  };

  useEffect(() => {
    if (role === "admin") fetchAll();
  }, [role]);

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_approved: !currentStatus })
      .eq("user_id", userId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `User ${!currentStatus ? "approved" : "unapproved"}` });
      fetchAll();
    }
  };

  const handleContractStatus = async (
    contractId: string,
    newStatus: "approved" | "rejected",
    notes?: string
  ) => {
    const updateData: any = { status: newStatus };
    if (notes) updateData.admin_notes = notes;

    const { error } = await supabase
      .from("contracts")
      .update(updateData)
      .eq("id", contractId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Contract ${newStatus}` });
      fetchAll();
    }
  };

  if (role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-surface-mint flex items-center justify-center">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Stats
  const totalUsers = users.length;
  const farmers = users.filter((u) => u.role === "farmer");
  const contractors = users.filter((u) => u.role === "contractor");
  const pendingUsers = users.filter((u) => !u.is_approved);
  const totalLands = lands.length;
  const availableLands = lands.filter((l) => !l.is_lended);
  const totalContracts = contracts.length;
  const submittedContracts = contracts.filter((c) => c.status === "submitted");
  const activeContracts = contracts.filter((c) => c.status === "active");
  const completedContracts = contracts.filter((c) => c.status === "completed");

  // Filtered data
  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesSearch =
      u.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone_number.includes(userSearch) ||
      u.address.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const filteredContracts = contracts.filter(
    (c) => contractStatusFilter === "all" || c.status === contractStatusFilter
  );

  const filteredLands = lands.filter(
    (l) => landFilter === "all" || (landFilter === "available" ? !l.is_lended : l.is_lended)
  );

  const statusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-muted text-muted-foreground",
      submitted: "bg-amber-100 text-amber-700",
      approved: "bg-primary/20 text-primary",
      rejected: "bg-destructive/20 text-destructive",
      active: "bg-primary text-primary-foreground",
      completed: "bg-emerald-100 text-emerald-700",
      terminated: "bg-destructive text-destructive-foreground",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const tabs: { key: AdminTab; label: string; icon: React.ElementType }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
    { key: "contracts", label: "Contracts", icon: FileText },
    { key: "lands", label: "Lands", icon: Map },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground font-display mb-6 underline underline-offset-8 decoration-primary">
            Admin Panel
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* ===== DASHBOARD TAB ===== */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Primary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Users} label="Total Users" value={totalUsers} color="text-primary" />
                    <StatCard icon={Map} label="Total Lands" value={totalLands} color="text-primary" />
                    <StatCard icon={FileText} label="Total Contracts" value={totalContracts} color="text-primary" />
                    <StatCard icon={Clock} label="Pending Approvals" value={pendingUsers.length} color="text-accent" />
                  </div>

                  {/* Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-xl border border-border p-5">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" /> Users by Role
                      </h3>
                      <div className="space-y-3">
                        <RoleBar label="Farmers" count={farmers.length} total={totalUsers} color="bg-primary" />
                        <RoleBar label="Contractors" count={contractors.length} total={totalUsers} color="bg-accent" />
                        <RoleBar label="Admins" count={users.filter((u) => u.role === "admin").length} total={totalUsers} color="bg-muted-foreground" />
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-5">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" /> Contracts by Status
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Submitted", count: submittedContracts.length, cls: "text-amber-700 bg-amber-50" },
                          { label: "Approved", count: contracts.filter((c) => c.status === "approved").length, cls: "text-primary bg-primary/5" },
                          { label: "Active", count: activeContracts.length, cls: "text-emerald-700 bg-emerald-50" },
                          { label: "Completed", count: completedContracts.length, cls: "text-blue-700 bg-blue-50" },
                          { label: "Rejected", count: contracts.filter((c) => c.status === "rejected").length, cls: "text-destructive bg-destructive/5" },
                          { label: "Terminated", count: contracts.filter((c) => c.status === "terminated").length, cls: "text-rose-700 bg-rose-50" },
                        ].map((item) => (
                          <div key={item.label} className={`rounded-lg p-3 ${item.cls}`}>
                            <p className="text-xl font-bold">{item.count}</p>
                            <p className="text-xs font-medium">{item.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Land Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard icon={Wheat} label="Available Lands" value={availableLands.length} color="text-primary" />
                    <StatCard icon={Shield} label="Lended Lands" value={lands.filter((l) => l.is_lended).length} color="text-accent" />
                  </div>
                </div>
              )}

              {/* ===== USERS TAB ===== */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  {/* Add Contractor Section */}
                  <div className="bg-card rounded-xl border border-border p-4">
                    <button
                      onClick={() => setShowAddContractor(!showAddContractor)}
                      className="flex items-center gap-2 text-sm font-semibold text-foreground w-full"
                    >
                      <UserPlus className="w-4 h-4 text-primary" />
                      Add Contractor Account
                      {showAddContractor ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                    </button>
                    {showAddContractor && (
                      <form
                        className="mt-4 space-y-3 border-t border-border pt-4"
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!contractorForm.email || !contractorForm.password || !contractorForm.fullName) {
                            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
                            return;
                          }
                          setAddingContractor(true);
                          const { error } = await supabase.auth.signUp({
                            email: contractorForm.email,
                            password: contractorForm.password,
                            options: {
                              data: { full_name: contractorForm.fullName, role: "contractor" },
                              emailRedirectTo: window.location.origin,
                            },
                          });
                          if (error) {
                            toast({ title: "Failed", description: error.message, variant: "destructive" });
                          } else {
                            toast({ title: "Contractor added!", description: `Account created for ${contractorForm.email}. They'll need to verify their email.` });
                            setContractorForm({ email: "", password: "", fullName: "" });
                            setShowAddContractor(false);
                            setTimeout(() => fetchAll(), 1000);
                          }
                          setAddingContractor(false);
                        }}
                      >
                        <p className="text-xs text-muted-foreground">Create a new contractor account. Only admins can add contractors.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <Label>Full Name *</Label>
                            <Input
                              placeholder="Contractor name"
                              value={contractorForm.fullName}
                              onChange={(e) => setContractorForm((p) => ({ ...p, fullName: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              placeholder="contractor@email.com"
                              value={contractorForm.email}
                              onChange={(e) => setContractorForm((p) => ({ ...p, email: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label>Password *</Label>
                            <Input
                              type="password"
                              placeholder="Min 6 characters"
                              value={contractorForm.password}
                              onChange={(e) => setContractorForm((p) => ({ ...p, password: e.target.value }))}
                              className="mt-1"
                              required
                              minLength={6}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" disabled={addingContractor}>
                            <UserPlus className="w-4 h-4 mr-1" />
                            {addingContractor ? "Creating..." : "Create Contractor"}
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setShowAddContractor(false)}>Cancel</Button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, phone, or address..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      {["all", "farmer", "contractor", "admin"].map((r) => (
                        <button
                          key={r}
                          onClick={() => setUserRoleFilter(r)}
                          className={`text-xs font-medium px-3 py-2 rounded-full border capitalize transition-colors ${userRoleFilter === r
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border hover:border-primary/50"
                            }`}
                        >
                          {r === "all" ? "All" : `${r}s`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card rounded-lg p-3 border border-border text-center">
                      <p className="text-lg font-bold text-foreground">{filteredUsers.length}</p>
                      <p className="text-xs text-muted-foreground">Showing</p>
                    </div>
                    <div className="bg-card rounded-lg p-3 border border-border text-center">
                      <p className="text-lg font-bold text-primary">{filteredUsers.filter((u) => u.is_approved).length}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="bg-card rounded-lg p-3 border border-border text-center">
                      <p className="text-lg font-bold text-accent">{filteredUsers.filter((u) => !u.is_approved).length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="text-left p-3 font-medium text-muted-foreground">Name</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Phone</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Role</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                              <td className="p-3 text-foreground font-medium">{u.full_name || "—"}</td>
                              <td className="p-3 text-muted-foreground">{u.phone_number || "—"}</td>
                              <td className="p-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${u.role === "farmer" ? "bg-primary/10 text-primary" :
                                  u.role === "contractor" ? "bg-accent/10 text-accent" :
                                    "bg-muted text-muted-foreground"
                                  }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${u.is_approved ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                                  {u.is_approved ? "Approved" : "Pending"}
                                </span>
                              </td>
                              <td className="p-3">
                                <Button
                                  size="sm"
                                  variant={u.is_approved ? "outline" : "default"}
                                  onClick={() => toggleApproval(u.user_id, u.is_approved)}
                                >
                                  {u.is_approved ? "Revoke" : "Approve"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== CONTRACTS TAB ===== */}
              {activeTab === "contracts" && (
                <div className="space-y-4">
                  {/* Status filters */}
                  <div className="flex flex-wrap gap-2">
                    {["all", "submitted", "approved", "active", "completed", "rejected", "terminated"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setContractStatusFilter(s)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-colors ${contractStatusFilter === s
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50"
                          }`}
                      >
                        {s === "all" ? `All (${contracts.length})` : `${s} (${contracts.filter((c) => c.status === s).length})`}
                      </button>
                    ))}
                  </div>

                  {/* Contracts list */}
                  {filteredContracts.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No contracts match this filter.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredContracts.map((contract) => (
                        <div key={contract.id} className="bg-card rounded-xl border border-border shadow-sm">
                          <button
                            className="w-full flex items-center justify-between p-4 text-left"
                            onClick={() => setExpandedId(expandedId === contract.id ? null : contract.id)}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-5 h-5 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{contract.title}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  <span className="text-primary">{contract.farmer_name}</span>
                                  {" ↔ "}
                                  <span className="text-accent">{contract.contractor_name}</span>
                                  {" • "}₹{contract.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${statusColor(contract.status)}`}>
                                {contract.status}
                              </span>
                              {expandedId === contract.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </button>

                          {expandedId === contract.id && (
                            <div className="px-4 pb-4 border-t border-border pt-3 space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <p><span className="font-medium">Farmer:</span> {contract.farmer_name}</p>
                                <p><span className="font-medium">Contractor:</span> {contract.contractor_name}</p>
                              </div>
                              <p><span className="font-medium">Crop:</span> {contract.crop_type || "—"}</p>
                              <p><span className="font-medium">Quantity:</span> {contract.quantity || "—"}</p>
                              <p><span className="font-medium">Description:</span> {contract.description || "—"}</p>
                              <p><span className="font-medium">Period:</span> {contract.start_date || "—"} to {contract.end_date || "—"}</p>
                              <p><span className="font-medium">Created:</span> {new Date(contract.created_at).toLocaleDateString()}</p>
                              {contract.admin_notes && (
                                <p><span className="font-medium">Admin Notes:</span> {contract.admin_notes}</p>
                              )}

                              {contract.status === "submitted" && (
                                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                                  <Button size="sm" onClick={() => handleContractStatus(contract.id, "approved")}>
                                    <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleContractStatus(contract.id, "rejected")}>
                                    <XCircle className="w-4 h-4 mr-1" /> Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== LANDS TAB ===== */}
              {activeTab === "lands" && (
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex gap-2">
                    {[
                      { key: "all", label: `All (${lands.length})` },
                      { key: "available", label: `Available (${availableLands.length})` },
                      { key: "lended", label: `Lended (${lands.filter((l) => l.is_lended).length})` },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setLandFilter(f.key)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${landFilter === f.key
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-muted-foreground border-border hover:border-primary/50"
                          }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Lands table */}
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-secondary/50">
                            <th className="text-left p-3 font-medium text-muted-foreground">Farmer</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Location</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Area</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Quality</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Price</th>
                            <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLands.map((land) => (
                            <tr key={land.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                              <td className="p-3">
                                <span className="flex items-center gap-1.5 text-foreground font-medium">
                                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                                  {land.farmer_name}
                                </span>
                              </td>
                              <td className="p-3 text-muted-foreground">{land.location}</td>
                              <td className="p-3 text-muted-foreground">{land.area}</td>
                              <td className="p-3">
                                <span className="text-xs font-medium capitalize">{land.land_quality}</span>
                              </td>
                              <td className="p-3 text-foreground font-medium">₹{land.price.toLocaleString()}</td>
                              <td className="p-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${land.is_lended ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                                  }`}>
                                  {land.is_lended ? "Lended" : "Available"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Helper components
const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
    <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

const RoleBar = ({ label, count, total, color }: { label: string; count: number; total: number; color: string }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{count} ({pct}%)</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default AdminPage;
