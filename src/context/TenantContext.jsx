import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { tenantSlug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
    const [isValidTenant, setIsValidTenant] = useState(false);


  useEffect(() => {
    if (!tenant) {
      setLoading(false);
      return;
    }

    API.get(`/tenants/validate/${tenant}`)
      .then(() => setIsValidTenant(true))
      .catch(() => setIsValidTenant(false))
      .finally(() => setLoading(false));
  }, [tenant]);


  const fetchTenantDetails = async (slug) => {
    try {
      // Fetch from API
      const response = await fetch(`/api/${slug}/tenant/details`);
      const data = await response.json();
      setTenant(data.data);
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenantSlug, loading }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);