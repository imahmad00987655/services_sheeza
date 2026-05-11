import { Link } from "@tanstack/react-router";
import { Phone, MapPin, MessageCircle, Globe } from "lucide-react";

export function SalonHeader() {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-rose flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground leading-tight">Sheeza Salon</h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Premium Beauty</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            <MessageCircle className="w-4 h-4" />
          </a>
          <a href="tel:+923001234567" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            <Phone className="w-4 h-4" />
          </a>
          <a href="https://instagram.com/sheezasalon" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

export function SalonFooter() {
  return (
    <footer className="bg-salon-dark text-cream py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-3 text-rose-gold">Sheeza Salon</h3>
            <p className="text-sm opacity-80">Your destination for premium beauty services. Experience luxury, elegance and transformation.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm opacity-80">
              <a href="https://wa.me/923001234567" className="flex items-center gap-2 hover:text-rose-gold transition-colors"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
              <a href="tel:+923001234567" className="flex items-center gap-2 hover:text-rose-gold transition-colors"><Phone className="w-4 h-4" /> Call Us</a>
              <a href="https://instagram.com/sheezasalon" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-rose-gold transition-colors"><Globe className="w-4 h-4" /> Globe</a>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-3">Location</h4>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-sm opacity-80 hover:text-rose-gold transition-colors">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>123 Beauty Avenue, Main Boulevard, Lahore, Pakistan</span>
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-cream/10 text-center text-xs opacity-60">
          © {new Date().getFullYear()} Sheeza Salon. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
