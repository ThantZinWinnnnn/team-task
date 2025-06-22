"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store";
import { Button } from "@/components/ui/button";
import TeamList from "../team/team-list";
import PlayerList from "../team/player-list";
import LoginForm from "../auth/login-form";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-medium shadow-sm">
              {user!.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate max-w-[150px] sm:max-w-full">
                {user}
              </h1>
            </div>
          </div>

          {/* Mobile-friendly logout button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 px-3 self-end sm:self-auto"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4" />
            <span className="sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Teams Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <TeamList />
        </div>

        {/* Players Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <PlayerList />
        </div>
      </div>
    </div>
  );
}
