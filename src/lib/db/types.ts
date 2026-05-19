export type UserRole = "user";

export type Team = {
  id: string;
  name: string;
  crest: string;
  country: string;
  group: string;
  stadium: string;
  coach: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type MatchStatus = "played" | "upcoming";

export type Match = {
  id: string;
  matchday: number;
  day: string;
  time: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
};

export type DatabaseSchema = {
  teams: Team[];
  matches: Match[];
  users: AppUser[];
};
