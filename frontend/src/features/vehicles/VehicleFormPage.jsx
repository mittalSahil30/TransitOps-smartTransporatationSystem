import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { vehicleApi } from "@/api/vehicle.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { VEHICLE_STATUS_OPTIONS, VEHICLE_TYPES } from "@/lib/constants";

const empty = {
  registrationNumber: "", vehicleName: "", model: "", vehicleType: "Truck",
  maxLoadCapacity: 0, odometer: 0, acquisitionCost: 0, region: "", status: "Available",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function VehicleFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleApi.get(id),
    enabled: mode === "edit" && Boolean(id),
  });

  useEffect(() => {
    if (data) {
      setForm({
        registrationNumber: data.registrationNumber ?? "",
        vehicleName: data.vehicleName ?? "",
        model: data.model ?? "",
        vehicleType: data.vehicleType ?? "Truck",
        maxLoadCapacity: Number(data.maxLoadCapacity ?? 0),
        odometer: Number(data.odometer ?? 0),
        acquisitionCost: Number(data.acquisitionCost ?? 0),
        region: data.region ?? "",
        status: data.status ?? "Available",
      });
    }
  }, [data]);

  const mut = useMutation({
    mutationFn: (body) => mode === "edit" ? vehicleApi.update(id, body) : vehicleApi.create(body),
    onSuccess: (res) => {
      toast.success(`Vehicle ${mode === "edit" ? "updated" : "created"}`);
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      qc.invalidateQueries({ queryKey: ["vehicle", id] });
      navigate(`/vehicles/${res?.id ?? id}`);
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      ...form,
      maxLoadCapacity: Number(form.maxLoadCapacity),
      odometer: Number(form.odometer),
      acquisitionCost: Number(form.acquisitionCost),
    });
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  if (mode === "edit" && isLoading) return <div className="text-slate-500">Loading…</div>;

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

  return (
    <div className="max-w-3xl">
      <PageHeader title={mode === "edit" ? "Edit vehicle" : "New vehicle"} />
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Registration number"><input required value={form.registrationNumber} onChange={set("registrationNumber")} className={input} /></Field>
          <Field label="Vehicle name"><input required value={form.vehicleName} onChange={set("vehicleName")} className={input} /></Field>
          <Field label="Model"><input required value={form.model} onChange={set("model")} className={input} /></Field>
          <Field label="Type">
            <select value={form.vehicleType} onChange={set("vehicleType")} className={input}>
              {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Max load capacity (kg)"><input type="number" min="0" value={form.maxLoadCapacity} onChange={set("maxLoadCapacity")} className={input} /></Field>
          <Field label="Odometer (km)"><input type="number" min="0" value={form.odometer} onChange={set("odometer")} className={input} /></Field>
          <Field label="Acquisition cost"><input type="number" min="0" value={form.acquisitionCost} onChange={set("acquisitionCost")} className={input} /></Field>
          <Field label="Region"><input required value={form.region} onChange={set("region")} className={input} /></Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")} className={input}>
              {VEHICLE_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Saving…" : "Save vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
