import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { RootStackParamList } from "~/types";
import { supabase } from "~/lib/supabase"
import { Tables } from "~/lib/supabase.types"
import { Button, Input, Divider, Text, Card, Skeleton } from '@rneui/base'

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: HomeScreenProps) {
  const [existingTeams, setExistingTeams] = useState<Tables<'teams'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function getTeams() {
    const { data, error, status } = await supabase
      .from('teams')
      .select("*")
    setIsLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setExistingTeams(data);
  }
  useEffect(() => {
    getTeams()
  }, [])

  function renderTeams() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    if (existingTeams.length == 0) {
      return <><Text>No Teams</Text></>
    }
    if (loadError) {
      return <><Text>Unable to load teams: {loadError}</Text></>
    }
    return (
      <>
        {existingTeams.map((t) => <Pressable key={t.id} onPress={() => navigation.navigate("Team", { name: t.name!, id: t.id })}><View style={styles.teamRow}><Text>{t.name}</Text></View></Pressable>)}
        <Divider></Divider>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Text h2={true}>My Teams</Text>
      {renderTeams()}
      <Text h2={true}>Options</Text>
      <Button style={styles.button} title="Create Team"></Button>
      <Button style={styles.button} title="Join Team"></Button>
      <Button style={styles.button} title="Log Out" onPress={() => supabase.auth.signOut()}></Button>
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