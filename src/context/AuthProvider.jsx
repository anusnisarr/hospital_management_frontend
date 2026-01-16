import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate , useLocation } from "react-router-dom";
import { AuthStore } from "../store/AuthStore"

const PUBLIC_ROUTES = ["/login", "/signup"];
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_PATH;
    
  const refreshAccessToken = useCallback(async () => {

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      
      AuthStore.setAccessToken(res.data.accessToken);
      setAccessToken(res.data.accessToken);
      setUser(res.data.user);

    } catch (err) {    
      setAccessToken(null);
      setUser(null);
      AuthStore.clearAccessToken();
      if (!PUBLIC_ROUTES.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, navigate, location.pathname]);
  
  useEffect(() => {
    
    if (accessToken){
      setLoading(false);
      return;
    }


    if (PUBLIC_ROUTES.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    refreshAccessToken();
  }, [accessToken , navigate ,  location.pathname , refreshAccessToken]);

  if (loading) return null;
  
  return (
    <AuthContext.Provider value={{ accessToken, user, setAccessToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

