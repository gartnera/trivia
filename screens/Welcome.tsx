import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Platform } from "react-native"
import { RootStackParamList } from "~/types";
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from "~/lib/supabase";
import { Button, useTheme, useThemeMode, Text } from '@rneui/themed'
import { useDefaultStyles } from "~/lib/styles";
import { SafeAreaView } from 'react-native-safe-area-context';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function getPlatformNativeLogin() {
  const themeMode = useThemeMode();

  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={themeMode.mode == "light" ? AppleAuthentication.AppleAuthenticationButtonStyle.BLACK : AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
        cornerRadius={5}
        style={lStyles.loginButton}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const {
                error,
                data: { user },
              } = await supabase.auth.signInWithIdToken({
                provider: 'apple',
                token: credential.identityToken,
              })
              console.log(JSON.stringify({ error, user }, null, 2))
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error('No identityToken.')
            }
          } catch (e: any) {
            if (e.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    )
  return <>{/* Implement Android Auth options. */}</>
}

export default function Welcome({ navigation, route }: WelcomeScreenProps) {
  const styles = useDefaultStyles()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ ...styles.container, ...lStyles.container }}>
        <Text h3={true} style={styles.text}>Welcome!</Text>
        <Text>Please login to save your progress and rankings</Text>
        <View style={lStyles.loginButtons}>
          {getPlatformNativeLogin()}
          <Button title="Login with Email" style={lStyles.loginButton} onPress={() => navigation.navigate("EmailAuth")}></Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const lStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtons: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  loginButton: {
    width: 200,
    height: 64,
    marginTop: 10,
  }
})