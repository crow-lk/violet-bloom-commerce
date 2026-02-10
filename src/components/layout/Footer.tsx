import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="gradient-purple text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold">TechPulse</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your one-stop shop for the latest electronics and gadgets. Best prices, best selection.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">Shop</Link></li>
              <li><Link to="/shop?filter=deals" className="hover:text-primary-foreground transition-colors">Deals</Link></li>
              <li><Link to="/account" className="hover:text-primary-foreground transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/shop?category=phones" className="hover:text-primary-foreground transition-colors">Phones</Link></li>
              <li><Link to="/shop?category=laptops" className="hover:text-primary-foreground transition-colors">Laptops</Link></li>
              <li><Link to="/shop?category=audio" className="hover:text-primary-foreground transition-colors">Audio</Link></li>
              <li><Link to="/shop?category=gaming" className="hover:text-primary-foreground transition-colors">Gaming</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@techpulse.lk</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +94 77 123 4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} TechPulse. All rights reserved.</p>
          <p className="mt-1">Powered by Mintpay • Secure Payments</p>
        </div>
      </div>
    </footer>
  );
}
