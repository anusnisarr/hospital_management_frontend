import { Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/apiInstance";

const TenantGuard = () => {
  const { tenantSlug } = useParams();
  console.log('Tenant Slug:', tenantSlug);
  
  
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    
    if (!tenantSlug) setLoading(false);
      
    tenantCheck(tenantSlug);
      
  }, [tenantSlug]);

  const tenantCheck = async (tenantSlug) => {
     console.log('tenantCheck Tenant Slug:', tenantSlug);

      const res = await API.get(`/${tenantSlug}/tenant/validate`);
      console.log('Tenant validation response:', res);

  };
  
  if (!tenantSlug) {
    return <Navigate to="/register" replace />;
  }

  if (loading) return null;

  if (!valid) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};

export default TenantGuard;