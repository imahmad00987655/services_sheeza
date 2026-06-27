import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { login } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@sheezasalon.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email aur password likhein.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      void navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf2f0] via-background to-[#f8f6f2] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-rose flex items-center justify-center mx-auto mb-4 shadow-rose">
            <span className="text-primary-foreground font-display font-bold text-2xl">S</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Signature by SHEEZA Saloon — admin panel
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-rose space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="admin@sheezasalon.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-primary" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gradient-rose text-primary-foreground font-semibold text-sm shadow-rose flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Back to salon website
          </Link>
        </p>
      </div>
    </div>
  );
}
