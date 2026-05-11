import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SalonHeader, SalonFooter } from "@/components/salon/SalonLayout";
import { HeroSection } from "@/components/salon/HeroSection";
import { CategoriesSection } from "@/components/salon/CategoriesSection";
import { ServicesSection } from "@/components/salon/ServicesSection";
import { FloatingCart } from "@/components/salon/FloatingCart";
import { BookingModal } from "@/components/salon/BookingModal";
import type { Category, Service } from "@/lib/salon-store";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useSalonCategories, useSalonServices } from "@/hooks/use-salon-data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sheeza Salon — Premium Women's Beauty Services" },
      {
        name: "description",
        content:
          "Experience luxury beauty services at Sheeza Salon. Hair, Makeup, Facial, Spa, Bridal Packages & more.",
      },
      { property: "og:title", content: "Sheeza Salon — Premium Beauty" },
      { property: "og:description", content: "Luxury beauty services for the modern woman." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: categories = [], isLoading: catLoading, isError: catErr } = useSalonCategories();
  const { data: allServices = [], isLoading: svcLoading, isError: svcErr } = useSalonServices();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const [bookingOpen, setBookingOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedServices = useMemo(
    () => allServices.filter((s) => selectedServiceIds.has(s.id)),
    [allServices, selectedServiceIds],
  );

  const toggleService = useCallback((svc: Service) => {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      if (next.has(svc.id)) next.delete(svc.id);
      else next.add(svc.id);
      return next;
    });
  }, []);

  const removeService = useCallback((id: string) => {
    setSelectedServiceIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allServices.filter(
      (s) =>
        s.enabled && (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
    );
  }, [search, allServices]);

  const popularServices = useMemo(
    () => allServices.filter((s) => s.enabled && s.popular),
    [allServices],
  );

  const loading = catLoading || svcLoading;

  return (
    <div className="min-h-screen bg-background">
      <SalonHeader />
      {!selectedCategory && <HeroSection />}

      {!selectedCategory && (catErr || svcErr) && (
        <div className="max-w-xl mx-auto px-4 py-4 text-sm text-destructive text-center">
          Could not load catalog. Check your connection or API configuration.
        </div>
      )}

      {!selectedCategory && (
        <div className="max-w-xl mx-auto px-4 -mt-4 relative z-10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-strong shadow-rose">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              disabled={loading}
              className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {loading && !selectedCategory && (
        <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl w-full" />
          ))}
        </section>
      )}

      {!loading && searchResults && searchResults.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h3 className="font-display text-xl font-bold text-foreground mb-4">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((svc) => (
              <ServiceMiniCard
                key={svc.id}
                svc={svc}
                selected={selectedServiceIds.has(svc.id)}
                onToggle={() => toggleService(svc)}
              />
            ))}
          </div>
        </section>
      )}

      {!loading && !selectedCategory && !search && popularServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-rose-gold mb-2">Most Loved</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Popular Services
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularServices.slice(0, 6).map((svc) => (
              <ServiceMiniCard
                key={svc.id}
                svc={svc}
                selected={selectedServiceIds.has(svc.id)}
                onToggle={() => toggleService(svc)}
              />
            ))}
          </div>
        </section>
      )}

      {!loading &&
        (selectedCategory ? (
          <ServicesSection
            category={selectedCategory}
            services={allServices}
            selectedIds={selectedServiceIds}
            onToggle={toggleService}
            onBack={() => setSelectedCategory(null)}
          />
        ) : (
          !search && <CategoriesSection categories={categories} onSelect={setSelectedCategory} />
        ))}

      <AnimatePresence>
        {selectedServices.length > 0 && (
          <FloatingCart
            services={selectedServices}
            onRemove={removeService}
            onContinue={() => setBookingOpen(true)}
          />
        )}
      </AnimatePresence>

      <BookingModal
        services={selectedServices}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={() => {
          setSelectedServiceIds(new Set());
          setSelectedCategory(null);
        }}
      />

      <SalonFooter />
    </div>
  );
}

function ServiceMiniCard({
  svc,
  selected,
  onToggle,
}: {
  svc: Service;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`flex gap-3 p-3 rounded-xl bg-card border transition-all cursor-pointer ${selected ? "border-primary shadow-rose" : "border-border"}`}
      onClick={onToggle}
    >
      <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-muted border border-border">
        {svc.image ? (
          <img src={svc.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-rose opacity-35" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-sm text-foreground truncate">{svc.name}</h4>
        <p className="text-xs text-muted-foreground truncate">{svc.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-display font-bold text-sm text-foreground">
            Rs. {Math.round(svc.price).toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">{svc.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}
