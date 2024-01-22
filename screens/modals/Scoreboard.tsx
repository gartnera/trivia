import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Badge, ListItem } from '@rneui/base';
import { Button, ButtonGroup, Divider, Icon, Input, Text } from '@rneui/themed';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from "react-native";
import Heading from '~/components/Heading';
import { useDefaultStyles } from '~/lib/styles';
import { supabase } from '~/lib/supabase';
import { Tables } from '~/lib/supabase.types';
import { RootStackParamList } from '~/types';

type ScoreboardProps = NativeStackScreenProps<RootStackParamList, 'Scoreboard'>;

export default function Scoreboard({ navigation, route }: ScoreboardProps) {
  const [scoreboard, setScoreboard] = useState<Tables<'simple_scoreboard'>[]>()
  const [error, setError] = useState('')
  const styles = useDefaultStyles();

  useEffect(() => {
    const load = async () => {
      const { data, error, status } = await supabase
        .from('simple_scoreboard')
        .select("*")
        .filter("game_id", "eq", route.params.game_id)
      if (error) {
        setError(`code: ${error.code} message: ${error.message}`);
        return;
      }
      setError('')
      setScoreboard(data);
      console.log(data);
    }
    load()
  }, [route])

  function renderScores() {
    if (error) {
      return <Text>Error: {error}</Text>
    }
    if (!scoreboard) {
      return <Text>Loading</Text>
    }
    if (scoreboard.length == 0) {
      return <Text>No scores yet</Text>
    }
    return (<>
      {scoreboard.map((r, idx) =>
        <ListItem key={r.team_name} containerStyle={styles.listItem}>
          <Badge value={idx + 1}></Badge>
          <ListItem.Content >
            <ListItem.Title style={styles.listTitle}>{r.team_name} ({r.score}/{r.max_possible_score})</ListItem.Title>
          </ListItem.Content>
        </ListItem >
      )}
    </>)
  }

  return (
    <View style={lStyles.container}>
      {renderScores()}
    </View >
  )
}

const lStyles = StyleSheet.create({
  container: {
    padding: 5,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  }
})