import type { ReactNode } from "react";

type DashboardLayoutProps = {
  readonly children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <h1>AuthLayout</h1>
      {children}
    </div>
  );
}
