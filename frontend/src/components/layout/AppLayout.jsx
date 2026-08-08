import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { canOperateTrips, canRegisterUsers } from "@/lib/roles";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

function SidebarNav({ user, onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      <NavLink to="/dashboard" className={linkClass} onClick={onNavigate}>Dashboard</NavLink>
      <NavLink to="/vehicles" className={linkClass} onClick={onNavigate}>Vehicles</NavLink>
      <NavLink to="/drivers" className={linkClass} onClick={onNavigate}>Drivers</NavLink>
      {canOperateTrips(user?.role) && (
        <NavLink to="/trips" className={linkClass} onClick={onNavigate}>Trips</NavLink>
      )}
      <NavLink to="/maintenance" className={linkClass} onClick={onNavigate}>Maintenance</NavLink>
      <NavLink to="/fuel" className={linkClass} onClick={onNavigate}>Fuel</NavLink>
      <NavLink to="/expenses" className={linkClass} onClick={onNavigate}>Expenses</NavLink>
      <div className="pt-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</div>
        <NavLink to="/profile" className={linkClass} onClick={onNavigate}>Profile</NavLink>
        {canRegisterUsers(user?.role) && (
          <NavLink to="/register" className={linkClass} onClick={onNavigate}>Create User</NavLink>
        )}
      </div>
    </nav>
  );
}

function UserFooter({ user, onLogout }) {
  return (
    <div className="shrink-0 border-t border-slate-200 p-4">
      <div className="mb-3">
        <div className="text-sm font-semibold text-slate-900">{user?.firstName} {user?.lastName}</div>
        <div className="text-xs text-slate-500">{user?.role}</div>
      </div>
      <button
        onClick={onLogout}
        className="w-full rounded-lg border border-slate-300 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Sign out
      </button>
    </div>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar — fixed height, independent scroll, always visible */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 font-bold text-white">T</div>
          <div>
            <div className="text-sm font-bold text-slate-900">TransitOps</div>
            <div className="text-xs text-slate-500">Fleet console</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav user={user} />
        </div>
        <UserFooter user={user} onLogout={onLogout} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 font-bold text-white">T</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">TransitOps</div>
                  <div className="text-xs text-slate-500">Fleet console</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-500 hover:text-slate-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarNav user={user} onNavigate={() => setMobileOpen(false)} />
            </div>
            <UserFooter user={user} onLogout={onLogout} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-600 hover:text-slate-900">
            <Menu className="h-5 w-5" />
          </button>
          <div className="font-bold text-slate-900">TransitOps</div>
          <button onClick={onLogout} className="text-sm text-slate-600">Sign out</button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}