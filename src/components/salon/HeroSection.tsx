import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fdf2f0 0%, #faf5f0 50%, #f8f6f2 100%)" }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
        style={{ background: "rgba(188,143,126,0.15)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
        style={{ background: "rgba(220,180,170,0.15)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs tracking-widest uppercase mb-6"
          style={{ background: "rgba(188,143,126,0.15)", color: "#6b4c3b" }}
        >
          <Sparkles className="w-3 h-3" />
          Premium Beauty Experience
        </div>
        <h1
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          style={{ color: "#3d2520" }}
        >
          Welcome to
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #bc8f7e, #a0695a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sheeza Salon
          </span>
        </h1>
        <p
          className="mt-6 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
          style={{ color: "#7a6a5f" }}
        >
          Indulge in luxury beauty services crafted to make you feel radiant, confident, and
          absolutely stunning.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#categories"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full gradient-rose text-primary-foreground font-medium shadow-rose hover:shadow-rose-lg transition-shadow text-sm"
          >
            Explore Services
          </a>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-border bg-card text-foreground font-medium hover:bg-accent transition-colors text-sm"
          >
            Book via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
