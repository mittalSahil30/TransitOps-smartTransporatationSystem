import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fuelApi } from "@/api/fuel.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/formatters";
import { useAuth } from "@/features/auth/AuthContext";
import { canDelete } from "@/lib/roles";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-6 py-3">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="col-span-2 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default function FuelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({ queryKey: ["fuel", id], queryFn: () => fuelApi.get(id) });

  const delMut = useMutation({
    mutationFn: () => fuelApi.remove(id),
    onSuccess: () => {
      toast.success("Fuel log deleted");
      qc.invalidateQueries({ queryKey: ["fuel"] });
      navigate("/fuel");
    },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={data.vehicle?.registrationNumber ?? `Vehicle #${data.vehicleId}`}
        description={`Receipt ${data.receiptNumber}`}
        actions={
          canDelete(user?.role) && (
            <button onClick={() => window.confirm("Delete this fuel log?") && delMut.mutate()}
              className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50">
              Delete
            </button>
          )
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-100">
          <Row label="Trip" value={data.trip?.tripNumber ?? (data.tripId ? `#${data.tripId}` : "—")} />
          <Row label="Fuel type" value={data.fuelType} />
          <Row label="Quantity" value={`${formatNumber(data.quantity, 1)} L`} />
          <Row label="Price per unit" value={formatCurrency(data.pricePerUnit)} />
          <Row label="Total cost" value={formatCurrency(data.totalCost)} />
          <Row label="Odometer reading" value={`${formatNumber(data.odometerReading, 0)} km`} />
          <Row label="Station" value={data.stationName} />
          <Row label="Payment method" value={data.paymentMethod} />
          <Row label="Filled at" value={formatDateTime(data.filledAt)} />
          <Row label="Remarks" value={data.remarks || "—"} />
        </dl>
      </div>
    </div>
  );
}
