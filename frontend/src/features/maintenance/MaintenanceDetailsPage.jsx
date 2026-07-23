import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { maintenanceApi } from "@/api/maintenance.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

export default function MaintenanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [showComplete, setShowComplete] = useState(false);
  const [actualCost, setActualCost] = useState("");
  const [completeRemarks, setCompleteRemarks] = useState("");

  const { data, isLoading } = useQuery({ queryKey: ["maintenance", id], queryFn: () => maintenanceApi.get(id) });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["maintenance", id] });
    qc.invalidateQueries({ queryKey: ["maintenance"] });
  };

  const startMut = useMutation({
    mutationFn: () => maintenanceApi.start(id),
    onSuccess: () => { toast.success("Maintenance started"); refresh(); },
  });
  const completeMut = useMutation({
    mutationFn: (body) => maintenanceApi.complete(id, body),
    onSuccess: () => { toast.success("Maintenance completed"); setShowComplete(false); refresh(); },
  });
  const cancelMut = useMutation({
    mutationFn: (body) => maintenanceApi.cancel(id, body),
    onSuccess: () => { toast.success("Maintenance cancelled"); refresh(); },
  });
  const delMut = useMutation({
    mutationFn: () => maintenanceApi.remove(id),
    onSuccess: () => { toast.success("Maintenance deleted"); navigate("/maintenance"); },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  const canManage = canManageFleet(user?.role);
  const canStart = canManage && data.status === "scheduled";
  const canComplete = canManage && data.status === "in-progress";
  const canCancel = canManage && data.status === "scheduled";

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={data.vehicle?.registrationNumber ?? `Vehicle #${data.vehicleId}`}
        description={data.serviceCenter}
        actions={
          <>
            {canStart && (
              <button disabled={startMut.isPending} onClick={() => startMut.mutate()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                Start
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
              >Cancel</button>
            )}
            {canDelete(user?.role) && (
              <button onClick={() => window.confirm("Delete this maintenance record?") && delMut.mutate()}
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
          <Row label="Type" value={data.maintenanceType} />
          <Row label="Scheduled date" value={formatDate(data.scheduledDate)} />
          <Row label="Description" value={data.description} />
          <Row label="Estimated cost" value={formatCurrency(data.estimatedCost)} />
          <Row label="Actual cost" value={data.actualCost != null ? formatCurrency(data.actualCost) : "—"} />
          <Row label="Remarks" value={data.remarks || "—"} />
          <Row label="Created" value={formatDateTime(data.createdAt)} />
        </dl>
      </div>

      {showComplete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Complete maintenance</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                completeMut.mutate({
                  actualCost: Number(actualCost),
                  remarks: completeRemarks || undefined,
                });
              }}
              className="space-y-4"
            >
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Actual cost</span>
                <input required type="number" min="0" value={actualCost} onChange={(e) => setActualCost(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">Remarks</span>
                <textarea rows={3} value={completeRemarks} onChange={(e) => setCompleteRemarks(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowComplete(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
                <button type="submit" disabled={completeMut.isPending}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50">
                  {completeMut.isPending ? "Saving…" : "Complete maintenance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
