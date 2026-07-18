import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { driverApi } from "@/api/driver.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { DRIVER_STATUS_OPTIONS } from "@/lib/constants";

const empty = {
  employeeId: "", firstName: "", lastName: "", email: "", phone: "",
  licenseNumber: "", licenseExpiry: "", joiningDate: "", region: "", status: "Available",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const iso = (v) => v ? String(v).slice(0, 10) : "";

export default function DriverFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data, isLoading } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => driverApi.get(id),
    enabled: mode === "edit" && Boolean(id),
  });

  useEffect(() => {
    if (data) {
      setForm({
        employeeId: data.employeeId ?? "",
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        licenseNumber: data.licenseNumber ?? "",
        licenseExpiry: iso(data.licenseExpiry),
        joiningDate: iso(data.joiningDate),
        region: data.region ?? "",
        status: data.status ?? "Available",
      });
    }
  }, [data]);

  const mut = useMutation({
    mutationFn: (body) => mode === "edit" ? driverApi.update(id, body) : driverApi.create(body),
    onSuccess: (res) => {
      toast.success(`Driver ${mode === "edit" ? "updated" : "created"}`);
      qc.invalidateQueries({ queryKey: ["drivers"] });
      qc.invalidateQueries({ queryKey: ["driver", id] });
      navigate(`/drivers/${res?.id ?? id}`);
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  if (mode === "edit" && isLoading) return <div className="text-slate-500">Loading…</div>;

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

  return (
    <div className="max-w-3xl">
      <PageHeader title={mode === "edit" ? "Edit driver" : "New driver"} />
      <form onSubmit={(e) => { e.preventDefault(); mut.mutate(form); }}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Employee ID"><input required value={form.employeeId} onChange={set("employeeId")} className={input} /></Field>
          <Field label="Email"><input required type="email" value={form.email} onChange={set("email")} className={input} /></Field>
          <Field label="First name"><input required value={form.firstName} onChange={set("firstName")} className={input} /></Field>
          <Field label="Last name"><input required value={form.lastName} onChange={set("lastName")} className={input} /></Field>
          <Field label="Phone"><input required value={form.phone} onChange={set("phone")} className={input} /></Field>
          <Field label="License number"><input required value={form.licenseNumber} onChange={set("licenseNumber")} className={input} /></Field>
          <Field label="License expiry"><input required type="date" value={form.licenseExpiry} onChange={set("licenseExpiry")} className={input} /></Field>
          <Field label="Joining date"><input required type="date" value={form.joiningDate} onChange={set("joiningDate")} className={input} /></Field>
          <Field label="Region"><input required value={form.region} onChange={set("region")} className={input} /></Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")} className={input}>
              {DRIVER_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Saving…" : "Save driver"}
          </button>
        </div>
      </form>
    </div>
  );
}
