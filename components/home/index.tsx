"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/store";
import { Button } from "@/components/ui/button";
import TeamList from "../team/team-list";
import PlayerList from "../team/player-list";
import LoginForm from "../auth/login-form";

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {isAuthenticated ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Welcome, {user}!</h1>
            <Button onClick={() => logout()}>Logout</Button>
          </div>
          <div className="space-y-8">
            <TeamList />
            <PlayerList />
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <LoginForm />
        </div>
      )}
    </div>
  );
}
