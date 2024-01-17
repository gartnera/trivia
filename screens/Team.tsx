import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Pressable, RefreshControl } from "react-native";
import { Text, Button, Skeleton, ListItem } from '@rneui/themed';
import { supabase } from "~/lib/supabase";
import { Tables } from "~/lib/supabase.types";
import { RootStackParamList } from "~/types";
import Heading from "~/components/Heading";
import { useDefaultStyles } from "~/lib/styles";
import { useEffectWithTrigger } from "~/lib/hooks";

type TeamScreenProps = NativeStackScreenProps<RootStackParamList, 'Team'>;

export default function Team({ navigation, route }: TeamScreenProps) {
  const [existingGames, setExistingGames] = useState<Tables<'games'>[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const styles = useDefaultStyles();

  const getGames = useCallback(async () => {
    setLoading(true);
    const { data, error, status } = await supabase
      .from('games')
      .select('*')
      .filter("completed_at", "is", null);
    setLoading(false);
    if (error) {
      setLoadError(`code: ${error.code} message: ${error.message}`);
      return;
    }
    setExistingGames(data);
  }, [])
  const refreshData = useEffectWithTrigger(() => {
    getGames()
  }, [getGames])

  function renderGames() {
    if (isLoading) {
      return <Skeleton style={styles.teamSkeleton}></Skeleton>
    }
    if (existingGames.length == 0) {
      return <><Text>No games</Text></>
    }
    if (loadError) {
      return <><Text>Unable to load teams: {loadError}</Text></>
    }
    return (
      <>
        {existingGames.map((t) =>
          <Pressable key={t.id} onPress={() => navigation.navigate("Game", { id: t.id, team_id: route.params.id })}>
            <ListItem containerStyle={styles.listItem}>
              <ListItem.Content>
                <ListItem.Title style={styles.listTitle}>Game {t.id} || Tournament: {t.tournament_id}</ListItem.Title>
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
      <Heading text="Active Games" iconName="add" iconPress={() => { }}></Heading>
      {renderGames()}
    </ScrollView>
  )
}