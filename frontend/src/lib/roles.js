export const canManageFleet = (role) => role === "Admin" || role === "Fleet Manager";
export const canDelete = (role) => role === "Admin";
export const canOperateTrips = (role) =>
  role === "Admin" || role === "Fleet Manager" || role === "Dispatcher";
export const canCancelTrip = (role) => role === "Admin" || role === "Fleet Manager";
export const canRegisterUsers = (role) => role === "Admin";
