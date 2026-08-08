import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { expenseApi } from "@/api/expense.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/constants";
import { useAuth } from "@/features/auth/AuthContext";
import { canManageFleet } from "@/lib/roles";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ExpensesListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["expenses", { page, search, expenseType, paymentMethod, startDate, endDate }],
    queryFn: () => expenseApi.list({
      page, limit: 10,
      search: search || undefined,
      expenseType: expenseType || undefined,
      paymentMethod: paymentMethod || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
  });

  const rows = data?.expenses ?? [];
  const pagination = data?.pagination;

  const resetPage = (setter) => (e) => { setter(e.target.value); setPage(1); };

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Toll, parking, allowances, repairs, and other trip/vehicle costs."
        actions={canManageFleet(user?.role) && (
          <Link to="/expenses/new" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            + New expense
          </Link>
        )}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <input
          value={search} onChange={resetPage(setSearch)}
          placeholder="Search expense #…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          value={expenseType} onChange={resetPage(setExpenseType)}
          placeholder="Expense type…"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select value={paymentMethod} onChange={resetPage(setPaymentMethod)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">All payment methods</option>
          {PAYMENT_METHOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input type="date" value={startDate} onChange={resetPage(setStartDate)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        <input type="date" value={endDate} onChange={resetPage(setEndDate)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Expense #</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No expenses found.</td></tr>
            )}
            {rows.map((ex) => (
              <tr key={ex.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <Link to={`/expenses/${ex.id}`} className="hover:underline">{ex.expenseNumber}</Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{ex.vehicle?.registrationNumber ?? ex.Vehicle?.registrationNumber ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{ex.expenseType}</td>
                <td className="px-4 py-3 text-slate-700">{ex.paymentMethod}</td>
                <td className="px-4 py-3 text-slate-700">{formatDate(ex.expenseDate)}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{formatCurrency(ex.amount)}</td>
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
