import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Button, Skeleton } from '@rneui/themed';
import { RootStackParamList } from "~/types";
import { useEffect, useState } from "react";
import { Tables } from "~/lib/supabase.types";
import { supabase } from "~/lib/supabase";

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function Game({ navigation, route }: GameScreenProps) {
  const [game, setGame] = useState<Tables<'games'> | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function getGame() {
    const { data, error, status } = await supabase
      .from('games')
      .select('*')
      .filter("id", "eq", route.params.id)
      .single();
    setLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setGame(data);
  }
  useEffect(() => {
    getGame()
    const gameChanges = supabase
      .channel('changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${route.params.id}`,
        },
        () => getGame()
      )
      .subscribe();
    return () => {
      gameChanges.unsubscribe();
    }
  }, [])

  function renderGame() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    if (!game) {
      return <><Text>game is not valid</Text></>
    }
    if (loadError) {
      return <><Text>Unable to load game: {loadError}</Text></>
    }
    const gameDetails = (
      <>
        <Text>Number of rounds: {game.total_rounds}</Text>
        <Text>Questions per round: {game.total_round_positions}</Text>
      </>
    )
    let status = "Unknown";
    if (!game.started_at) {
      status = "waiting for game start"
    } else {
      status = "started"
    }
    if (game.current_round) {
      status = `game in progress (round ${game.current_round} question ${game.round_position}`
    }
    return <><Text>Status: {status}</Text>{gameDetails}</>
  }

  return (
    <View style={styles.container}>
      {renderGame()}
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