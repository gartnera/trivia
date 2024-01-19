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
  AddGame: {
    team_id: number,
    team_name: string,
  },
  Settings: undefined,
}