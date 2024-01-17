import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { Text, Button, Skeleton } from '@rneui/themed';
import { RootStackParamList } from "~/types";
import { useEffect, useState } from "react";
import { Tables } from "~/lib/supabase.types";
import { supabase } from "~/lib/supabase";
import { useEffectWithTrigger } from "~/lib/hooks";
import Heading from "~/components/Heading";

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
  const refreshData = useEffectWithTrigger(() => {
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
    if (!game.started_at) {
      return <View style={styles.centeredView}><Text h3={true}>The game will start soon!</Text></View>
    }
    return <>
      <Heading text={`Round ${game.current_round}, Question ${game.round_position}`}></Heading>
    </>
  }

  return (
    <ScrollView contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refreshData}></RefreshControl>
      }>
      {renderGame()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})