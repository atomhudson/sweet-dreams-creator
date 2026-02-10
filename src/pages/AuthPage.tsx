import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";



const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    pinCode: "",
    aadhaar: "",
    password: "",
  });

  // Redirect if already logged in
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        if (!form.fullName || !form.email || !form.password) {
          toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(form.email, form.password, {
          full_name: form.fullName,
          role: "farmer",
        });
        if (error) {
          toast({ title: "Registration failed", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "Success!", description: "Please check your email to verify your account." });
        }
      } else {
        if (!form.email || !form.password) {
          toast({ title: "Error", description: "Please enter email and password", variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
        const { error } = await signIn(form.email, form.password);
        if (error) {
          toast({ title: "Login failed", description: error.message, variant: "destructive" });
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface-mint flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-1 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
                <span className="text-primary text-xl">🌱</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-accent">BHOOMI</span>
                <span className="text-xl font-medium text-primary italic">bandhan</span>
              </div>
            </div>
          </div>

          {/* Farmer registration only — contractors added by admin, admins created via SQL */}
          {mode === "register" && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              Register as a <span className="font-semibold text-primary">Farmer</span> to get started.
            </p>
          )}

          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${mode === "login" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${mode === "register" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground"
                  }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {mode === "register" && (
                <div>
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input id="fullname" placeholder="Full Name" value={form.fullName} onChange={handleChange("fullName")} className="mt-1" required />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange("email")} className="mt-1" required />
              </div>

              {mode === "register" && (
                <>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange("phone")} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Address" value={form.address} onChange={handleChange("address")} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pin Code</Label>
                    <Input id="pincode" placeholder="Pin Code" value={form.pinCode} onChange={handleChange("pinCode")} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" placeholder="Aadhaar Number" value={form.aadhaar} onChange={handleChange("aadhaar")} className="mt-1" />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="Password" value={form.password} onChange={handleChange("password")} className="mt-1" required minLength={6} />
              </div>

              <Button type="submit" className="w-full rounded-full text-lg py-5" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </Button>

              {mode === "login" ? (
                <p className="text-center text-sm text-muted-foreground">
                  New here?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-primary font-medium underline">
                    Create an Account
                  </button>
                </p>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Already have an Account?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-primary font-medium underline">
                    Login
                  </button>
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
