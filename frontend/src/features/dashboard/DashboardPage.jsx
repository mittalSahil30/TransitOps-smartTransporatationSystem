import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { dashboardApi } from "@/api/dashboard.api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["#0f172a", "#3b82f6", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"];

function StatCard({ label, value, hint, to }) {
  const body = (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

function Panel({ title, action, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ label }) {
  return <div className="grid h-full min-h-[220px] place-items-center text-sm text-slate-400">{label}</div>;
}

export default function DashboardPage() {
  const overviewQ = useQuery({ queryKey: ["dashboard", "overview"], queryFn: dashboardApi.overview });
  const analyticsQ = useQuery({ queryKey: ["dashboard", "analytics"], queryFn: dashboardApi.analytics });
  const recentQ = useQuery({ queryKey: ["dashboard", "recent"], queryFn: dashboardApi.recent });

  const overview = overviewQ.data ?? {};
  const analytics = analyticsQ.data ?? {};
  const recent = recentQ.data ?? {};

  const monthlyTrips = (analytics.monthlyTrips ?? []).map((m) => ({
    label: `${MONTHS[(m.month ?? 1) - 1]} '${String(m.year).slice(2)}`,
    count: m.count ?? 0,
  }));

  const monthlyFuelCost = (analytics.monthlyFuelCost ?? []).map((m) => ({
    label: `${MONTHS[(m.month ?? 1) - 1]} '${String(m.year).slice(2)}`,
    cost: m.totalCost ?? m.cost ?? 0,
  }));

  const tripStatus = Object.entries(analytics.tripStatusDistribution ?? {}).map(([name, value]) => ({ name, value }));
  const maintenanceStatus = Object.entries(analytics.maintenanceStatusDistribution ?? {}).map(([name, value]) => ({ name, value }));

  const recentTrips = recent.recentTrips ?? [];
  const recentFuelLogs = recent.recentFuelLogs ?? [];
  const recentMaintenance = recent.recentMaintenance ?? [];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vehicles" value={overview.totalVehicles ?? "—"} to="/vehicles" />
        <StatCard label="Drivers" value={overview.totalDrivers ?? "—"} to="/drivers" />
        <StatCard label="Trips" value={overview.totalTrips ?? "—"} to="/trips" />
        <StatCard label="Active trips" value={overview.dispatchedTrips ?? "—"} hint="Currently dispatched" to="/trips" />
        <StatCard label="Fuel cost" value={formatCurrency(overview.totalFuelCost)} to="/fuel" />
        <StatCard label="Maintenance" value={(overview.scheduledMaintenance ?? 0) + (overview.inProgressMaintenance ?? 0)} hint="Scheduled + in progress" to="/maintenance" />
        <StatCard label="Fuel logs" value={overview.fuelLogsCount ?? "—"} to="/fuel" />
        <StatCard label="Vehicles in service" value={overview.availableVehicles ?? "—"} hint={`of ${overview.totalVehicles ?? "—"} total`} to="/vehicles" />
      </div>

      {/* Trip overview */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Trip overview</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel title="Trips (last 12 months)">
            <div className="h-64">
              {monthlyTrips.length === 0 ? <EmptyState label="No trip data yet" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrips}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="Trips" stroke="#0f172a" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel title="Trip status">
            <div className="h-64">
              {tripStatus.length === 0 ? <EmptyState label="No trip data yet" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tripStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {tripStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel title="Maintenance status">
            <div className="h-64">
              {maintenanceStatus.length === 0 ? <EmptyState label="No maintenance data yet" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={maintenanceStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                      {maintenanceStatus.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* Fuel & maintenance */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Fuel & maintenance</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Fuel expense (monthly)">
            <div className="h-64">
              {monthlyFuelCost.length === 0 ? <EmptyState label="No fuel data yet" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFuelCost}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="cost" name="Fuel cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>

          <Panel title="Maintenance status breakdown">
            <div className="h-64">
              {maintenanceStatus.length === 0 ? <EmptyState label="No maintenance data yet" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maintenanceStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                    <Tooltip />
                    <Bar dataKey="value" name="Records" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* Recent trips */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent trips</h2>
          <Link to="/trips" className="text-sm font-medium text-slate-600 hover:text-slate-900">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Trip #</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Departure</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentTrips.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No recent trips.</td></tr>
              )}
              {recentTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/trips/${t.id}`} className="hover:underline">{t.tripNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.Vehicle?.registrationNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {t.Driver ? `${t.Driver.firstName} ${t.Driver.lastName}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(t.departureTime)}</td>
                  <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent fuel logs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent fuel logs</h2>
          <Link to="/fuel" className="text-sm font-medium text-slate-600 hover:text-slate-900">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Receipt</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Total cost</th>
                <th className="px-4 py-3">Filled at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentFuelLogs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No recent fuel logs.</td></tr>
              )}
              {recentFuelLogs.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/fuel/${f.id}`} className="hover:underline">{f.receiptNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{f.Vehicle?.registrationNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(f.totalCost)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(f.filledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming maintenance */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming maintenance</h2>
          <Link to="/maintenance" className="text-sm font-medium text-slate-600 hover:text-slate-900">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Scheduled date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {recentMaintenance.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-10 text-center text-slate-500">No upcoming maintenance.</td></tr>
              )}
              {recentMaintenance.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/maintenance/${m.id}`} className="hover:underline">{m.Vehicle?.registrationNumber ?? "—"}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatDate(m.scheduledDate)}</td>
                  <td className="px-4 py-3"><StatusBadge value={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
