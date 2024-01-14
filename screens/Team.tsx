import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Button, Skeleton } from '@rneui/base';
import { supabase } from "~/lib/supabase";
import { Tables } from "~/lib/supabase.types";
import { RootStackParamList } from "~/types";

type TeamScreenProps = NativeStackScreenProps<RootStackParamList, 'Team'>;

export default function Team({ navigation, route }: TeamScreenProps) {
  const [existingGames, setExistingGames] = useState<Tables<'games'>[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function getGames() {
    const { data, error, status } = await supabase
      .from('games')
      .select('*')
      .filter("completed_at", "is", null);
    setLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setExistingGames(data);
  }
  useEffect(() => {
    getGames()
  }, [])

  function renderGames() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    if (existingGames.length == 0) {
      return <><Text>No games</Text></>
    }
    if (loadError) {
      return <><Text>Unable to load teams: {loadError}</Text></>
    }
    return (
      <>
        {existingGames.map((t) =>
          <Pressable key={t.id} onPress={() => navigation.navigate("Game", { id: t.id, team_id: route.params.id })}>
            <View style={styles.teamRow}>
              <Text>Game {t.id} || Tournament: {t.tournament_id}</Text>
            </View>
          </Pressable>)}
      </>
    )
  }
  return (
    <View style={styles.container}>
      <Text h2={true}>Current Games</Text>
      {renderGames()}
      <Text h2={true}>Options</Text>
      <Button style={styles.button} title="Join Game"></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  button: {
    margin: 5,
  },
  teamRow: {
    margin: 5,
    padding: 10,
    backgroundColor: "#fff"
  },
  teamSkeleton: {
    height: 40,
  }
})