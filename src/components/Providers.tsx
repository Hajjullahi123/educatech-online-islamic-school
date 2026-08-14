"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { TenantProvider } from '@/context/TenantContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <SessionProvider>{children}</SessionProvider>
    </TenantProvider>
  );
}
