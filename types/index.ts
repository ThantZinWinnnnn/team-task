export interface Player {
  id: number;
  position: string;
  national_team: string | null;
  height: number;
  weight: number;
  birth_date: string;
  age: string;
  name: string;
  first_name: string;
  last_name: string;
  team_ids: number[];
}
export interface PlayerTeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
}
export type TeamFormValues = {
  name: string;
  playerCount: number;
  region: string;
  country: string;
};
