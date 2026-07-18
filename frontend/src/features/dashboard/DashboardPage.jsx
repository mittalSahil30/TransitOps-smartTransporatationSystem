import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { vehicleApi } from "@/api/vehicle.api";
import { driverApi } from "@/api/driver.api";
import { tripApi } from "@/api/trip.api";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime } from "@/lib/formatters";

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

export default function DashboardPage() {
  const [vehiclesQ, driversQ, tripsQ, activeTripsQ] = useQueries({
    queries: [
      { queryKey: ["vehicles", { limit: 1 }], queryFn: () => vehicleApi.list({ limit: 1 }) },
      { queryKey: ["drivers", { limit: 1 }], queryFn: () => driverApi.list({ limit: 1 }) },
      { queryKey: ["trips", { limit: 5 }], queryFn: () => tripApi.list({ limit: 5, sortBy: "createdAt", order: "DESC" }) },
      { queryKey: ["trips", "active"], queryFn: () => tripApi.list({ status: "Dispatched", limit: 1 }) },
    ],
  });

  const trips = tripsQ.data?.trips ?? tripsQ.data?.data ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vehicles" value={vehiclesQ.data?.pagination?.total ?? "—"} to="/vehicles" />
        <StatCard label="Drivers" value={driversQ.data?.pagination?.total ?? "—"} to="/drivers" />
        <StatCard label="Total trips" value={tripsQ.data?.pagination?.total ?? "—"} to="/trips" />
        <StatCard label="Active dispatches" value={activeTripsQ.data?.pagination?.total ?? "—"} hint="Currently on the road" to="/trips" />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent trips</h2>
          <Link to="/trips" className="text-sm font-medium text-slate-600 hover:text-slate-900">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Trip #</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Departure</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {trips.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-10 text-center text-slate-500">No trips yet.</td></tr>
              )}
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link to={`/trips/${t.id}`} className="hover:underline">{t.tripNumber}</Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{t.origin} → {t.destination}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDateTime(t.departureTime)}</td>
                  <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
