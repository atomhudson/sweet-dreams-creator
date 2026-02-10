import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link to="/" className={`flex items-center gap-1 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
          <Leaf className="w-5 h-5 text-primary" />
        </div>
        <Leaf className="w-3 h-3 text-primary absolute -top-1 right-0 rotate-45" />
      </div>
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-accent tracking-tight">BHOOMI</span>
        <span className="text-lg font-medium text-primary italic">bandhan</span>
      </div>
    </Link>
  );
};

export default Logo;
