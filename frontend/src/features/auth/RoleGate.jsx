import { useAuth } from "./AuthContext";

export function RoleGate({ allow, children, fallback = null }) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) {
    return fallback ?? (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-800">
        You don't have permission to access this section.
      </div>
    );
  }
  return children;
}
