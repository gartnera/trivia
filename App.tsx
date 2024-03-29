import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Icon, ThemeProvider, createTheme, useTheme } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import 'react-native-url-polyfill/auto';
import EmailAuth from '~/screens/EmailAuth';
import Home from '~/screens/Home';
import Welcome from '~/screens/Welcome';
import { RootStackParamList } from '~/types';
import { supabase } from './lib/supabase';
import Game from './screens/Game';
import Team from './screens/Team';
import JoinGame from './screens/modals/JoinGame';
import AddTeam from './screens/modals/AddTeam';
import Settings from './screens/modals/Settings';
import * as Updates from 'expo-updates';
import TeamInfo from './screens/modals/TeamInfo';
import TournamentOwner from './screens/TournamentOwner';
import GameOwner from './screens/GameOwner';
import CreateGame from './screens/modals/CreateGame';
import AnswerInfo from './screens/modals/AnswerInfo';
import Scoreboard from './screens/modals/Scoreboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = createTheme({});

function Navigation() {
  const [session, setSession] = useState<Session | null>(null)
  const { theme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const res = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => res.data.subscription.unsubscribe()
  }, [setSession])

  const settingsButton = (navigation: any) => () => <Icon name="settings" onPress={() => navigation.navigate("Settings")}></Icon>

  const teamInfoButton = (navigation: any) => (team_id: number, team_name: string) => {
    return <Icon name="info-outline" style={{ marginRight: 7 }} onPress={() => navigation.navigate("TeamInfo", { team_id, team_name })}></Icon>
  }

  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.white,
          text: theme.colors.black,
          border: theme.colors.secondary,
          notification: theme.colors.secondary,
        },
        dark: theme.mode === 'dark',
      }}>
      <Stack.Navigator>
        {session == null ? (
          <>
            <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
            <Stack.Screen name="EmailAuth" component={EmailAuth} options={{ title: "Login with Email" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={Home} options={({ route, navigation }) => ({
              headerRight: settingsButton(navigation),
              title: "Home"
            })} />
            <Stack.Screen name="Team" component={Team} options={({ route, navigation }) => ({
              title: route.params.name,
              headerBackTitle: "Teams",
              headerRight: () => <>{teamInfoButton(navigation)(route.params.id, route.params.name)}{settingsButton(navigation)()}</>,
            })} />
            <Stack.Screen name="Game" component={Game} options={({ route, navigation }) => ({
              title: `Game: ${route.params.id}`,
              headerBackTitle: "Team",
              headerRight: settingsButton(navigation),
            })} />
            <Stack.Screen name="TournamentOwner" component={TournamentOwner} options={({ route, navigation }) => ({
              title: `${route.params.name} 🧑‍⚖️`,
              headerBackTitle: "Home",
              headerRight: settingsButton(navigation),
            })} />
            <Stack.Screen name="GameOwner" component={GameOwner} options={({ route, navigation }) => ({
              title: `Game Control`,
              headerBackTitle: "🧑‍⚖️",
              headerRight: settingsButton(navigation),
            })} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="AddTeam" component={AddTeam} options={{ title: "Add Team" }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="JoinGame" component={JoinGame} options={{ title: "Join Game" }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="TeamInfo" component={TeamInfo} options={{ title: "Team Info" }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="CreateGame" component={CreateGame} options={{ title: "Create Promptless Game" }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="AnswerInfo" component={AnswerInfo} options={{ title: "Answer Details" }} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="Scoreboard" component={Scoreboard} options={{ title: "Scoreboard" }} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  const colorScheme = useColorScheme();
  theme.mode = colorScheme ? colorScheme : "light";

  useEffect(() => {
    console.log(`updates config: channel ${Updates.channel}, auto: ${Updates.checkAutomatically}`)
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Navigation></Navigation>
    </ThemeProvider>
  )
}