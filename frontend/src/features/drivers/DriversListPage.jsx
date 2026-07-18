import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { driverApi } from "@/api/driver.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DRIVER_STATUS_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canManageFleet } from "@/lib/roles";
import { formatDate } from "@/lib/formatters";

export default function DriversListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["drivers", { page, search, status }],
    queryFn: () => driverApi.list({ page, limit: 10, search: search || undefined, status: status || undefined }),
  });

  const rows = data?.drivers ?? data?.data ?? data?.rows ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageHeader
        title="Drivers"
        description="Manage your driver roster."
        actions={canManageFleet(user?.role) && (
          <Link to="/drivers/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New driver
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, email, employee ID…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {DRIVER_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">License</th>
              <th className="px-4 py-3">Region</th>
              <th className="px-4 py-3">License expires</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No drivers found.</td></tr>
            )}
            {rows.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/drivers/${d.id}`} className="hover:underline">{d.employeeId}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{d.firstName} {d.lastName}</td>
                <td className="px-4 py-3 text-slate-700">{d.licenseNumber}</td>
                <td className="px-4 py-3 text-slate-700">{d.region}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(d.licenseExpiry)}</td>
                <td className="px-4 py-3"><StatusBadge value={d.status} /></td>
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
