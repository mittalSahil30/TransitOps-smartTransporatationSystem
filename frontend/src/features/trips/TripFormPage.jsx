import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { tripApi } from "@/api/trip.api";
import { vehicleApi } from "@/api/vehicle.api";
import { driverApi } from "@/api/driver.api";
import { PageHeader } from "@/components/ui/PageHeader";

const empty = {
  tripNumber: "", vehicleId: "", driverId: "",
  origin: "", destination: "",
  departureTime: "", expectedArrival: "",
  distance: 0, startOdometer: 0, cargoWeight: 0, remarks: "",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function TripFormPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);

  const vehiclesQ = useQuery({ queryKey: ["vehicles", "available"], queryFn: vehicleApi.available });
  const driversQ = useQuery({ queryKey: ["drivers", "available"], queryFn: driverApi.available });

  const mut = useMutation({
    mutationFn: (body) => tripApi.create(body),
    onSuccess: (res) => {
      toast.success("Trip created");
      qc.invalidateQueries({ queryKey: ["trips"] });
      navigate(`/trips/${res.id}`);
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    mut.mutate({
      tripNumber: form.tripNumber,
      vehicleId: Number(form.vehicleId),
      driverId: Number(form.driverId),
      origin: form.origin,
      destination: form.destination,
      departureTime: new Date(form.departureTime).toISOString(),
      expectedArrival: new Date(form.expectedArrival).toISOString(),
      distance: Number(form.distance),
      startOdometer: Number(form.startOdometer),
      cargoWeight: Number(form.cargoWeight) || 0,
      remarks: form.remarks || undefined,
    });
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10";

  return (
    <div className="max-w-3xl">
      <PageHeader title="New trip" description="Trips start as Draft. Dispatch them from the trip detail page." />
      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Trip number"><input required value={form.tripNumber} onChange={set("tripNumber")} className={input} /></Field>
          <Field label="Vehicle">
            <select required value={form.vehicleId} onChange={set("vehicleId")} className={input}>
              <option value="">Select…</option>
              {(vehiclesQ.data ?? []).map((v) => (
                <option key={v.id} value={v.id}>{v.registrationNumber} — {v.vehicleName}</option>
              ))}
            </select>
          </Field>
          <Field label="Driver">
            <select required value={form.driverId} onChange={set("driverId")} className={input}>
              <option value="">Select…</option>
              {(driversQ.data ?? []).map((d) => (
                <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.employeeId})</option>
              ))}
            </select>
          </Field>
          <div />
          <Field label="Origin"><input required value={form.origin} onChange={set("origin")} className={input} /></Field>
          <Field label="Destination"><input required value={form.destination} onChange={set("destination")} className={input} /></Field>
          <Field label="Departure time"><input required type="datetime-local" value={form.departureTime} onChange={set("departureTime")} className={input} /></Field>
          <Field label="Expected arrival"><input required type="datetime-local" value={form.expectedArrival} onChange={set("expectedArrival")} className={input} /></Field>
          <Field label="Distance (km)"><input required type="number" min="0" value={form.distance} onChange={set("distance")} className={input} /></Field>
          <Field label="Start odometer (km)"><input required type="number" min="0" value={form.startOdometer} onChange={set("startOdometer")} className={input} /></Field>
          <Field label="Cargo weight (kg)"><input type="number" min="0" value={form.cargoWeight} onChange={set("cargoWeight")} className={input} /></Field>
        </div>
        <Field label="Remarks">
          <textarea rows={3} value={form.remarks} onChange={set("remarks")} className={input} />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
          <button type="submit" disabled={mut.isPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50">
            {mut.isPending ? "Creating…" : "Create trip"}
          </button>
        </div>
      </form>
    </div>
  );
}
