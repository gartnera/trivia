import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Divider, Input } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import { supabase } from '~/lib/supabase';
import { RootStackParamList } from '~/types';

type JoinGameProps = NativeStackScreenProps<RootStackParamList, 'JoinGame'>;

export default function JoinGame({ navigation, route }: JoinGameProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const joinGame = useCallback(async () => {
    const res = await supabase.rpc("join_game", { team_id: route.params.team_id, join_code: code })
    if (res.error) {
      setError(res.error.message);
      return;
    }

    navigation.goBack();
    navigation.navigate("Team", { id: route.params.team_id, name: route.params.team_name, forceRefreshKey: Math.random() })
  }, [code, setError])
  return (
    <View style={styles.container}>
      <View>
        <Input value={code} onChangeText={setCode} placeholder='code' errorMessage={error}></Input>
        <Button title={"Join"} onPress={joinGame}></Button>
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