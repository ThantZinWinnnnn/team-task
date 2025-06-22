"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeam } from "@/store";
import { toast } from "sonner";
import { Team, TeamFormValues } from "@/types";
import { Users, MapPin, Globe, Hash } from "lucide-react";

const formSchema = (teams: Team[], currentTeam?: Team) =>
  z.object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .refine(
        (name) => {
          return !teams.some(
            (t) =>
              t.name.toLowerCase() === name.toLowerCase() &&
              (!currentTeam || t.id !== currentTeam.id)
          );
        },
        { message: "Team name must be unique" }
      ),
    playerCount: z
      .number()
      .min(0, { message: "Player count must be non-negative" }),
    region: z.string().min(1, { message: "Region is required" }),
    country: z.string().min(1, { message: "Country is required" }),
  });

interface TeamFormProps {
  team?: { id: string } & TeamFormValues;
  onClose: () => void;
}

export default function TeamForm({ team, onClose }: TeamFormProps) {
  const { teams, addTeam, updateTeam } = useTeam();

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(
      formSchema(teams, team ? { ...team, players: [] } : undefined)
    ),
    defaultValues: team || {
      name: "",
      playerCount: 0,
      region: "",
      country: "",
    },
  });

  const onSubmit = (values: TeamFormValues) => {
    const teamNameExists = teams.some(
      (t) =>
        t.name.toLowerCase() === values.name.toLowerCase() &&
        (!team || t.id !== team.id)
    );

    if (teamNameExists) {
      toast.error("Team Name Already Exists", {
        description:
          "A team with this name already exists. Please choose a different name.",
      });
      return;
    }

    if (team) {
      updateTeam(team.id, values);
      toast.success("Team Updated Successfully", {
        description: `${values.name} has been updated with the latest information`,
      });
    } else {
      addTeam(values);
      toast.success("Team Created Successfully", {
        description: `${values.name} is now ready for players to be added`,
      });
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {team ? "Edit Team" : "Create New Team"}
              </h2>
              <p className="text-sm text-gray-600">
                {team
                  ? "Update your team information"
                  : "Set up your team with basic information and details"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-gray-500" />
                    Team Name
                  </Label>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Enter your team name"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Player Count */}
            <FormField
              control={form.control}
              name="playerCount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label
                    htmlFor="playerCount"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Hash className="w-4 h-4 text-gray-500" />
                    Player Count
                  </Label>
                  <FormControl>
                    <Input
                      id="playerCount"
                      type="number"
                      className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : parseInt(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label
                      htmlFor="region"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4 text-gray-500" />
                      Region
                    </Label>
                    <FormControl>
                      <Input
                        id="region"
                        placeholder="e.g., North America"
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-gray-500" />
                      Country
                    </Label>
                    <FormControl>
                      <Input
                        id="country"
                        placeholder="e.g., United States"
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-slate-800 text-white cursor-pointer"
            >
              {team ? "Save Changes" : "Create Team"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
