import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Ban, Calendar, CheckCircle2, ClipboardList, Phone, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import type { BookingRequest } from "@/lib/salon-store";
import { useSalonMutations, useSalonRequests } from "@/hooks/use-salon-data";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequests,
});

type Filter = "all" | BookingRequest["status"];

function statusBadge(status: BookingRequest["status"]) {
  if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
  if (status === "cancelled") return <Badge variant="destructive">Cancelled</Badge>;
  return <Badge className="bg-primary/15 text-primary hover:bg-primary/20">Completed</Badge>;
}

function AdminRequests() {
  const { data: requests = [], isLoading, isError, error, refetch } = useSalonRequests();
  const { patchRequest, deleteRequest } = useSalonMutations();
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = useMemo(
    () =>
      [...requests].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [requests],
  );

  const filtered = filter === "all" ? sorted : sorted.filter((r) => r.status === filter);

  const exportCSV = () => {
    const rows = [["Name", "Phone", "Services", "Total", "Status", "Preferred", "Created"]];
    sorted.forEach((r) => {
      rows.push([
        r.customerName,
        r.phone,
        r.services.map((s) => s.name).join("; "),
        String(Math.round(r.totalPrice)),
        r.status,
        r.dateTime ? new Date(r.dateTime).toLocaleString() : "",
        new Date(r.createdAt).toLocaleString(),
      ]);
    });
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sheeza-salon-requests.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported.");
  };

  const setStatus = async (id: string, status: BookingRequest["status"]) => {
    try {
      await patchRequest.mutateAsync({ id, status });
      toast.success("Request updated.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request permanently?")) return;
    try {
      await deleteRequest.mutateAsync(id);
      toast.success("Request deleted.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
  };

  return (
    <div className="p-6 md:p-8 pb-28 md:pb-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Customer Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading…" : `${requests.length} total · ${counts.pending} pending`}
          </p>
        </div>
        <button
          type="button"
          onClick={exportCSV}
          disabled={!requests.length}
          className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50 shrink-0"
        >
          Export CSV
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

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["all", "All"],
            ["pending", "Pending"],
            ["completed", "Completed"],
            ["cancelled", "Cancelled"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === key
                ? "gradient-rose text-primary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {label}
            <span className="ml-1 opacity-80">({counts[key]})</span>
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-220px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-[140px]">Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Services</TableHead>
                <TableHead className="text-right w-[100px]">Total</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="w-[160px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    Loading requests…
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    No requests in this view
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                filtered.map((r) => (
                  <TableRow key={r.id} className="border-border">
                    <TableCell className="font-medium align-top">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[120px]">{r.customerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="align-top text-muted-foreground text-sm">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        {r.phone}
                      </span>
                      <span className="flex items-center gap-1.5 mt-1 text-xs">
                        <Calendar className="w-3 h-3 shrink-0" />
                        {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="flex flex-wrap gap-1 max-w-[280px]">
                        {r.services.map((s) => (
                          <Badge key={s.id} variant="outline" className="text-[10px] font-normal">
                            {s.name}
                          </Badge>
                        ))}
                      </div>
                      {r.notes ? (
                        <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                          "{r.notes}"
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right font-display font-semibold align-top">
                      Rs. {Math.round(r.totalPrice).toLocaleString()}
                    </TableCell>
                    <TableCell className="align-top">{statusBadge(r.status)}</TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        {r.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => setStatus(r.id, "completed")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Done
                            </button>
                            <button
                              type="button"
                              onClick={() => setStatus(r.id, "cancelled")}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-destructive/15 hover:text-destructive"
                            >
                              <Ban className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </>
                        )}
                        {r.status === "completed" && (
                          <button
                            type="button"
                            onClick={() => setStatus(r.id, "pending")}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent"
                          >
                            Reopen
                          </button>
                        )}
                        {r.status === "cancelled" && (
                          <button
                            type="button"
                            onClick={() => setStatus(r.id, "pending")}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-accent"
                          >
                            Restore
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {isLoading && <p className="text-center py-12 text-muted-foreground text-sm">Loading…</p>}
        {!isLoading && filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground text-sm">No requests found</p>
        )}
        {!isLoading &&
          filtered.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="font-display font-semibold text-foreground truncate">
                      {req.customerName}
                    </h4>
                    {statusBadge(req.status)}
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      {req.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="font-display font-bold text-foreground shrink-0">
                  Rs. {Math.round(req.totalPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {req.services.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
              {req.notes ? (
                <p className="text-xs text-muted-foreground mb-3 italic border-l-2 border-primary/30 pl-2">
                  "{req.notes}"
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {req.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStatus(req.id, "completed")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(req.id, "cancelled")}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-xs font-medium"
                    >
                      <Ban className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                {(req.status === "completed" || req.status === "cancelled") && (
                  <button
                    type="button"
                    onClick={() => setStatus(req.id, "pending")}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted text-xs font-medium"
                  >
                    <ClipboardList className="w-4 h-4" /> Mark pending
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(req.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
