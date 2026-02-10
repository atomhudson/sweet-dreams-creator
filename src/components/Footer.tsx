import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-surface-mint">
      {/* Social & Payment */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">🔒</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">SECURE PAYMENT</p>
            <p className="text-xs text-muted-foreground">100% Secure Payment</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">SHOW US SOME ❤ ON SOCIAL MEDIA</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <Facebook className="w-5 h-5 text-foreground hover:text-primary cursor-pointer" />
            <Twitter className="w-5 h-5 text-foreground hover:text-primary cursor-pointer" />
            <Instagram className="w-5 h-5 text-foreground hover:text-primary cursor-pointer" />
            <Youtube className="w-5 h-5 text-foreground hover:text-primary cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="font-semibold text-foreground mb-3">POLICY INFO</h4>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">Refund Policy</li>
            <li className="hover:text-primary cursor-pointer">Privacy Policy</li>
            <li className="hover:text-primary cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-primary cursor-pointer">Contract Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">MY ACCOUNT</h4>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">Contract History</li>
            <li className="hover:text-primary cursor-pointer">Wishlist</li>
            <li className="hover:text-primary cursor-pointer">Login</li>
            <li className="hover:text-primary cursor-pointer">Transactions</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">COMPANY INFO</h4>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="hover:text-primary cursor-pointer">About Us</li>
            <li className="hover:text-primary cursor-pointer">Contact Us</li>
            <li className="hover:text-primary cursor-pointer">Green Wall</li>
            <li className="hover:text-primary cursor-pointer">Jobs</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">OFFICE ADDRESS</h4>
          <p className="text-muted-foreground leading-relaxed">
            BLOCK NO. 46, Mehrauli Road, Ghaziabad, 201002, India
          </p>
          <p className="text-muted-foreground mt-2">Phone: +91-1234567890</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-nav text-nav-foreground text-center py-3 text-xs">
        Copyright © 2024 BHUMIBANDHAN | www.bhumibandhan.com
      </div>
    </footer>
  );
};

export default Footer;
