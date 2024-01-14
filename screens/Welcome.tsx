import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, Platform } from "react-native"
import { RootStackParamList } from "~/types";
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from "~/lib/supabase";
import { Button, Input } from '@rneui/base'

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

function getPlatformNativeLogin() {
  if (Platform.OS === 'ios')
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
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
  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      {getPlatformNativeLogin()}
      <Button title="Login with Email" onPress={() => navigation.navigate("EmailAuth")}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})