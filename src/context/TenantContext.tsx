'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
}

const defaultTenant: TenantInfo = {
  id: 'educatech-master',
  name: 'EducaTech Online Islamic School',
  slug: 'educatech',
  logoUrl: null,
  primaryColor: '#064e3b',
  secondaryColor: '#d97706',
};

interface TenantContextType {
  tenant: TenantInfo;
  setTenant: (tenant: TenantInfo) => void;
  isMasterSaaS: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenant: defaultTenant,
  setTenant: () => {},
  isMasterSaaS: true,
});

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<TenantInfo>(defaultTenant);

  useEffect(() => {
    // Detect tenant slug from query parameter or local storage for white-label testing
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tenantParam = urlParams.get('tenant');
      if (tenantParam === 'al-azhar') {
        setTenant({
          id: 'al-azhar-demo',
          name: 'Al-Azhar Quranic Institute',
          slug: 'al-azhar',
          logoUrl: null,
          primaryColor: '#1e3a8a',
          secondaryColor: '#f59e0b',
        });
      }
    }
  }, []);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenant,
        isMasterSaaS: tenant.slug === 'educatech',
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
