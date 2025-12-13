import type { ReactNode } from "react";

type AuthLayoutProps = {
  readonly children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <h1>AuthLayout</h1>
      {children}
    </div>
  );
}
