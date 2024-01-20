import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Divider, Input, Text } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { supabase } from '~/lib/supabase';
import { RootStackParamList } from '~/types';

type CreateGameProps = NativeStackScreenProps<RootStackParamList, 'CreateGame'>;

export default function CreateGame({ navigation, route }: CreateGameProps) {
  const [rounds, setRounds] = useState('3');
  const [questionsPerRound, setQuestionsPerRound] = useState('3');
  const [error, setError] = useState('');

  const createGame = useCallback(async () => {
    const res = await supabase.rpc('generate_promptless_game', {
      tournament_id: route.params.tournament_id,
      rounds: Number.parseInt(rounds),
      prompts_per_round: Number.parseInt(questionsPerRound)
    });
    if (res.error) {
      setError(res.error.message);
      return;
    }

    navigation.goBack();
    navigation.navigate("TournamentOwner", { id: route.params.tournament_id, name: route.params.tournament_name, forceRefreshKey: Math.random() })
  }, [rounds, questionsPerRound])
  return (
    <View style={styles.container}>
      <View>
        <Input label="Rounds" value={rounds} onChangeText={setRounds} errorMessage={error} keyboardType='numeric'></Input>
        <Input label="Questions Per Round" value={questionsPerRound} onChangeText={setQuestionsPerRound} errorMessage={error} keyboardType='numeric'></Input>
        <Button title={"Create"} onPress={createGame}></Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  }
})