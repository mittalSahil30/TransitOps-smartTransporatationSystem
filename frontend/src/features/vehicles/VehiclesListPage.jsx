import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { vehicleApi } from "@/api/vehicle.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPES } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canManageFleet } from "@/lib/roles";
import { formatNumber } from "@/lib/formatters";

export default function VehiclesListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", { page, search, status, type }],
    queryFn: () => vehicleApi.list({ page, limit: 10, search: search || undefined, status: status || undefined, type: type || undefined }),
  });

  const rows = data?.vehicles ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageHeader
        title="Vehicles"
        description="Manage the fleet register."
        actions={canManageFleet(user?.role) && (
          <Link to="/vehicles/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New vehicle
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search reg. number or name…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {VEHICLE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Reg. #</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">Odometer</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No vehicles found.</td></tr>
            )}
            {rows.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/vehicles/${v.id}`} className="hover:underline">{v.registrationNumber}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{v.vehicleName}</td>
                <td className="px-4 py-3 text-slate-700">{v.vehicleType}</td>
                <td className="px-4 py-3 text-slate-700">{v.region}</td>
                <td className="px-4 py-3 text-slate-700">{formatNumber(v.odometer, 0)} km</td>
                <td className="px-4 py-3"><StatusBadge value={v.status} /></td>
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
