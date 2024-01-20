import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { Text, Button, Skeleton, Input } from '@rneui/themed';
import { RootStackParamList } from "~/types";
import { useCallback, useState } from "react";
import { Tables } from "~/lib/supabase.types";
import { supabase } from "~/lib/supabase";
import { useEffectWithTrigger, useResumed } from "~/lib/hooks";
import Heading from "~/components/Heading";

type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function Game({ navigation, route }: GameScreenProps) {
  const [game, setGame] = useState<Tables<'games'> | null>(null);
  const [prompt, setPrompt] = useState<Tables<'game_prompts'> | null>(null);
  const [positionHash, setPositionHash] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [answer, setAnswer] = useState('');
  const resumed = useResumed();

  // TODO: just query from the view instead
  const getPrompt = async (game: Tables<'games'>) => {
    if (!game || !game.current_round) {
      return
    }
    const { data, error, status } = await supabase
      .from('game_prompts')
      .select('*')
      .filter("game_id", "eq", route.params.id)
      .filter("round", "eq", game.current_round)
      .filter("round_position", "eq", game.round_position)
      .single();
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setPrompt(data);
  };

  const getGame = useCallback(async () => {
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
    setLoadError("");
    setGame(data);
    if (data.current_round != null && data.round_position != null) {
      const currentPositionHash = `${data.current_round}|${data.round_position}`;
      if (positionHash != currentPositionHash) {
        setAnswer("");
        setPositionHash(currentPositionHash);
      }
      getPrompt(data)
    }
  }, [setGame, setAnswer, positionHash])
  const refreshGame = useEffectWithTrigger(() => {
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
  }, [getGame, resumed])

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
    if (game.completed_at) {
      return <View style={styles.centeredView}><Text h3={true}>The game has finished!</Text></View>
    }
    const disabled = prompt ? prompt.closed_at != null : false;
    return <>
      <Heading text={`Round ${game.current_round}, Question ${game.round_position}`}></Heading>
      <Input autoFocus={true} placeholder="Your Answer" onChangeText={setAnswer} value={answer} disabled={disabled}></Input>
      <Button disabled={disabled}>Submit</Button>
    </>
  }

  return (
    <ScrollView contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refreshGame}></RefreshControl>
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