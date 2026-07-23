import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { maintenanceApi } from "@/api/maintenance.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MAINTENANCE_STATUS_OPTIONS, MAINTENANCE_TYPE_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canManageFleet } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function MaintenanceListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["maintenance", { page, search, status, type }],
    queryFn: () => maintenanceApi.list({
      page, limit: 10,
      search: search || undefined,
      status: status || undefined,
      maintenanceType: type || undefined,
    }),
  });

  const rows = data?.maintenance ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageHeader
        title="Maintenance"
        description="Track scheduled and in-progress vehicle service."
        actions={canManageFleet(user?.role) && (
          <Link to="/maintenance/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New maintenance
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search description or service center…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {MAINTENANCE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All types</option>
          {MAINTENANCE_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Service center</th>
              <th className="px-4 py-3">Scheduled</th>
              <th className="px-4 py-3">Est. cost</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No maintenance records found.</td></tr>
            )}
            {rows.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/maintenance/${m.id}`} className="hover:underline">
                    {m.vehicle?.registrationNumber ?? `#${m.vehicleId}`}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{m.maintenanceType}</td>
                <td className="px-4 py-3 text-slate-700">{m.serviceCenter}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(m.scheduledDate)}</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(m.estimatedCost)}</td>
                <td className="px-4 py-3"><StatusBadge value={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Page {pagination.page} of {pagination.totalPages} · {pagination.totalRecords ?? pagination.total} total</span>
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
