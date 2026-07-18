import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { tripApi } from "@/api/trip.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateTime, formatNumber } from "@/lib/formatters";
import { useAuth } from "@/features/auth/AuthContext";
import { canCancelTrip, canDelete, canOperateTrips } from "@/lib/roles";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-6 py-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default function TripDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [showComplete, setShowComplete] = useState(false);
  const [actualArrival, setActualArrival] = useState("");
  const [endOdometer, setEndOdometer] = useState("");
  const [remarks, setRemarks] = useState("");
  const [cancelRemarks, setCancelRemarks] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["trip", id], queryFn: () => tripApi.get(id) });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["trip", id] });
    qc.invalidateQueries({ queryKey: ["trips"] });
  };

  const dispatchMut = useMutation({
    mutationFn: () => tripApi.dispatch(id),
    onSuccess: () => { toast.success("Trip dispatched"); refresh(); },
  });
  const completeMut = useMutation({
    mutationFn: (body) => tripApi.complete(id, body),
    onSuccess: () => { toast.success("Trip completed"); setShowComplete(false); refresh(); },
  });
  const cancelMut = useMutation({
    mutationFn: (body) => tripApi.cancel(id, body),
    onSuccess: () => { toast.success("Trip cancelled"); refresh(); },
  });
  const delMut = useMutation({
    mutationFn: () => tripApi.remove(id),
    onSuccess: () => { toast.success("Trip deleted"); navigate("/trips"); },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  const canDispatch = canOperateTrips(user?.role) && data.status === "Draft";
  const canComplete = canOperateTrips(user?.role) && data.status === "Dispatched";
  const canCancel = canCancelTrip(user?.role) && (data.status === "Draft" || data.status === "Dispatched");

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={data.tripNumber}
        description={`${data.origin} → ${data.destination}`}
        actions={
          <>
            {canDispatch && (
              <button disabled={dispatchMut.isPending} onClick={() => dispatchMut.mutate()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Dispatch
              </button>
            )}
            {canComplete && (
              <button onClick={() => setShowComplete(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                Complete
              </button>
            )}
            {canCancel && (
              <button
                onClick={() => {
                  const r = window.prompt("Cancellation remarks (optional):", "");
                  if (r !== null) cancelMut.mutate({ remarks: r || undefined });
                }}
                className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
              >Cancel trip</button>
            )}
            {canDelete(user?.role) && data.status !== "Dispatched" && (
              <button onClick={() => window.confirm("Delete this trip?") && delMut.mutate()}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                Delete
              </button>
            )}
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-100">
          <Row label="Status" value={<StatusBadge value={data.status} />} />
          <Row label="Vehicle" value={data.vehicle ? `${data.vehicle.registrationNumber} — ${data.vehicle.vehicleName}` : `#${data.vehicleId}`} />
          <Row label="Driver" value={data.driver ? `${data.driver.firstName} ${data.driver.lastName}` : `#${data.driverId}`} />
          <Row label="Departure" value={formatDateTime(data.departureTime)} />
          <Row label="Expected arrival" value={formatDateTime(data.expectedArrival)} />
          <Row label="Actual arrival" value={formatDateTime(data.actualArrival)} />
          <Row label="Distance" value={`${formatNumber(data.distance, 0)} km`} />
          <Row label="Start odometer" value={`${formatNumber(data.startOdometer, 0)} km`} />
          <Row label="End odometer" value={data.endOdometer ? `${formatNumber(data.endOdometer, 0)} km` : "—"} />
          <Row label="Cargo weight" value={`${formatNumber(data.cargoWeight, 0)} kg`} />
          <Row label="Remarks" value={data.remarks || "—"} />
        </dl>
      </div>

      {showComplete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Complete trip</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                completeMut.mutate({
                  actualArrival: new Date(actualArrival).toISOString(),
                  endOdometer: Number(endOdometer),
                  remarks: remarks || undefined,
                });
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Actual arrival</span>
                <input required type="datetime-local" value={actualArrival} onChange={(e) => setActualArrival(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">End odometer (km)</span>
                <input required type="number" min={Number(data.startOdometer) || 0} value={endOdometer}
                  onChange={(e) => setEndOdometer(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Remarks</span>
                <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowComplete(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
                <button type="submit" disabled={completeMut.isPending}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                  {completeMut.isPending ? "Saving…" : "Complete trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
