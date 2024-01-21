import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from '@rneui/themed';
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from '~/types';

type AnswerInfoProps = NativeStackScreenProps<RootStackParamList, 'AnswerInfo'>;

function durationSince(date: Date) {
  const currentDate = new Date();
  const timeDifference = currentDate.valueOf() - date.valueOf();

  // Calculate the duration in seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} days`
  } else if (hours >= 1) {
    return `${hours} hours`
  } else if (minutes >= 1) {
    return `${minutes} minutes`
  } else {
    return `${seconds} seconds`
  }
}

function renderTs(ts: string | null) {
  if (!ts) {
    return "none"
  }
  const date = new Date(ts + "Z");
  const timeStr = date.toLocaleTimeString('en-US');
  const duration = durationSince(date);
  return `${timeStr} (${duration} ago)`
}

interface HeadingValuePairProps {
  heading: string
  value: string | number | null
}

function HeadingValuePair(props: HeadingValuePairProps) {
  return <View style={styles.headingValuePair}>
    <Text h4={true}>{props.heading}</Text>
    <Text>{props.value}</Text>
  </View>
}

export default function AnswerInfo({ navigation, route }: AnswerInfoProps) {
  return (
    <View style={styles.container}>
      <HeadingValuePair heading='Team Name' value={route.params.team_name}></HeadingValuePair>
      <HeadingValuePair heading='Team ID' value={route.params.team_id}></HeadingValuePair>
      <HeadingValuePair heading='Submitted At' value={renderTs(route.params.created_at)}></HeadingValuePair>
      <HeadingValuePair heading='Submission Updated At' value={renderTs(route.params.updated_at)}></HeadingValuePair>
      <HeadingValuePair heading='Score Updated At' value={renderTs(route.params.score_updated_at)}></HeadingValuePair>
      <HeadingValuePair heading='Answer' value={route.params.answer}></HeadingValuePair>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  headingValuePair: {
    marginBottom: 5
  }
})