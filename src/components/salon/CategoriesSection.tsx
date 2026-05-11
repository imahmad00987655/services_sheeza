import { motion } from "framer-motion";
import type { Category } from "@/lib/salon-store";

interface Props {
  categories: Category[];
  onSelect: (cat: Category) => void;
}

export function CategoriesSection({ categories, onSelect }: Props) {
  const enabled = categories.filter((c) => c.enabled).sort((a, b) => a.order - b.order);

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="text-xs tracking-[0.25em] uppercase text-rose-gold mb-2">What We Offer</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Our Services
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {enabled.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => onSelect(cat)}
            className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-rose text-left"
          >
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 gradient-rose opacity-50" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-salon-dark/80 via-salon-dark/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-display text-sm md:text-base font-semibold text-cream">
                {cat.name}
              </h3>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
