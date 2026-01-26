import { Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthStore } from "../store/AuthStore";
import SplashScreen from "./SplashScreen";
import BootstrapAuth from "./BootstrapAuth";

const ProtectedRoute = () => {
  const { tenantSlug } = useParams();
  const [loading, setLoading] = useState(true);

  const authStatus = AuthStore.getAuthStatus();

  useEffect(() => {
    BootstrapAuth().finally(() => setLoading(false));
  }, []);

  if (loading || authStatus === "unknown") {
    return <SplashScreen />;
  }

  if (authStatus !== "authenticated") {
    return <Navigate to={`/${tenantSlug}/login`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;