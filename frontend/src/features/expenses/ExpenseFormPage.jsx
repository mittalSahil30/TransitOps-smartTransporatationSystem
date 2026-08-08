import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { expenseApi } from "@/api/expense.api";
import { vehicleApi } from "@/api/vehicle.api";
import { tripApi } from "@/api/trip.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { EXPENSE_TYPE_SUGGESTIONS, PAYMENT_METHOD_OPTIONS } from "@/lib/constants";

const empty = {
  expenseNumber: "", vehicleId: "", tripId: "", expenseType: "",
  amount: 0, paymentMethod: "Cash", expenseDate: "", description: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function ExpenseFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const vehiclesQ = useQuery({
    queryKey: ["vehicles", "for-expenses"],
    queryFn: () => vehicleApi.list({ limit: 100 }),
  });
  const tripsQ = useQuery({
    queryKey: ["trips", "for-expenses"],
    queryFn: () => tripApi.list({ limit: 100 }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => expenseApi.get(id),
    enabled: mode === "edit" && Boolean(id),
  });

  useEffect(() => {
    if (data) {
      setForm({
        expenseNumber: data.expenseNumber ?? "",
        vehicleId: data.vehicleId ?? "",
        tripId: data.tripId ?? "",
        expenseType: data.expenseType ?? "",
        amount: Number(data.amount ?? 0),
        paymentMethod: data.paymentMethod ?? "Cash",
        expenseDate: (data.expenseDate ?? "").slice(0, 10),
        description: data.description ?? "",
      });
    }
  }, [data]);

  const mut = useMutation({
    mutationFn: (body) => mode === "edit" ? expenseApi.update(id, body) : expenseApi.create(body),
    onSuccess: (res) => {
      toast.success(`Expense ${mode === "edit" ? "updated" : "created"}`);
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["expense", id] });
      navigate(`/expenses/${res?.id ?? id}`);
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      expenseNumber: form.expenseNumber || undefined,
      vehicleId: form.vehicleId || undefined,
      tripId: form.tripId || undefined,
      expenseType: form.expenseType,
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      expenseDate: form.expenseDate,
      description: form.description || undefined,
    });
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";
  const vehicles = vehiclesQ.data?.vehicles ?? [];
  const trips = tripsQ.data?.trips ?? [];

  if (mode === "edit" && isLoading) return <div className="text-slate-500">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <PageHeader title={mode === "edit" ? "Edit expense" : "New expense"} />
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Expense number (optional — auto-generated if blank)">
            <input value={form.expenseNumber} onChange={set("expenseNumber")} className={input} placeholder="EXP-1001" />
          </Field>
          <Field label="Expense type">
            <input required list="expense-type-suggestions" value={form.expenseType} onChange={set("expenseType")} className={input} placeholder="Toll" />
            <datalist id="expense-type-suggestions">
              {EXPENSE_TYPE_SUGGESTIONS.map((t) => <option key={t} value={t} />)}
            </datalist>
          </Field>
          <Field label="Vehicle">
            <select required value={form.vehicleId} onChange={set("vehicleId")} className={input}>
              <option value="">Select…</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNumber} — {v.vehicleName}</option>
              ))}
            </select>
          </Field>
          <Field label="Trip (optional)">
            <select value={form.tripId} onChange={set("tripId")} className={input}>
              <option value="">None</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>{t.tripNumber}</option>
              ))}
            </select>
          </Field>
          <Field label="Amount"><input required type="number" min="0" step="0.01" value={form.amount} onChange={set("amount")} className={input} /></Field>
          <Field label="Payment method">
            <select value={form.paymentMethod} onChange={set("paymentMethod")} className={input}>
              {PAYMENT_METHOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Expense date"><input required type="date" value={form.expenseDate} onChange={set("expenseDate")} className={input} /></Field>
        </div>
        <Field label="Description">
          <textarea rows={3} value={form.description} onChange={set("description")} className={input} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Saving…" : "Save expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
