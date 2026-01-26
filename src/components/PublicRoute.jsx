import { Navigate, Outlet, useParams } from "react-router-dom";
import { AuthStore } from "../store/AuthStore";

const PublicRoute = () => {
  const { tenantSlug } = useParams();  
  const authStatus = AuthStore.getAuthStatus();

  if (authStatus === "authenticated") {
    return <Navigate to={`/${tenantSlug}`} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
