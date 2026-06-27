import { createFileRoute, Link, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, FolderOpen, Scissors, QrCode, ClipboardList, LogOut } from "lucide-react";
import { getAdminUser, isAuthenticated, logout } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    const isLoginPage = location.pathname === "/admin/login";
    const authed = isAuthenticated();

    if (!isLoginPage && !authed) {
      throw redirect({ to: "/admin/login" });
    }
    if (isLoginPage && authed) {
      throw redirect({ to: "/admin" });
    }
  },
  component: AdminLayout,
});

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Categories", path: "/admin/categories", icon: FolderOpen },
  { label: "Services", path: "/admin/services", icon: Scissors },
  { label: "Requests", path: "/admin/requests", icon: ClipboardList },
  { label: "QR Code", path: "/admin/qrcode", icon: QrCode },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getAdminUser();

  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const handleLogout = async () => {
    await logout();
    void navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full gradient-rose flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold">S</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-sm">Sheeza Salon</h2>
              <p className="text-[10px] text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          {user && (
            <p className="text-[11px] text-muted-foreground mt-3 truncate">{user.fullName || user.email}</p>
          )}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            const isExact = item.path === "/admin" && location.pathname === "/admin";
            const isActive = isExact || active;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "gradient-rose text-primary-foreground shadow-rose"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            Back to Salon
          </Link>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const active =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            const isExact = item.path === "/admin" && location.pathname === "/admin";
            const isActive = isExact || active;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}
