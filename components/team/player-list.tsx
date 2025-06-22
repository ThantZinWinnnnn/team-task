"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { fetchPlayers } from "@/lib/api";
import { Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTeam } from "@/store";
import { toast } from "sonner";
import { Loader2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PlayerList() {
  const { teams, addPlayerToTeam } = useTeam();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<{
    [playerId: number]: string;
  }>({});
  const [showModal, setShowModal] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["players"],
      queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
        fetchPlayers(pageParam.toString()),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.meta.next_cursor === null) return undefined;
        const totalPages = Math.ceil(lastPage.meta.next_cursor);
        return allPages.length + 1 <= totalPages
          ? allPages.length + 1
          : undefined;
      },
      initialPageParam: 1,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    const currentLoadMoreRef = loadMoreRef.current;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isFetching
        ) {
          setIsFetching(true);
          fetchNextPage().finally(() => setIsFetching(false));
        }
      },
      { threshold: 0.1 }
    );

    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (observerRef.current && currentLoadMoreRef) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFetching]);

  const handleAddPlayer = (player: Player, teamId: string) => {
    // Check if there are no teams
    if (teams.length === 0) {
      setShowModal(true);
      return;
    }

    if (!teamId) {
      toast.error("Error", {
        description:
          "Please choose a team from the dropdown before adding this player",
      });
      return;
    }

    const isPlayerInTeam = teams.some((team) =>
      team.players.some((p) => p.id === player.id)
    );

    if (isPlayerInTeam) {
      toast.error("Player Already Assigned", {
        description: `${player.first_name} ${player.last_name} is already on a team and cannot be added again`,
      });
      setSelectedTeams((prev) => ({ ...prev, [player.id]: "" }));
      return;
    }
    const selectedTeam = teams.find((team) => team.id === teamId);
    addPlayerToTeam(teamId, player);
    toast.success("Player Added Successfully", {
      description: `${player.first_name} ${player.last_name} has been added to ${selectedTeam?.name}`,
    });
    setSelectedTeams((prev) => ({ ...prev, [player.id]: "" }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-600" />
        <span className="ml-2 text-slate-700">Loading players...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 text-slate-700" />
        <h2 className="text-xl font-semibold text-slate-900">Players</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.pages.map((page) =>
          page.data.map((player: Player) => (
            <Card
              key={player.id}
              className="border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  {player.first_name} {player.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Position:</span>
                    <span className="ml-2 font-medium">
                      {player.position || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Height:</span>
                    <span className="ml-2 font-medium">
                      {player.height || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Weight:</span>
                    <span className="ml-2 font-medium">
                      {player.weight || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Country:</span>
                    <span className="ml-2 font-medium">
                      {player.national_team || "N/A"}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col md:flex-row gap-3">
                  <Select
                    value={selectedTeams[player.id] || ""}
                    onValueChange={(value) =>
                      setSelectedTeams((prev) => ({
                        ...prev,
                        [player.id]: value,
                      }))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.length === 0 ? (
                        <SelectItem value="no" disabled>
                          No teams available
                        </SelectItem>
                      ) : (
                        teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-slate-600 hover:bg-slate-700"
                    onClick={() =>
                      handleAddPlayer(player, selectedTeams[player.id] || "")
                    }
                  >
                    Add to Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
          <span className="ml-2 text-slate-700 text-sm">
            Loading more players...
          </span>
        </div>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Teams Available</DialogTitle>
          </DialogHeader>
          <p className="text-slate-700">
            You need to create a team before you can add players. Please create
            a team first.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
