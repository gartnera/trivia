import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Divider, Input, Text } from '@rneui/themed';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Heading from '~/components/Heading';
import { supabase } from '~/lib/supabase';
import { Tables } from '~/lib/supabase.types';
import { RootStackParamList } from '~/types';

type TeamInfoProps = NativeStackScreenProps<RootStackParamList, 'TeamInfo'>;

export default function TeamInfo({ navigation, route }: TeamInfoProps) {
  const [code, setCode] = useState('');
  const [teamName, setTeamName] = useState(route.params.team_name);
  const [codeError, setCodeError] = useState('');

  const goBackWithRefresh = () => {
    navigation.goBack();
    navigation.navigate("Team", { forceRefreshKey: Math.random(), id: route.params.team_id, name: teamName })
  }

  useEffect(() => {
    const load = async () => {
      const { data, error, status } = await supabase
        .from('teams')
        .select("*")
        .filter("id", "eq", route.params.team_id)
        .single()
      if (error) {
        setCodeError(`code: ${error.code} message: ${error.message}`);
        return;
      }
      setCode(data.join_code!);
    }
    load()
  }, [route])

  const update = useCallback(async () => {
    const { data, error, status } = await supabase
      .from('teams')
      .update({ join_code: code, name: teamName })
      .filter('id', 'eq', route.params.team_id);
    if (error) {
      setCodeError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    goBackWithRefresh()
  }, [route, code, teamName])

  return (
    <View style={styles.container}>
      <View>
        <Heading text='Name'></Heading>
        <Input value={teamName} onChangeText={setTeamName} placeholder='Team Name'></Input>
        <Heading text='Join Code'></Heading>
        <Input value={code} onChangeText={setCode} placeholder='Code' errorMessage={codeError}></Input>
        <Button title="Update" onPress={update}></Button>
      </View>
    </View >
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