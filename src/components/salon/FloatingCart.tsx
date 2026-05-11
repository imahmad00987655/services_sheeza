import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/salon-store";

interface Props {
  services: Service[];
  onRemove: (id: string) => void;
  onContinue: () => void;
}

export function FloatingCart({ services, onRemove, onContinue }: Props) {
  const total = services.reduce((sum, s) => sum + s.price, 0);

  if (services.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-lg mx-auto glass-strong rounded-2xl shadow-rose-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{services.length} service{services.length > 1 ? 's' : ''} selected</span>
          </div>
          <span className="font-display font-bold text-foreground">Rs. {total.toLocaleString()}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3 max-h-20 overflow-auto">
          <AnimatePresence>
            {services.map(s => (
              <motion.div
                key={s.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs"
              >
                {s.name}
                <button onClick={() => onRemove(s.id)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-xl gradient-rose text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-rose hover:shadow-rose-lg transition-shadow"
        >
          Continue to Book <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
