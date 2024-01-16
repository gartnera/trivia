import { View, StyleSheet, Pressable } from "react-native"
import { Text, Icon } from '@rneui/themed';

export interface HeadingProps {
  text: string,
  iconName?: string,
  iconPress?(): void,
}

export default function Heading(props: HeadingProps) {
  return (
    <View style={styles.container}>
      <Text h2={true}>{props.text}</Text>
      {props.iconName &&
        <Icon size={40} style={styles.icon} name={props.iconName} onPress={() => props.iconPress!()}></Icon>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,

  },
  icon: {
    borderRadius: 20,
  }
})