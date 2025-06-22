import { AuthProvider, useAuth } from "./AuthContext";
import { TeamProvider, useTeam } from "./TeamContext";
import React, { ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TeamProvider>{children}</TeamProvider>
    </AuthProvider>
  );
}

export { useAuth, useTeam };
