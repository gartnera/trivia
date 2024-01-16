import { Text, Button, Skeleton, Card, Dialog, ButtonGroup } from '@rneui/themed';
import { Alert, View, StyleSheet, Appearance, ColorSchemeName } from "react-native";
import { supabase } from "~/lib/supabase";
import { useEffect, useState } from "react";
import { useDidUpdateEffect } from "~/lib/hooks";

const themeOptions = ["auto", "light", "dark"]

export default function Settings() {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    // WARN: this will never actually return null
    const index = themeOptions.indexOf(Appearance.getColorScheme() as string)
    setThemeIndex(index);
  }, [setThemeIndex])

  useDidUpdateEffect(() => {
    let theme: string | null = themeOptions[themeIndex];
    if (theme === "auto") {
      theme = null;
    }
    Appearance.setColorScheme(theme as ColorSchemeName)
  }, [themeIndex])

  return (
    <View>
      <Card>
        <Card.Title>Theme</Card.Title>
        <ButtonGroup
          buttons={themeOptions}
          selectedIndex={themeIndex}
          onPress={(value) => {
            setThemeIndex(value);
          }}
        ></ButtonGroup>
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