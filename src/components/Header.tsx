import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, role } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Role-specific nav links
  const navLinks = (() => {
    if (!user) return [{ label: "Home", href: "/" }, { label: "Contact Us", href: "/" }];

    const common = [{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }];

    if (role === "farmer") {
      return [
        ...common,
        { label: "My Lands", href: "/my-lands" },
        { label: "Contracts", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    if (role === "contractor") {
      return [
        ...common,
        { label: "Browse Lands", href: "/browse-lands" },
        { label: "My Proposals", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    if (role === "admin") {
      return [
        ...common,
        { label: "Admin Panel", href: "/admin" },
        { label: "Contracts", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    return [...common, { label: "Contracts", href: "/contracts" }, { label: "Notifications", href: "/notifications" }];
  })();

  const mobileLinks = (() => {
    if (role === "farmer") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile", href: "/profile" },
        { label: "My Lands", href: "/my-lands" },
        { label: "Add Land", href: "/add-land" },
        { label: "Contracts", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    if (role === "contractor") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile", href: "/profile" },
        { label: "Browse Lands", href: "/browse-lands" },
        { label: "My Proposals", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    if (role === "admin") {
      return [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Admin Panel", href: "/admin" },
        { label: "Contracts", href: "/contracts" },
        { label: "Notifications", href: "/notifications" },
      ];
    }
    return [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Profile", href: "/profile" },
      { label: "Contracts", href: "/contracts" },
      { label: "Notifications", href: "/notifications" },
    ];
  })();

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth?mode=login">
                <Button variant="outline" size="sm">LOGIN</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button size="sm">REGISTER</Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${role === "farmer" ? "bg-primary/10 text-primary" :
                  role === "contractor" ? "bg-accent/10 text-accent" :
                    role === "admin" ? "bg-muted text-muted-foreground" :
                      "text-muted-foreground"
                }`}>
                {role}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Logout</Button>
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-foreground">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <nav className="bg-nav text-nav-foreground">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 text-sm font-medium overflow-x-auto">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              className={`whitespace-nowrap hover:text-accent transition-colors ${location.pathname === link.href ? "text-accent" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3">
          {!user ? (
            <>
              <Link to="/auth?mode=login" className="block">
                <Button variant="outline" className="w-full">LOGIN</Button>
              </Link>
              <Link to="/auth?mode=register" className="block">
                <Button className="w-full">REGISTER</Button>
              </Link>
            </>
          ) : (
            <>
              {mobileLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className={`block text-foreground font-medium py-2 ${location.pathname === link.href ? "text-primary" : ""
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" className="w-full" onClick={handleSignOut}>Logout</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
