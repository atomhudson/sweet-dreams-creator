import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [role, setRole] = useState<"farmer" | "organisation" | "admin">("farmer");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-surface-mint flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo centered */}
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

          {/* Role Selection */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {(["farmer", "organisation", "admin"] as const).map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    role === r
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  }`}
                />
                <span className="text-sm font-medium capitalize text-foreground">{r}</span>
              </label>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-card rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                  mode === "login"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
                  mode === "register"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-6 space-y-4">
              {mode === "register" && (
                <>
                  <div>
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input id="fullname" placeholder="Full Name" className="mt-1" />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Phone Number" className="mt-1" />
              </div>

              {mode === "register" && (
                <>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Address" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pin Code</Label>
                    <Input id="pincode" placeholder="Pin Code" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input id="aadhaar" placeholder="Aadhaar Number" className="mt-1" />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password" className="mt-1" />
              </div>

              {mode === "login" && (
                <p className="text-sm text-primary cursor-pointer hover:underline">
                  Forgot Password?
                </p>
              )}

              <Button className="w-full rounded-full text-lg py-5" size="lg">
                Get OTP
              </Button>

              {mode === "login" ? (
                <p className="text-center text-sm text-muted-foreground">
                  New here?{" "}
                  <button onClick={() => setMode("register")} className="text-primary font-medium underline">
                    Create an Account
                  </button>
                </p>
              ) : (
                <p className="text-center text-sm text-muted-foreground">
                  Already have an Account?{" "}
                  <button onClick={() => setMode("login")} className="text-primary font-medium underline">
                    Login
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;
