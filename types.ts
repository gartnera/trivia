export type RootStackParamList = {
  Welcome: undefined,
  EmailAuth: undefined,
  Home: {
    forceRefreshKey?: number,
  },
  Team: {
    id: number,
    name: string,
    forceRefreshKey?: number,
  }
  Game: {
    id: number,
    team_id: number,
  }
  GameOwner: {
    id: number,
  }
  AddTeam: undefined,
  TeamInfo: {
    team_id: number,
    team_name: string,
  }
  JoinGame: {
    team_id: number,
    team_name: string,
  },
  CreateGame: {
    tournament_id: number,
    tournament_name: string,
  },
  Settings: undefined,
  TournamentOwner: {
    id: number,
    name: string,
    forceRefreshKey?: number,
  }
  AnswerInfo: {
    team_id: number | null
    team_name: string | null
    created_at: string | null
    updated_at: string | null
    score_updated_at: string | null
    answer: string | null
  }
}