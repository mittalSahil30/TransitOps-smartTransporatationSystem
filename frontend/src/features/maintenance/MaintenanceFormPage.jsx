import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { maintenanceApi } from "@/api/maintenance.api";
import { vehicleApi } from "@/api/vehicle.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { MAINTENANCE_TYPE_OPTIONS } from "@/lib/constants";

const empty = {
  vehicleId: "", maintenanceType: "preventive", serviceCenter: "",
  description: "", scheduledDate: "", estimatedCost: 0, remarks: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function MaintenanceFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const vehiclesQ = useQuery({
    queryKey: ["vehicles", "for-maintenance"],
    queryFn: () => vehicleApi.list({ limit: 100 }),
  });

  const mut = useMutation({
    mutationFn: (body) => maintenanceApi.create(body),
    onSuccess: (res) => {
      toast.success("Maintenance scheduled");
      qc.invalidateQueries({ queryKey: ["maintenance"] });
      navigate(`/maintenance/${res.id}`);
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      vehicleId: Number(form.vehicleId),
      maintenanceType: form.maintenanceType,
      serviceCenter: form.serviceCenter,
      description: form.description,
      scheduledDate: form.scheduledDate,
      estimatedCost: Number(form.estimatedCost) || 0,
      remarks: form.remarks || undefined,
    });
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";
  const vehicles = vehiclesQ.data?.vehicles ?? [];

  return (
    <div className="max-w-3xl">
      <PageHeader title="New maintenance" description="Schedule service for a vehicle." />
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
          <Field label="Maintenance type">
            <select value={form.maintenanceType} onChange={set("maintenanceType")} className={input}>
              {MAINTENANCE_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Service center"><input required value={form.serviceCenter} onChange={set("serviceCenter")} className={input} /></Field>
          <Field label="Scheduled date"><input required type="date" value={form.scheduledDate} onChange={set("scheduledDate")} className={input} /></Field>
          <Field label="Estimated cost"><input type="number" min="0" value={form.estimatedCost} onChange={set("estimatedCost")} className={input} /></Field>
        </div>
        <Field label="Description">
          <textarea required rows={3} value={form.description} onChange={set("description")} className={input} />
        </Field>
        <Field label="Remarks">
          <textarea rows={2} value={form.remarks} onChange={set("remarks")} className={input} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Saving…" : "Schedule maintenance"}
          </button>
        </div>
      </form>
    </div>
  );
}
