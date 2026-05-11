import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Plus, Check, Star } from "lucide-react";
import type { Category, Service } from "@/lib/salon-store";

interface Props {
  category: Category;
  services: Service[];
  selectedIds: Set<string>;
  onToggle: (svc: Service) => void;
  onBack: () => void;
}

export function ServicesSection({ category, services, selectedIds, onToggle, onBack }: Props) {
  const enabled = services.filter((s) => s.enabled && s.categoryId === category.id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </button>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {category.name}
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {enabled.map((svc, i) => {
            const selected = selectedIds.has(svc.id);
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl overflow-hidden bg-card border transition-all ${selected ? "border-primary shadow-rose" : "border-border"}`}
              >
                {svc.popular && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full gradient-rose text-primary-foreground text-[10px] font-medium">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {svc.image ? (
                    <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-rose opacity-40" aria-hidden />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-foreground">{svc.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {svc.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {svc.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-display font-bold text-lg text-foreground">
                      Rs. {svc.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onToggle(svc)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        selected
                          ? "gradient-rose text-primary-foreground shadow-rose"
                          : "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {enabled.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No services available in this category yet.</p>
        </div>
      )}
    </section>
  );
}
