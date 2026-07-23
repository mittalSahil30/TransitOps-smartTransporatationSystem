import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { canOperateTrips, canRegisterUsers } from "@/lib/roles";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 font-bold text-white">T</div>
          <div>
            <div className="text-sm font-bold text-slate-900">TransitOps</div>
            <div className="text-xs text-slate-500">Fleet console</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/vehicles" className={linkClass}>Vehicles</NavLink>
          <NavLink to="/drivers" className={linkClass}>Drivers</NavLink>
          {canOperateTrips(user?.role) && (
            <NavLink to="/trips" className={linkClass}>Trips</NavLink>
          )}
          <NavLink to="/maintenance" className={linkClass}>Maintenance</NavLink>
          <NavLink to="/fuel" className={linkClass}>Fuel</NavLink>
          <div className="pt-4">
            <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Account</div>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            {canRegisterUsers(user?.role) && (
              <NavLink to="/register" className={linkClass}>Create User</NavLink>
            )}
          </div>
        </nav>
        <div className="border-t border-slate-200 p-4">
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
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:hidden">
          <div className="font-bold text-slate-900">TransitOps</div>
          <button onClick={onLogout} className="text-sm text-slate-600">Sign out</button>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
