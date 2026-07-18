import { STATUS_BADGE } from "@/lib/constants";

export function StatusBadge({ value }) {
  const cls = STATUS_BADGE[value] ?? "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {value ?? "—"}
    </span>
  );
}
