import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
 // Path to your store

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { token, role } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // 1. If not logged in at all
  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  // 2. If logged in but role doesn't match
  const hasAccess = role && allowedRoles.includes(role);

  return hasAccess ? (
    <Outlet />
  ) : (
    <Navigate to="/access-denied" replace />
  );
};

export default ProtectedRoute;