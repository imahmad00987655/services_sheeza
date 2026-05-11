import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, GripVertical, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/salon-store";
import { useSalonCategories, useSalonMutations } from "@/hooks/use-salon-data";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { data: categories = [], isLoading, isError, error, refetch } = useSalonCategories();
  const { createCategory, updateCategory, deleteCategory, toggleCategoryEnabled } =
    useSalonMutations();

  const [editing, setEditing] = useState<Category | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", order: 1, enabled: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setForm({ name: "", order: 1, enabled: true });
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const openAdd = () => {
    resetForm();
    setForm((f) => ({ ...f, order: Math.max(1, categories.length + 1) }));
    setAdding(true);
    setEditing(null);
  };

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setAdding(false);
    setForm({ name: cat.name, order: cat.order, enabled: cat.enabled });
    setImageFile(null);
    setImagePreview(cat.image || null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const closeModal = () => {
    setAdding(false);
    setEditing(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }
    try {
      if (editing) {
        await updateCategory.mutateAsync({
          id: editing.id,
          input: {
            name: form.name.trim(),
            order: form.order,
            enabled: form.enabled,
            imageFile,
            imageUrl: imageFile ? undefined : editing.image,
          },
        });
        toast.success("Category updated.");
      } else {
        await createCategory.mutateAsync({
          name: form.name.trim(),
          order: form.order,
          enabled: form.enabled,
          imageFile,
        });
        toast.success("Category added.");
      }
      closeModal();
    } catch {
      /* errors surfaced by useSalonMutations onError */
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this category and all its services?")) return;
      try {
        await deleteCategory.mutateAsync(id);
        toast.success("Category deleted.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed.");
      }
    },
    [deleteCategory],
  );

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage service categories and cover images
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-rose text-primary-foreground text-sm font-medium shadow-rose shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {isError && (
        <p className="mb-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load."}{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}

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
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-t-3xl sm:rounded-2xl shadow-rose-lg w-full sm:max-w-lg max-h-[min(92vh,640px)] flex flex-col border border-border"
            >
              <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {editing ? "Edit" : "Add"} Category
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
              <div className="overflow-y-auto p-5 space-y-4 flex-1">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Cover image *</label>
                  <p className="text-[11px] text-muted-foreground mt-0.5 mb-2">
                    Upload a JPG, PNG, or WebP file. Stored on the server when using the PHP API, or
                    in the browser for local mode.
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setImageFile(f ?? null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 px-4 hover:bg-muted/50 transition-colors"
                  >
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt=""
                        className="max-h-36 w-full max-w-xs object-cover rounded-lg"
                      />
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      <ImagePlus className="w-4 h-4 text-primary" />
                      {imageFile || imagePreview ? "Change image" : "Choose image"}
                    </span>
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Display order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 1 }))
                    }
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                    className="rounded border-input"
                  />
                  <span className="text-sm text-foreground">Visible on the public site</span>
                </label>
              </div>
              <div className="p-5 border-t border-border shrink-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="w-full py-3 rounded-xl gradient-rose text-primary-foreground text-sm font-medium shadow-rose disabled:opacity-60"
                >
                  {editing ? "Update category" : "Add category"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading categories…</p>
        )}
        {!isLoading &&
          sorted.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 sm:gap-4 p-4 bg-card border border-border rounded-2xl"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                {cat.image ? (
                  <img src={cat.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full gradient-rose opacity-30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-foreground truncate">{cat.name}</h4>
                <p className="text-xs text-muted-foreground">Order: {cat.order}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleCategoryEnabled.mutate(cat)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    cat.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                  aria-label={cat.enabled ? "Hide category" : "Show category"}
                >
                  {cat.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(cat)}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
