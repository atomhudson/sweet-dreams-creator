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
              <span className="text-sm text-muted-foreground capitalize">{role}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>Logout</Button>
            </div>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-foreground">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <nav className="bg-nav text-nav-foreground">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-accent transition-colors">Dashboard</Link>
              <Link to="/contracts" className="hover:text-accent transition-colors">Contracts</Link>
              <Link to="/notifications" className="hover:text-accent transition-colors">Notifications</Link>
            </>
          )}
          <Link to="/" className="hover:text-accent transition-colors">Contact Us</Link>
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
              <Link to="/dashboard" className="block text-foreground font-medium py-2">Dashboard</Link>
              <Link to="/profile" className="block text-foreground font-medium py-2">Profile</Link>
              <Link to="/contracts" className="block text-foreground font-medium py-2">Contracts</Link>
              <Link to="/my-lands" className="block text-foreground font-medium py-2">My Lands</Link>
              <Link to="/notifications" className="block text-foreground font-medium py-2">Notifications</Link>
              {role === "admin" && (
                <Link to="/admin" className="block text-foreground font-medium py-2">Admin Panel</Link>
              )}
              <Button variant="outline" className="w-full" onClick={handleSignOut}>Logout</Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
