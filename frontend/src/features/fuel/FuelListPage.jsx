import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fuelApi } from "@/api/fuel.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { FUEL_TYPE_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canManageFleet } from "@/lib/roles";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/formatters";

export default function FuelListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fuelType, setFuelType] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["fuel", { page, search, fuelType }],
    queryFn: () => fuelApi.list({
      page, limit: 10,
      search: search || undefined,
      fuelType: fuelType || undefined,
    }),
  });

  const rows = data?.fuelLogs ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <PageHeader
        title="Fuel logs"
        description="Track fuel purchases and mileage across the fleet."
        actions={canManageFleet(user?.role) && (
          <Link to="/fuel/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New fuel log
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search receipt or station…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={fuelType} onChange={(e) => { setFuelType(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All fuel types</option>
          {FUEL_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Station</th>
              <th className="px-4 py-3">Fuel type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Total cost</th>
              <th className="px-4 py-3">Filled at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No fuel logs found.</td></tr>
            )}
            {rows.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/fuel/${f.id}`} className="hover:underline">
                    {f.vehicle?.registrationNumber ?? `#${f.vehicleId}`}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{f.stationName}</td>
                <td className="px-4 py-3 text-slate-700">{f.fuelType}</td>
                <td className="px-4 py-3 text-slate-700">{formatNumber(f.quantity, 1)} L</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(f.totalCost)}</td>
                <td className="px-4 py-3 text-slate-700">{formatDateTime(f.filledAt)}</td>
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
