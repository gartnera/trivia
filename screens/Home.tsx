import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { RootStackParamList } from "~/types";
import { supabase } from "~/lib/supabase"
import { Tables } from "~/lib/supabase.types"
import { Button, Input, Divider, Text, Card, Skeleton, FAB, ListItem, makeStyles } from '@rneui/themed'
import Heading from "~/components/Heading";
import { useDefaultStyles } from "~/lib/styles";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation }: HomeScreenProps) {
  const [existingTeams, setExistingTeams] = useState<Tables<'teams'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const styles = useDefaultStyles();

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
        {existingTeams.map((t) => <Pressable key={t.id} onPress={() => navigation.navigate("Team", { name: t.name!, id: t.id })}>
          <ListItem containerStyle={styles.listItem}>
            <ListItem.Content>
              <ListItem.Title style={styles.listTitle}>{t.name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </Pressable>)}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Heading text="My Teams" iconName="add" iconPress={() => { }}></Heading>
      {renderTeams()}
      <Heading text="My Tournaments"></Heading>
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