import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/types';
import Welcome from '~/screens/Welcome'
import EmailAuth from '~/screens/EmailAuth'
import Home from '~/screens/Home'
import Team from './screens/Team'
import Game from './screens/Game'
import Settings from './screens/Settings'
import { Text, Button, Icon } from '@rneui/base';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])
  const settingsButton = (navigation: any) => () => <Icon name="settings" onPress={() => navigation.navigate("Settings")}></Icon>
  return (
    <NavigationContainer>
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
              title: "My Teams"
            })} />
            <Stack.Screen name="Team" component={Team} options={({ route, navigation }) => ({
              title: route.params.name,
              headerBackTitle: "Teams",
              headerRight: settingsButton(navigation),
            })} />
            <Stack.Screen name="Game" component={Game} options={({ route, navigation }) => ({
              title: `Game: ${route.params.id}`,
              headerBackTitle: "Team",
              headerRight: settingsButton(navigation),
            })} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="Settings" component={Settings} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}