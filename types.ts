export type RootStackParamList = {
  Welcome: undefined,
  EmailAuth: undefined,
  Home: undefined,
  Team: {
    id: number,
    name: string,
  }
  Game: {
    id: number,
    team_id: number,
  }
}