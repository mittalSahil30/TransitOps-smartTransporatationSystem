export const VEHICLE_STATUS_OPTIONS = ["Available", "On Trip", "In Shop", "Retired"];
export const VEHICLE_TYPES = ["Truck", "Van", "Mini Truck", "Pickup", "Trailer", "Container"];
export const DRIVER_STATUS_OPTIONS = ["Available", "On Trip", "Off Duty", "Suspended"];
export const TRIP_STATUS_OPTIONS = ["Draft", "Dispatched", "Completed", "Cancelled"];
export const ROLES = { ADMIN: "Admin", FLEET_MANAGER: "Fleet Manager", DISPATCHER: "Dispatcher" };
export const ROLE_ID_OPTIONS = [
  { id: 1, label: "Admin" },
  { id: 2, label: "Fleet Manager" },
  { id: 3, label: "Dispatcher" },
];

export const STATUS_BADGE = {
  Available: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  "On Trip": "bg-blue-100 text-blue-700 ring-blue-200",
  "In Shop": "bg-amber-100 text-amber-700 ring-amber-200",
  Retired: "bg-slate-200 text-slate-600 ring-slate-300",
  "Off Duty": "bg-slate-200 text-slate-600 ring-slate-300",
  Suspended: "bg-rose-100 text-rose-700 ring-rose-200",
  Draft: "bg-slate-200 text-slate-700 ring-slate-300",
  Dispatched: "bg-blue-100 text-blue-700 ring-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Cancelled: "bg-rose-100 text-rose-700 ring-rose-200",
};
