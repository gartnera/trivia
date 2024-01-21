import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native";
import { Text, Button, Skeleton, Input, ListItem, ButtonGroup, Icon } from '@rneui/themed';
import { RootStackParamList } from "~/types";
import { useCallback, useState } from "react";
import { Tables } from "~/lib/supabase.types";
import { supabase } from "~/lib/supabase";
import { useEffectWithTrigger } from "~/lib/hooks";
import Heading from "~/components/Heading";
import { useDefaultStyles } from "~/lib/styles";

type GameOwnerScreenProps = NativeStackScreenProps<RootStackParamList, 'GameOwner'>;

export default function GameOwner({ navigation, route }: GameOwnerScreenProps) {
  const [game, setGame] = useState<Tables<'games'> | null>(null);
  const [prompt, setPrompt] = useState<Tables<'game_prompts'> | null>(null);
  const [responses, setResponses] = useState<Tables<'responses'>[] | null>(null);
  const [positionHash, setPositionHash] = useState<string>("");
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [responseLoadError, setResponseLoadError] = useState('');
  const styles = useDefaultStyles();
  const [responsesCorrect, setReponsesCorrect] = useState<{ [key: number]: boolean }>({})

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
        setPositionHash(currentPositionHash);
      }
      getPrompt(data)
    }
  }, [setGame, positionHash])
  const refreshGame = useEffectWithTrigger(() => {
    getGame()
    const gameChanges = supabase
      .channel('game_changes')
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
      return <Skeleton style={lStyles.teamSkeleton}></Skeleton>
    }
    if (!game) {
      return <><Text>game is not valid</Text></>
    }
    if (loadError) {
      return <><Text>Unable to load games: {loadError}</Text></>
    }
    const advanceDisabled = game.completed_at != null
    return <>
      <Heading text={`Round ${game.current_round}, Question ${game.round_position}`}></Heading>
      <Button style={lStyles.button} disabled={advanceDisabled} onPress={advanceGame}>Advance Game</Button>
      <Button style={lStyles.button} onLongPress={resetGame} color="red">Reset Game (long press)</Button>
    </>
  }

  const getReponses = useCallback(async () => {
    const { data, error, status } = await supabase
      .from('responses')
      .select('*')
      .filter("game_prompt_id", "eq", prompt?.id)
    setLoading(false);
    if (error) {
      setResponseLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setResponseLoadError("");
    setResponses(data);
  }, [prompt, setResponses, positionHash])

  const refreshResponses = useEffectWithTrigger(() => {
    if (!prompt) {
      return
    }
    getReponses()
    const responseChanges = supabase
      .channel('response_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'responses',
          filter: `game_prompt_id=eq.${prompt?.id}`,
        },
        () => getReponses()
      )
      .subscribe();
    return () => {
      responseChanges.unsubscribe();
    }
  }, [prompt])

  const refreshAll = useCallback(() => {
    refreshGame();
    refreshResponses();
  }, [refreshGame, refreshResponses])

  function renderResponses() {
    if (responseLoadError) {
      return <><Text>Unable to load responses: {responseLoadError}</Text></>
    }
    if (!responses || responses.length == 0) {
      return <></>
    }
    return (<>
      <Heading text="Answers"></Heading>
      {responses.map((r) =>
        <Pressable onPress={() => { setReponsesCorrect((old) => { return { ...old, [r.id]: !old[r.id] } }) }}>
          <ListItem containerStyle={styles.listItem} key={r.id}>
            <ListItem.Content >
              <ListItem.Title style={styles.listTitle}>{r.answer}</ListItem.Title>
            </ListItem.Content>
            {responsesCorrect[r.id] ? <Icon name="check"></Icon> : <Icon name="help"></Icon>}
          </ListItem >
        </Pressable>
      )}
    </>)
  }

  return (
    <ScrollView contentContainerStyle={lStyles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refreshAll}></RefreshControl>
      }>
      {renderGame()}
      {renderResponses()}
    </ScrollView>
  )
}

const lStyles = StyleSheet.create({
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