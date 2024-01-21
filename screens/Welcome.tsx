import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, StyleSheet, Platform, NativeModules } from "react-native"
import { RootStackParamList } from "~/types";
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from "~/lib/supabase";
import { Button, useTheme, useThemeMode, Text } from '@rneui/themed'
import { useDefaultStyles } from "~/lib/styles";
import { SafeAreaView } from 'react-native-safe-area-context';

let googleSignIn: any;
try {
  googleSignIn = require('@react-native-google-signin/google-signin')
} catch {
  console.log("unable to import google signin")
}

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function getGoogleLogin() {
  if (!googleSignIn) {
    return <></>
  }
  // disable on iOS for now
  if (Platform.OS === 'ios') {
    return <></>
  }
  const themeMode = useThemeMode();

  googleSignIn.GoogleSignin.configure({
    webClientId: '10251924816-no9o263ekmbrna780ne0m0l5f1h3d8rv.apps.googleusercontent.com'
  })

  return (
    <googleSignIn.GoogleSigninButton
      size={googleSignIn.GoogleSigninButton.Size.Wide}
      color={themeMode.mode == "light" ? googleSignIn.GoogleSigninButton.Color.Light : googleSignIn.GoogleSigninButton.Color.Dark}
      style={lStyles.loginButton}
      onPress={async () => {
        try {
          await googleSignIn.GoogleSignin.hasPlayServices()
          const userInfo = await googleSignIn.GoogleSignin.signIn()
          console.log(userInfo)
          if (userInfo.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.idToken,
            })
            if (error) {
              console.error("supabase login error", error)
            }
          } else {
            console.error("no identity token")
          }
        } catch (error: any) {
          console.error("google sign in error", error)
        }
      }}
    />
  )
}

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
  return <></>
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
          {getGoogleLogin()}
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