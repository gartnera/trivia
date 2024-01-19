import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Divider, Input, Text } from '@rneui/themed';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Heading from '~/components/Heading';
import { supabase } from '~/lib/supabase';
import { RootStackParamList } from '~/types';

type AddTeamProps = NativeStackScreenProps<RootStackParamList, 'AddTeam'>;

export default function AddTeam({ navigation }: AddTeamProps) {
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState('');
  const [error, setError] = useState('');

  const goHomeWithRefresh = () => {
    navigation.goBack();
    navigation.navigate("Home", { forceRefreshKey: Math.random() })
  }

  const joinTeam = useCallback(async () => {
    const res = await supabase.rpc("join_team", { join_code: code })
    if (res.error) {
      setError(res.error.message);
      return;
    }
    goHomeWithRefresh();
  }, [code, setError])
  return (
    <View style={styles.container}>
      <View>
        <Heading text='Join Team'></Heading>
        <Input value={code} onChangeText={setCode} placeholder='code' errorMessage={error}></Input>
        <Button title={"Join"} onPress={joinTeam}></Button>
      </View>
      <Divider style={styles.divider}></Divider>
      <View>
        <Heading text='Add Team'></Heading>
        <Text>Not implemented</Text>
        <Input value={teamName} onChangeText={setTeamName} placeholder='team name' errorMessage={error}></Input>
        <Button title={"Create"}></Button>
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