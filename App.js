import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Nunito_500Medium,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/tokens';

/* Keep the native splash up until our storybook fonts are ready —
   the in-app SplashScreen then takes over for the branded intro. */
SplashScreen.preventAutoHideAsync().catch(() => {});

/* A soft warm-paper theme so there is never a white flash between
   screens during navigation transitions. */
const navTheme = {
  dark: false,
  colors: {
    primary: colors.sky,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
    notification: colors.coral,
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <NavigationContainer theme={navTheme} onReady={onReady}>
          <RootNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
