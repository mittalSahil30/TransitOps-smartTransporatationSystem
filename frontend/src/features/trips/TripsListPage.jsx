import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { tripApi } from "@/api/trip.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TRIP_STATUS_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canOperateTrips } from "@/lib/roles";
import { formatDateTime } from "@/lib/formatters";

export default function TripsListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["trips", { page, search, status }],
    queryFn: () => tripApi.list({ page, limit: 10, search: search || undefined, status: status || undefined }),
  });

  const rows = data?.trips ?? data?.data ?? data?.rows ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageHeader
        title="Trips"
        description="Dispatch and track fleet movements."
        actions={canOperateTrips(user?.role) && (
          <Link to="/trips/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New trip
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search trip #, origin, destination…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {TRIP_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Trip #</th>
              <th className="px-4 py-3">Route</th>
              <th className="px-4 py-3">Departure</th>
              <th className="px-4 py-3">Expected arrival</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No trips yet.</td></tr>
            )}
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/trips/${t.id}`} className="hover:underline">{t.tripNumber}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{t.origin} → {t.destination}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(t.departureTime)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDateTime(t.expectedArrival)}</td>
                <td className="px-4 py-3"><StatusBadge value={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {pagination.page} of {pagination.totalPages} · {pagination.total} total</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40">Prev</button>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
