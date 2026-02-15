import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="gradient-purple text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="ChuttakPay" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-display text-xl font-bold">ChuttakPay</span>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Your one-stop shop for quality products at the best prices. Jewelry, home essentials, beauty & more.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-primary-foreground transition-colors">Shop</Link></li>
              <li><Link to="/shop?filter=deals" className="hover:text-primary-foreground transition-colors">Deals</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/account" className="hover:text-primary-foreground transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/shop?category=jewelry" className="hover:text-primary-foreground transition-colors">Jewelry</Link></li>
              <li><Link to="/shop?category=hair-accessories" className="hover:text-primary-foreground transition-colors">Hair Accessories</Link></li>
              <li><Link to="/shop?category=kitchen" className="hover:text-primary-foreground transition-colors">Kitchen & Dining</Link></li>
              <li><Link to="/shop?category=home" className="hover:text-primary-foreground transition-colors">Home & Living</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@chuttakpay.lk</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +94 77 123 4567</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Ratnapura, Sri Lanka</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} ChuttakPay. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.67a8.2 8.2 0 004.76 1.52v-3.5a4.84 4.84 0 01-1-.15z"/></svg>
            </a>
          </div>
          <p>Powered by Mintpay • Secure Payments</p>
        </div>
      </div>
    </footer>
  );
}
