import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { AuthStore } from "../store/AuthStore";
import SplashScreen from "./SplashScreen";
import BootstrapAuth from "./BootstrapAuth";
const ProtectedRoute = () => {

    const [loading, setLoading] = React.useState(true);
  
    const authStatus = AuthStore.getAuthStatus();

    useEffect(() => {
      BootstrapAuth().finally(() => setLoading(false));
    }, []);

    if (loading) {
      return <SplashScreen />;
    }


  if (authStatus === "unknown") {
    return <SplashScreen />;
  }

  if (authStatus !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

 
  return <Outlet />;
};

export default ProtectedRoute;
