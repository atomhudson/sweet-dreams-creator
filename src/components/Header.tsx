import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";
import { Button } from "./ui/button";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-card shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-3">
          {isHome && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/auth?mode=login">
                <Button variant="outline" size="sm">LOGIN</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button size="sm">REGISTER</Button>
              </Link>
            </div>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-nav text-nav-foreground">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 py-2 text-sm font-medium">
          <Link to="/" className="hover:text-accent transition-colors">Govt. Schemes</Link>
          <Link to="/" className="hover:text-accent transition-colors">Why Us?</Link>
          <Link to="/" className="hover:text-accent transition-colors">Contact Us</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border p-4 space-y-3">
          <Link to="/auth?mode=login" className="block">
            <Button variant="outline" className="w-full">LOGIN</Button>
          </Link>
          <Link to="/auth?mode=register" className="block">
            <Button className="w-full">REGISTER</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
