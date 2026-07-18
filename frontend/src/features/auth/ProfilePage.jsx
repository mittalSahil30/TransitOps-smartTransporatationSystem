import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { formatDateTime } from "@/lib/formatters";

export default function ProfilePage() {
  const { data, isLoading } = useQuery({ queryKey: ["profile"], queryFn: authApi.profile });

  if (isLoading) return <div className="text-slate-500">Loading profile…</div>;
  if (!data) return null;

  const rows = [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ["Role", data.role?.name ?? "—"],
    ["Status", data.isActive ? "Active" : "Disabled"],
    ["Last login", formatDateTime(data.lastLogin)],
    ["Member since", formatDateTime(data.createdAt)],
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your profile</h1>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <dl className="divide-y divide-slate-200">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-3 gap-4 px-6 py-4">
              <dt className="text-sm font-medium text-slate-500">{label}</dt>
              <dd className="col-span-2 text-sm text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
