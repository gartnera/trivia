import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, ListItem, Skeleton, Text } from '@rneui/themed';
import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet } from "react-native";
import Heading from "~/components/Heading";
import { useEffectWithTrigger } from "~/lib/hooks";
import { useDefaultStyles } from "~/lib/styles";
import { supabase } from "~/lib/supabase";
import { Tables } from "~/lib/supabase.types";
import { RootStackParamList } from "~/types";

type TournamentOwnerScreenProps = NativeStackScreenProps<RootStackParamList, 'TournamentOwner'>;

export default function TournamentOwner({ navigation, route }: TournamentOwnerScreenProps) {
  const [games, setGames] = useState<Tables<'games'>[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const styles = useDefaultStyles();

  const getGames = useCallback(async () => {
    setLoading(true);
    const { data, error, status } = await supabase
      .from('games')
      .select('*')
      .filter("tournament_id", "eq", route.params.id)
      .order("created_at", { ascending: false })
    setLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setGames(data);
  }, [route])
  const refreshData = useEffectWithTrigger(() => {
    getGames()
  }, [getGames, route])

  function renderActiveGames() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    const activeGames = games.filter((g) => !g.completed_at)
    if (activeGames.length == 0) {
      return <><Text style={styles.text}>No active games</Text></>
    }
    if (loadError) {
      return <><Text style={styles.text}>Unable to load games: {loadError}</Text></>
    }
    return (
      <>
        {activeGames.map((t) =>
          <Pressable key={t.id} onPress={() => navigation.navigate("GameOwner", { id: t.id })}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>Game {t.id} || {t.join_code}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </Pressable>)}
      </>
    )
  }
  function renderPreviousGames() {
    const previousGames = games.filter((g) => g.completed_at)
    if (previousGames.length == 0) {
      return <></>
    }
    return (
      <>
        <Heading text="Previous Games"></Heading>
        {previousGames.map((t) =>
          <Pressable key={t.id} onPress={() => navigation.navigate("GameOwner", { id: t.id })}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>Game {t.id} || {t.join_code}</ListItem.Title>
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
      }>
      <Heading text="Active Games" iconName="add" iconPress={() => navigation.navigate("CreateGame", { tournament_id: route.params.id, tournament_name: route.params.name })}></Heading>
      {renderActiveGames()}
      {renderPreviousGames()}
    </ScrollView>
  )
}