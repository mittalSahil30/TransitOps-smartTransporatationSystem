import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { driverApi } from "@/api/driver.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatDateTime } from "@/lib/formatters";
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

export default function DriverDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => driverApi.get(id),
  });

  const del = useMutation({
    mutationFn: () => driverApi.remove(id),
    onSuccess: () => {
      toast.success("Driver deleted");
      qc.invalidateQueries({ queryKey: ["drivers"] });
      navigate("/drivers");
    },
  });

  if (isLoading) return <div className="text-slate-500">Loading…</div>;
  if (!data) return null;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={`${data.firstName} ${data.lastName}`}
        description={`Employee ${data.employeeId}`}
        actions={
          <>
            {canManageFleet(user?.role) && (
              <Link to={`/drivers/${id}/edit`} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">Edit</Link>
            )}
            {canDelete(user?.role) && (
              <button
                onClick={() => window.confirm("Delete this driver?") && del.mutate()}
                className="rounded-lg border border-rose-300 px-4 py-2 text-sm text-rose-700 hover:bg-rose-50"
              >Delete</button>
            )}
          </>
        }
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-100">
          <Row label="Status" value={<StatusBadge value={data.status} />} />
          <Row label="Email" value={data.email} />
          <Row label="Phone" value={data.phone} />
          <Row label="License #" value={data.licenseNumber} />
          <Row label="License expiry" value={formatDate(data.licenseExpiry)} />
          <Row label="Joined" value={formatDate(data.joiningDate)} />
          <Row label="Region" value={data.region} />
          <Row label="Added" value={formatDateTime(data.createdAt)} />
        </dl>
      </div>
    </div>
  );
}
