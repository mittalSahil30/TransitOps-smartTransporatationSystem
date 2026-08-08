import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { expenseApi } from "@/api/expense.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/formatters";
import { useAuth } from "@/features/auth/AuthContext";
import { canDelete, canManageFleet } from "@/lib/roles";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-6 py-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default function ExpenseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({ queryKey: ["expense", id], queryFn: () => expenseApi.get(id) });

  const delMut = useMutation({
    mutationFn: () => expenseApi.remove(id),
    onSuccess: () => {
      toast.success("Expense deleted");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/expenses");
    },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  const vehicle = data.vehicle ?? data.Vehicle;
  const trip = data.trip ?? data.Trip;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={data.expenseNumber}
        description={data.expenseType}
        actions={
          <>
            {canManageFleet(user?.role) && (
              <Link to={`/expenses/${id}/edit`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                Edit
              </Link>
            )}
            {canDelete(user?.role) && (
              <button onClick={() => window.confirm("Delete this expense?") && delMut.mutate()}
                className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50">
                Delete
              </button>
            )}
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-100">
          <Row label="Vehicle" value={vehicle?.registrationNumber ?? "—"} />
          <Row label="Trip" value={trip?.tripNumber ?? "—"} />
          <Row label="Amount" value={formatCurrency(data.amount)} />
          <Row label="Payment method" value={data.paymentMethod} />
          <Row label="Expense date" value={formatDate(data.expenseDate)} />
          <Row label="Description" value={data.description || "—"} />
          <Row label="Created" value={formatDateTime(data.createdAt)} />
        </dl>
      </div>
    </div>
  );
}
