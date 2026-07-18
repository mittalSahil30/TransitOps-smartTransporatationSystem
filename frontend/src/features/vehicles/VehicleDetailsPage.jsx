import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { vehicleApi } from "@/api/vehicle.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatNumber, formatDateTime } from "@/lib/formatters";
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

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => vehicleApi.get(id),
  });

  const del = useMutation({
    mutationFn: () => vehicleApi.remove(id),
    onSuccess: () => {
      toast.success("Vehicle deleted");
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      navigate("/vehicles");
    },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={data.registrationNumber}
        description={data.vehicleName}
        actions={
          <>
            {canManageFleet(user?.role) && (
              <Link to={`/vehicles/${id}/edit`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">Edit</Link>
            )}
            {canDelete(user?.role) && (
              <button
                onClick={() => window.confirm("Delete this vehicle?") && del.mutate()}
                className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
              >Delete</button>
            )}
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-100">
          <Row label="Status" value={<StatusBadge value={data.status} />} />
          <Row label="Model" value={data.model} />
          <Row label="Type" value={data.vehicleType} />
          <Row label="Region" value={data.region} />
          <Row label="Max load capacity" value={`${formatNumber(data.maxLoadCapacity, 0)} kg`} />
          <Row label="Odometer" value={`${formatNumber(data.odometer, 0)} km`} />
          <Row label="Acquisition cost" value={formatCurrency(data.acquisitionCost)} />
          <Row label="Added" value={formatDateTime(data.createdAt)} />
          <Row label="Last updated" value={formatDateTime(data.updatedAt)} />
        </dl>
      </div>
    </div>
  );
}
