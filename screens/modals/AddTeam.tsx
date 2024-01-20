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
  const [joinError, setJoinError] = useState('');
  const [createError, setCreateError] = useState('');

  const goHomeWithRefresh = () => {
    navigation.goBack();
    navigation.navigate("Home", { forceRefreshKey: Math.random() })
  }

  const joinTeam = useCallback(async () => {
    const res = await supabase.rpc("join_team", { join_code: code })
    if (res.error) {
      setJoinError(res.error.message);
      return;
    }
    goHomeWithRefresh();
  }, [code, setJoinError])

  const addTeam = useCallback(async () => {
    const res = await supabase.from('teams').insert({ name: teamName, })
    if (res.error) {
      setCreateError(res.error.message);
      return;
    }
    goHomeWithRefresh();
  }, [teamName, setCreateError])

  return (
    <View style={styles.container}>
      <View>
        <Heading text='Join Team'></Heading>
        <Input value={code} onChangeText={setCode} placeholder='Code' errorMessage={joinError}></Input>
        <Button title={"Join"} onPress={joinTeam}></Button>
      </View>
      <Divider style={styles.divider}></Divider>
      <View>
        <Heading text='Add Team'></Heading>
        <Input value={teamName} onChangeText={setTeamName} placeholder='Team Name' errorMessage={createError}></Input>
        <Button title={"Create"} onPress={addTeam}></Button>
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