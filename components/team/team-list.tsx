"use client";

import { useState } from "react";
import { useTeam } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Edit,
  Trash2,
  Users,
  MapPin,
  Globe,
  User,
  Plus,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import TeamForm from "./team-form";
import { TeamFormValues } from "@/types";

export default function TeamList() {
  const { teams, deleteTeam, removePlayerFromTeam } = useTeam();
  const [isOpen, setIsOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<
    undefined | ({ id: string } & TeamFormValues)
  >(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);

  const handleRemovePlayer = (teamId: string, playerId: number) => {
    const team = teams.find((t) => t.id === teamId);
    const player = team?.players.find((p) => p.id === playerId);
    removePlayerFromTeam(teamId, playerId);

    toast.success("Player Removed Successfully", {
      description: `${player?.first_name} ${player?.last_name} has been removed from ${team?.name}`,
    });
  };

  const handleCreateTeam = () => {
    setEditingTeam(undefined);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setTeamToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      const teamName = teams.find((t) => t.id === teamToDelete)?.name;
      deleteTeam(teamToDelete);
      toast.success("Team Deleted Successfully", {
        description: `${teamName} has been permanently removed from your teams`,
      });
      setIsDeleteDialogOpen(false);
      setTeamToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row items-center justify-between ">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-slate-700" />
          <h2 className="text-xl font-semibold text-slate-900">Teams</h2>
        </div>
        <Button
          onClick={handleCreateTeam}
          className="gap-2 w-full sm:w-fit bg-slate-900 hover:bg-slate-800"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? "Edit Team" : "Create Team"}
            </DialogTitle>
          </DialogHeader>
          <TeamForm
            team={editingTeam}
            onClose={() => {
              setIsOpen(false);
              setEditingTeam(undefined);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white">
          <DialogHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-gray-600 leading-relaxed">
                Are you sure you want to delete the team{" "}
                <span className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                  {teams.find((t) => t.id === teamToDelete)?.name}
                </span>
                ?
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-red-800">
                  This action cannot be undone
                </p>
                <p className="text-sm text-red-700">
                  All team data, including players will be permanently removed
                  from the system.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 h-11 border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card
            key={team.id}
            className="border-0 shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle
                  className="text-lg font-semibold truncate"
                  title={team.name}
                >
                  {team.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => {
                      setEditingTeam(team);
                      setIsOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(team.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Region: {team.region}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Country: {team.country}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">
                  Players: {team.playerCount}
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700">Players:</h4>
                {team.players.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No players</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {team.players.map((player) => (
                      <Badge
                        key={player.id}
                        variant="secondary"
                        className="text-xs group flex items-center gap-1 pr-1"
                      >
                        {player.first_name} {player.last_name}
                        <span
                          className="ml-1 p-1 rounded-full hover:bg-slate-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePlayer(team.id, player.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 cursor-pointer opacity-50 group-hover:opacity-100" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
