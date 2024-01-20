import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { Text, Button, Skeleton, Input } from '@rneui/themed';
import { RootStackParamList } from "~/types";
import { useCallback, useState } from "react";
import { Tables } from "~/lib/supabase.types";
import { supabase } from "~/lib/supabase";
import { useEffectWithTrigger } from "~/lib/hooks";
import Heading from "~/components/Heading";

type GameOwnerScreenProps = NativeStackScreenProps<RootStackParamList, 'GameOwner'>;

export default function GameOwner({ navigation, route }: GameOwnerScreenProps) {
  const [game, setGame] = useState<Tables<'games'> | null>(null);
  const [prompt, setPrompt] = useState<Tables<'game_prompts'> | null>(null);
  const [positionHash, setPositionHash] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [answer, setAnswer] = useState('');

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
  }, [getGame])

  const advanceGame = useCallback(async () => {
    const { data, error, status } = await supabase
      .rpc('advance_game', { game_id: route.params.id })
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
  }, [route])

  const resetGame = useCallback(async () => {
    const { data, error, status } = await supabase
      .rpc('reset_game', { game_id: route.params.id })
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
  }, [route])

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
    const advanceDisabled = game.completed_at != null
    return <>
      <Heading text={`Round ${game.current_round}, Question ${game.round_position}`}></Heading>
      <Button style={styles.button} disabled={advanceDisabled} onPress={advanceGame}>Advance Game</Button>
      <Button style={styles.button} onLongPress={resetGame} color="red">Reset Game (long press)</Button>
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
    marginBottom: 5
  },
  teamSkeleton: {
    height: 40,
  },
})