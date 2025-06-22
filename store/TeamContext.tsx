"use client";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Player, Team } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface TeamState {
  teams: Team[];
}

type TeamAction =
  | { type: "ADD_TEAM"; payload: Omit<Team, "id" | "players"> }
  | {
      type: "UPDATE_TEAM";
      payload: { id: string; team: Omit<Team, "id" | "players"> };
    }
  | { type: "DELETE_TEAM"; payload: string }
  | { type: "ADD_PLAYER_TO_TEAM"; payload: { teamId: string; player: Player } }
  | {
      type: "REMOVE_PLAYER_FROM_TEAM";
      payload: { teamId: string; playerId: number };
    }
  | { type: "INIT_TEAMS"; payload: Team[] };

interface TeamContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, "id" | "players">) => void;
  updateTeam: (id: string, team: Omit<Team, "id" | "players">) => void;
  deleteTeam: (id: string) => void;
  addPlayerToTeam: (teamId: string, player: Player) => void;
  removePlayerFromTeam: (teamId: string, playerId: number) => void;
}

const initialState: TeamState = {
  teams: [],
};

function teamReducer(state: TeamState, action: TeamAction): TeamState {
  switch (action.type) {
    case "ADD_TEAM":
      return {
        ...state,
        teams: [
          ...state.teams,
          { ...action.payload, id: uuidv4(), players: [] },
        ],
      };
    case "UPDATE_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.id
            ? { ...team, ...action.payload.team }
            : team
        ),
      };
    case "DELETE_TEAM":
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.payload),
      };
    case "ADD_PLAYER_TO_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
                ...team,
                players: [...team.players, action.payload.player],
                playerCount: team.playerCount + 1,
              }
            : team
        ),
      };
    case "REMOVE_PLAYER_FROM_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
                ...team,
                players: team.players.filter(
                  (p) => p.id !== action.payload.playerId
                ),
                playerCount: team.playerCount - 1,
              }
            : team
        ),
      };
    case "INIT_TEAMS":
      return {
        ...state,
        teams: action.payload,
      };
    default:
      return state;
  }
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(teamReducer, initialState);

  // Load persisted data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const persistedTeams = localStorage.getItem("teams");
      if (persistedTeams) {
        dispatch({ type: "INIT_TEAMS", payload: JSON.parse(persistedTeams) });
      }
    }
  }, []);

  // Save to localStorage when teams change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("teams", JSON.stringify(state.teams));
    }
  }, [state.teams]);

  const addTeam = (team: Omit<Team, "id" | "players">) => {
    dispatch({ type: "ADD_TEAM", payload: team });
  };

  const updateTeam = (id: string, team: Omit<Team, "id" | "players">) => {
    dispatch({ type: "UPDATE_TEAM", payload: { id, team } });
  };

  const deleteTeam = (id: string) => {
    dispatch({ type: "DELETE_TEAM", payload: id });
  };

  const addPlayerToTeam = (teamId: string, player: Player) => {
    dispatch({ type: "ADD_PLAYER_TO_TEAM", payload: { teamId, player } });
  };

  const removePlayerFromTeam = (teamId: string, playerId: number) => {
    dispatch({
      type: "REMOVE_PLAYER_FROM_TEAM",
      payload: { teamId, playerId },
    });
  };

  return (
    <TeamContext.Provider
      value={{
        teams: state.teams,
        addTeam,
        updateTeam,
        deleteTeam,
        addPlayerToTeam,
        removePlayerFromTeam,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};
