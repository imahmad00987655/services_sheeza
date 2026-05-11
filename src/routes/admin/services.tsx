import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Eye, EyeOff, ImagePlus, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { Service } from "@/lib/salon-store";
import { useSalonCategories, useSalonMutations, useSalonServices } from "@/hooks/use-salon-data";

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

const emptyForm = {
  categoryId: "",
  name: "",
  price: 0,
  duration: "",
  description: "",
  popular: false,
  enabled: true,
};

function AdminServices() {
  const { data: services = [], isLoading: loadingSvcs } = useSalonServices();
  const { data: categories = [], isLoading: loadingCats } = useSalonCategories();
  const { createService, updateService, deleteService, toggleServiceEnabled } = useSalonMutations();

  const [editing, setEditing] = useState<Service | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [filterCat, setFilterCat] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filterCat ? services.filter((s) => s.categoryId === filterCat) : services;

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const resetModal = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const openAdd = () => {
    resetModal();
    setEditing(null);
    setAdding(true);
    setForm((f) => ({ ...f, categoryId: categories[0]?.id ?? "" }));
  };

  const startEdit = (svc: Service) => {
    setAdding(false);
    setEditing(svc);
    setForm({
      categoryId: svc.categoryId,
      name: svc.name,
      price: Math.round(svc.price),
      duration: svc.duration,
      description: svc.description,
      popular: svc.popular,
      enabled: svc.enabled,
    });
    setImageFile(null);
    setImagePreview(svc.image || null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeModal = () => {
    setAdding(false);
    setEditing(null);
    resetModal();
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.categoryId) {
      toast.error("Name and category are required.");
      return;
    }
    try {
      if (editing) {
        await updateService.mutateAsync({
          id: editing.id,
          input: {
            categoryId: form.categoryId,
            name: form.name.trim(),
            price: form.price,
            duration: form.duration.trim(),
            description: form.description.trim(),
            popular: form.popular,
            enabled: form.enabled,
            imageFile,
            imageUrl: imageFile ? undefined : editing.image,
          },
        });
        toast.success("Service updated.");
      } else {
        await createService.mutateAsync({
          categoryId: form.categoryId,
          name: form.name.trim(),
          price: form.price,
          duration: form.duration.trim(),
          description: form.description.trim(),
          popular: form.popular,
          enabled: form.enabled,
          imageFile: imageFile ?? undefined,
          imageUrl: imageFile ? undefined : "",
        });
        toast.success("Service added.");
      }
      closeModal();
    } catch {
      /* errors surfaced by useSalonMutations onError */
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this service?")) return;
      try {
        await deleteService.mutateAsync(id);
        toast.success("Service deleted.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed.");
      }
    },
    [deleteService],
  );

  const getCatName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Unknown";

  const isLoading = loadingSvcs || loadingCats;

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground">Manage salon services and photos</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={!categories.length}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-rose text-primary-foreground text-sm font-medium shadow-rose shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => setFilterCat("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            !filterCat
              ? "gradient-rose text-primary-foreground"
              : "bg-accent text-accent-foreground"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterCat === c.id
                ? "gradient-rose text-primary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {(adding || editing) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-salon-dark/50 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ y: 56, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 56, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-3xl sm:rounded-2xl shadow-rose-lg w-full sm:max-w-lg max-h-[min(94vh,720px)] flex flex-col border border-border"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editing ? "Edit" : "Add"} Service
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 flex-1 min-h-0">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Category *</label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Image</label>
                  <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">
                    Optional for new services; recommended for the public catalog.
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 px-4 hover:bg-muted/50 transition-colors"
                  >
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt=""
                        className="max-h-32 w-full max-w-xs object-cover rounded-lg"
                      />
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      <ImagePlus className="w-4 h-4 text-primary" />
                      {imagePreview ? "Change image" : "Upload image"}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Price (Rs.)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.price || ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: parseInt(e.target.value, 10) || 0 }))
                      }
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Duration</label>
                    <input
                      value={form.duration}
                      onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                      placeholder="e.g. 45 min"
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(e) => setForm((f) => ({ ...f, popular: e.target.checked }))}
                      className="rounded border-input"
                    />
                    <span className="text-sm text-foreground">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enabled}
                      onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                      className="rounded border-input"
                    />
                    <span className="text-sm text-foreground">Enabled</span>
                  </label>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-border shrink-0 bg-card">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createService.isPending || updateService.isPending}
                  className="w-full py-3 rounded-xl gradient-rose text-primary-foreground text-sm font-medium shadow-rose disabled:opacity-60"
                >
                  {editing ? "Update service" : "Add service"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading services…</p>
        )}
        {!isLoading &&
          filtered.map((svc, i) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="flex items-center gap-3 sm:gap-4 p-4 bg-card border border-border rounded-2xl"
            >
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                {svc.image ? (
                  <img src={svc.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full gradient-rose opacity-30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-display font-semibold text-foreground text-sm truncate">
                    {svc.name}
                  </h4>
                  {svc.popular && (
                    <Star className="w-3.5 h-3.5 text-rose-gold fill-rose-gold shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {getCatName(svc.categoryId)} · <Clock className="w-3 h-3 inline" /> {svc.duration}
                </p>
              </div>
              <span className="font-display font-bold text-sm text-foreground whitespace-nowrap shrink-0">
                Rs. {Math.round(svc.price).toLocaleString()}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleServiceEnabled.mutate(svc)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    svc.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={svc.enabled ? "Disable" : "Enable"}
                >
                  {svc.enabled ? (
                    <Eye className="w-3.5 h-3.5" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(svc)}
                  className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(svc.id)}
                  className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
