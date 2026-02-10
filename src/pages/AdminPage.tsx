import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Users, FileText, CheckCircle, XCircle } from "lucide-react";

interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string;
  phone_number: string;
  role: string;
  is_approved: boolean;
  created_at: string;
}

const AdminPage = () => {
  const { role } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setUsers((data || []) as ProfileRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (role === "admin") fetchUsers();
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
      fetchUsers();
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-surface-mint py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground font-display mb-8 underline underline-offset-8 decoration-primary">
            Admin Panel
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
              <Users className="w-6 h-6 mx-auto text-primary mb-1" />
              <p className="text-xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
              <CheckCircle className="w-6 h-6 mx-auto text-primary mb-1" />
              <p className="text-xl font-bold text-foreground">{users.filter((u) => u.is_approved).length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border text-center shadow-sm">
              <XCircle className="w-6 h-6 mx-auto text-accent mb-1" />
              <p className="text-xl font-bold text-foreground">{users.filter((u) => !u.is_approved).length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Manage Users
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : (
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
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="p-3 text-foreground font-medium">{u.full_name || "—"}</td>
                        <td className="p-3 text-muted-foreground">{u.phone_number || "—"}</td>
                        <td className="p-3 capitalize text-muted-foreground">{u.role}</td>
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
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
