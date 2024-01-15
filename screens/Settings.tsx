import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/types";
import { Text, Button, Skeleton, Card, Dialog } from '@rneui/base';
import { Alert, View, StyleSheet } from "react-native";
import { supabase } from "~/lib/supabase";

export default function Settings() {
  return (
    <View>
      <Card>
        <Card.Title>Theme</Card.Title>
      </Card>
      <Card>
        <Card.Title>Account</Card.Title>
        <Button style={styles.button} title="Log Out" onPress={() => supabase.auth.signOut()}></Button>
        <Button style={styles.button} title="Delete Account" color="red" onPress={() => Alert.alert("deletion not implemented")}></Button>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  button: {
    marginBottom: 5
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