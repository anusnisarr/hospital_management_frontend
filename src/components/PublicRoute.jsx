import { Navigate, Outlet } from "react-router-dom";
import { AuthStore } from "../store/AuthStore";
import SplashScreen from "./SplashScreen";

const PublicRoute = () => {

  const authStatus = AuthStore.getAuthStatus();

  if (authStatus === "unknown") {
    return <SplashScreen />;
  }

  if (authStatus === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
