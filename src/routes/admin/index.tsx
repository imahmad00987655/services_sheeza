import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ClipboardList,
  FolderOpen,
  Scissors,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { useSalonStats } from "@/hooks/use-salon-data";
import { isRemoteApi } from "@/lib/env";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useSalonStats();

  const cards = data
    ? [
        { label: "Total Categories", value: data.totalCategories, icon: FolderOpen },
        { label: "Total Services", value: data.totalServices, icon: Scissors },
        { label: "Total Requests", value: data.totalRequests, icon: ClipboardList },
        { label: "Pending Requests", value: data.pendingRequests, icon: TrendingUp },
        { label: "Popular Services", value: data.popularCount, icon: Star },
      ]
    : [];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back to Sheeza Salon admin panel
          </p>
        </div>
        {isRemoteApi() && (
          <p className="text-[11px] text-muted-foreground max-w-md">
            Live data from MySQL via PHP API. If numbers look empty, import{" "}
            <code className="text-xs">backend/database.sql</code> in phpMyAdmin and set{" "}
            <code className="text-xs">VITE_PHP_API_BASE</code> to your API folder URL.
          </p>
        )}
      </div>

      {!isRemoteApi() && (
        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          <strong className="font-semibold">
            MySQL se data yahan tab dikhega jab app API se connect ho.
          </strong>{" "}
          Abhi demo mode hai: data sirf browser ke <code className="text-xs">localStorage</code>{" "}
          mein hai — phpMyAdmin wala database is mode se link nahi hota. Project root mein{" "}
          <code className="text-xs">.env</code> bana kar likhein{" "}
          <code className="text-xs">VITE_PHP_API_BASE=http://localhost/APKA_FOLDER/api</code> (jahan
          PHP <code className="text-xs">index.php</code> hai), phir{" "}
          <code className="text-xs">npm run dev</code> dubara chalayein. DB check: browser mein{" "}
          <code className="text-xs break-all">…/api/index.php?resource=ping</code> kholein — row
          counts dikhne chahiye.
        </div>
      )}

      {isError && (
        <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load dashboard."}{" "}
          <button type="button" onClick={() => refetch()} className="ml-2 underline font-medium">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-rose">
                <Skeleton className="h-10 w-10 rounded-xl mb-3" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))
          : cards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl p-5 shadow-rose"
              >
                <div className="w-10 h-10 rounded-xl gradient-rose flex items-center justify-center mb-3">
                  <card.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </motion.div>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground">Popular Services</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : !data?.popularServices.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No popular services yet
            </p>
          ) : (
            <ul className="space-y-2">
              {data.popularServices.map((svc) => (
                <li
                  key={svc.id}
                  className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5 border border-border/60"
                >
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-accent">
                    {svc.image ? (
                      <img src={svc.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full gradient-rose opacity-40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{svc.name}</p>
                    <p className="text-[11px] text-muted-foreground">{svc.duration}</p>
                  </div>
                  <span className="font-display text-sm font-bold text-foreground shrink-0">
                    Rs. {Math.round(svc.price).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h3 className="font-display font-bold text-foreground">Recent Requests</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : !data?.recentRequests.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">No requests yet</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {data.recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/60 border border-border/60"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {req.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {req.services.map((s) => s.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-sm text-foreground">
                      Rs. {Math.round(req.totalPrice).toLocaleString()}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        req.status === "pending"
                          ? "bg-accent text-accent-foreground"
                          : req.status === "cancelled"
                            ? "bg-destructive/15 text-destructive"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
