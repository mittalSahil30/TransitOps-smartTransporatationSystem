import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fuelApi } from "@/api/fuel.api";
import { vehicleApi } from "@/api/vehicle.api";
import { tripApi } from "@/api/trip.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { FUEL_TYPE_OPTIONS, PAYMENT_METHOD_OPTIONS } from "@/lib/constants";

const empty = {
  vehicleId: "", tripId: "", receiptNumber: "", fuelType: "Diesel",
  quantity: 0, pricePerUnit: 0, totalCost: 0, odometerReading: 0,
  stationName: "", paymentMethod: "Cash", filledAt: "", remarks: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function FuelFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const vehiclesQ = useQuery({
    queryKey: ["vehicles", "for-fuel"],
    queryFn: () => vehicleApi.list({ limit: 100 }),
  });
  const tripsQ = useQuery({
    queryKey: ["trips", "for-fuel"],
    queryFn: () => tripApi.list({ limit: 100 }),
  });

  const mut = useMutation({
    mutationFn: (body) => fuelApi.create(body),
    onSuccess: (res) => {
      toast.success("Fuel log created");
      qc.invalidateQueries({ queryKey: ["fuel"] });
      navigate(`/fuel/${res.id}`);
    },
  });

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const next = { ...f, [k]: value };
      if (k === "quantity" || k === "pricePerUnit") {
        const qty = Number(k === "quantity" ? value : f.quantity) || 0;
        const price = Number(k === "pricePerUnit" ? value : f.pricePerUnit) || 0;
        next.totalCost = Math.round(qty * price * 100) / 100;
      }
      return next;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      vehicleId: Number(form.vehicleId),
      tripId: form.tripId ? Number(form.tripId) : undefined,
      receiptNumber: form.receiptNumber,
      fuelType: form.fuelType,
      quantity: Number(form.quantity),
      pricePerUnit: Number(form.pricePerUnit),
      totalCost: Number(form.totalCost),
      odometerReading: Number(form.odometerReading),
      stationName: form.stationName,
      paymentMethod: form.paymentMethod,
      filledAt: form.filledAt ? new Date(form.filledAt).toISOString() : undefined,
      remarks: form.remarks || undefined,
    });
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";
  const vehicles = vehiclesQ.data?.vehicles ?? [];
  const trips = tripsQ.data?.trips ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader title="New fuel log" description="Record a fuel purchase for a vehicle." />
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <Field label="Receipt number"><input required value={form.receiptNumber} onChange={set("receiptNumber")} className={input} /></Field>
          <Field label="Fuel type">
            <select value={form.fuelType} onChange={set("fuelType")} className={input}>
              {FUEL_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Quantity (L)"><input required type="number" min="0" step="0.01" value={form.quantity} onChange={set("quantity")} className={input} /></Field>
          <Field label="Price per unit"><input required type="number" min="0" step="0.01" value={form.pricePerUnit} onChange={set("pricePerUnit")} className={input} /></Field>
          <Field label="Total cost"><input required type="number" min="0" step="0.01" value={form.totalCost} onChange={set("totalCost")} className={input} /></Field>
          <Field label="Odometer reading (km)"><input required type="number" min="0" value={form.odometerReading} onChange={set("odometerReading")} className={input} /></Field>
          <Field label="Fuel station"><input required value={form.stationName} onChange={set("stationName")} className={input} /></Field>
          <Field label="Payment method">
            <select value={form.paymentMethod} onChange={set("paymentMethod")} className={input}>
              {PAYMENT_METHOD_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>
          <Field label="Filled at"><input required type="datetime-local" value={form.filledAt} onChange={set("filledAt")} className={input} /></Field>
        </div>
        <Field label="Remarks">
          <textarea rows={2} value={form.remarks} onChange={set("remarks")} className={input} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Saving…" : "Save fuel log"}
          </button>
        </div>
      </form>
    </div>
  );
}
