// packages/utils/TenantContext.tsx
"use client";

import { createContext, useContext } from "react";

export type TenantConfig = {
  id: string;
  slug: string;
  name: string;
  branding: {
    primaryColor: string;
    logoUrl?: string;
  };
  permissions: Record<string, boolean>;
};

const TenantContext = createContext<TenantConfig | null>(null);

export function TenantProvider({
  value,
  children,
}: {
  value: TenantConfig;
  children: React.ReactNode;
}) {
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const tenant = useContext(TenantContext);
  if (!tenant) throw new Error("useTenant must be used within TenantProvider");
  return tenant;
}
