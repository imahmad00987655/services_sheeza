import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, FileText, Phone, Sparkles, User, X } from "lucide-react";
import { toast } from "sonner";
import type { Service } from "@/lib/salon-store";
import { useSalonMutations } from "@/hooks/use-salon-data";

const FORM_ID = "booking-form-main";

interface Props {
  services: Service[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ services, open, onClose, onSuccess }: Props) {
  const { submitBooking } = useSalonMutations();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [success, setSuccess] = useState(false);

  const total = services.reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    if (!services.length) {
      toast.error("Select at least one service.");
      return;
    }
    try {
      await submitBooking.mutateAsync({
        customerName: name.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
        services: services.map((s) => ({ id: s.id, name: s.name, price: s.price })),
        totalPrice: total,
        dateTime: dateTime ? new Date(dateTime).toISOString() : "",
      });
      setSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit booking.");
    }
  };

  const handleClose = () => {
    if (success) onSuccess();
    setSuccess(false);
    setName("");
    setPhone("");
    setNotes("");
    setDateTime("");
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center p-0 sm:p-4 bg-salon-dark/50 backdrop-blur-md"
        onClick={handleClose}
      >
        <motion.div
          initial={{ y: 32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card shadow-rose-lg w-full sm:max-w-2xl sm:rounded-2xl border border-border flex flex-col max-h-[100dvh] sm:max-h-[min(92dvh,820px)] rounded-none sm:overflow-hidden"
        >
          {success ? (
            <div className="p-8 sm:p-12 text-center flex flex-col justify-center flex-1">
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.45 }}
              >
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">Thank you</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Your booking request was received. Our team will contact you shortly to confirm your
                appointment.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 px-10 py-3 rounded-full gradient-rose text-primary-foreground font-medium text-sm shadow-rose"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-border shrink-0 bg-gradient-to-br from-card to-muted/30">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-rose-gold mb-1">
                    Reservation
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    Book your service
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    Share your details and preferred time. We will confirm your slot by phone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain min-h-0">
                <div className="grid lg:grid-cols-5 gap-0">
                  <form
                    id={FORM_ID}
                    onSubmit={handleSubmit}
                    className="lg:col-span-3 p-5 sm:p-6 space-y-5 border-b lg:border-b-0 lg:border-r border-border"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-primary" /> Full name *
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        maxLength={100}
                        autoComplete="name"
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                        placeholder="As it appears on your ID"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-primary" /> Phone number *
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength={20}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                        placeholder="03XX-XXXXXXX"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred date & time
                      </label>
                      <input
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        type="datetime-local"
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[44px]"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Optional — we will confirm the final time with you.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-primary" /> Notes{" "}
                        <span className="font-normal text-muted-foreground">(optional)</span>
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[88px]"
                        placeholder="Allergies, occasion, or stylist preference…"
                      />
                    </div>
                  </form>

                  <aside className="lg:col-span-2 p-5 sm:p-6 bg-muted/40 lg:bg-muted/25 flex flex-col min-h-0">
                    <div className="flex items-center gap-2 mb-4 shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Your selection
                      </span>
                    </div>
                    <ul className="space-y-2.5 mb-5 flex-1 overflow-y-auto min-h-0 max-h-[36vh] lg:max-h-[320px] pr-1">
                      {services.map((s) => (
                        <li
                          key={s.id}
                          className="flex justify-between gap-3 text-sm rounded-xl bg-card border border-border/80 px-3 py-2.5"
                        >
                          <span className="text-foreground font-medium leading-snug">{s.name}</span>
                          <span className="text-muted-foreground shrink-0 font-display">
                            Rs. {Math.round(s.price).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between shrink-0">
                      <span className="font-display font-bold text-foreground">
                        Estimated total
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        Rs. {Math.round(total).toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="submit"
                      form={FORM_ID}
                      disabled={submitBooking.isPending}
                      className="hidden lg:flex w-full mt-5 py-3.5 rounded-xl gradient-rose text-primary-foreground font-semibold text-sm shadow-rose items-center justify-center disabled:opacity-60 min-h-[48px]"
                    >
                      {submitBooking.isPending ? "Sending…" : "Submit booking request"}
                    </button>
                  </aside>
                </div>
              </div>

              <div className="lg:hidden border-t border-border p-4 bg-card/95 backdrop-blur-sm shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                  type="submit"
                  form={FORM_ID}
                  disabled={submitBooking.isPending}
                  className="w-full py-3.5 rounded-xl gradient-rose text-primary-foreground font-semibold text-sm shadow-rose disabled:opacity-60 min-h-[48px]"
                >
                  {submitBooking.isPending ? "Sending…" : "Submit booking request"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
