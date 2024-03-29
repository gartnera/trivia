import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react"
import { View, StyleSheet, Pressable, ScrollView, RefreshControl } from "react-native"
import { RootStackParamList } from "~/types";
import { supabase } from "~/lib/supabase"
import { Tables } from "~/lib/supabase.types"
import { Button, Input, Divider, Text, Card, Skeleton, FAB, ListItem, makeStyles } from '@rneui/themed'
import Heading from "~/components/Heading";
import { useDefaultStyles } from "~/lib/styles";
import { useEffectWithTrigger } from "~/lib/hooks";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function Home({ navigation, route }: HomeScreenProps) {
  const [existingTeams, setExistingTeams] = useState<Tables<'teams'>[]>([]);
  const [tournaments, setTournaments] = useState<Tables<'tournaments'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const styles = useDefaultStyles();

  const getTeams = useCallback(async () => {
    setIsLoading(true);
    const { data, error, status } = await supabase
      .from('teams')
      .select("*")
      .order("created_at", { ascending: false })
    setIsLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setExistingTeams(data);
  }, [])
  const getTournaments = useCallback(async () => {
    const { data, error, status } = await supabase
      .from('tournaments')
      .select("*")
    setIsLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setTournaments(data);
  }, [])
  const refreshData = useEffectWithTrigger(() => {
    getTeams()
    getTournaments()
  }, [getTeams, route])

  function renderTeams() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    if (existingTeams.length == 0) {
      return <><Text style={styles.text}>No Teams</Text></>
    }
    if (loadError) {
      return <><Text style={styles.text}>Unable to load teams: {loadError}</Text></>
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

  function renderTournaments() {
    if (tournaments.length == 0) {
      return <></>
    }
    return (
      <>
        <Heading text="My Tournaments"></Heading>
        {tournaments.map((t) => <Pressable key={t.id} onPress={() => navigation.navigate("TournamentOwner", { name: t.name!, id: t.id })}>
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
    <ScrollView style={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={refreshData}></RefreshControl>
      }
    >
      <Heading text="My Teams" iconName="add" iconPress={() => navigation.navigate("AddTeam")}></Heading>
      {renderTeams()}
      {renderTournaments()}
    </ScrollView>
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