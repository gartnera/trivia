import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '~/types';
import Welcome from '~/screens/Welcome'
import EmailAuth from '~/screens/EmailAuth'
import Home from '~/screens/Home'
import Team from './screens/Team'
import Game from './screens/Game'

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
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Team" component={Team} options={({ route }) => ({ title: route.params.name, headerBackTitle: "Teams" })} />
            <Stack.Screen name="Game" component={Game} options={({ route }) => ({
              title: `Game: ${route.params.id}`,
              headerBackTitle: "Team",
            })} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}