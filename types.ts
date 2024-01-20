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
  AddTeam: undefined,
  TeamInfo: {
    team_id: number,
    team_name: string,
  }
  AddGame: {
    team_id: number,
    team_name: string,
  },
  Settings: undefined,
}