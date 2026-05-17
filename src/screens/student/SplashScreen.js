import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Illustration from '../../components/Illustration';
import { colors, gradients, type, spacing, radius } from '../../theme/tokens';

/* Screen 1 — Splash
 * A quiet anime sunrise. The wordmark fades up over a lantern scene,
 * then auto-advances to Onboarding (first run) or Welcome. */
export default function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(24)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1, duration: 900, easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0, duration: 900, easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    let cancelled = false;
    const t = setTimeout(async () => {
      let onboarded = false;
      try {
        const v = await AsyncStorage.getItem('edulens_onboarded');
        onboarded = v === 'true';
      } catch (_) {
        onboarded = false;
      }
      if (!cancelled) {
        navigation.replace(onboarded ? 'Welcome' : 'Onboarding');
      }
    }, 2600);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradients.dawn}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* floating motes for atmosphere */}
      {[18, 42, 70, 88].map((left, i) => (
        <Animated.View
          key={i}
          style={[
            styles.mote,
            {
              left: `${left}%`,
              top: `${20 + i * 15}%`,
              opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] }),
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.center,
          { opacity: fade, transform: [{ translateY: rise }] },
        ]}
      >
        <View style={styles.art}>
          <Illustration name="splash" height={260} rounded={radius.lg} />
        </View>

        <View style={styles.brandRow}>
          <View style={styles.mark}>
            <Svg width={26} height={26} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="9" stroke={colors.white} strokeWidth="2" fill="none" />
              <Circle cx="12" cy="12" r="3.4" fill={colors.white} />
              <Path d="M12 3 V6 M12 18 V21 M3 12 H6 M18 12 H21"
                    stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.brand}>EduLens</Text>
        </View>

        <Text style={styles.tagline}>
          A gentle light for every learner
        </Text>
      </Animated.View>

      <Animated.Text style={[styles.foot, { opacity: fade }]}>
        Works fully offline · Built for every classroom
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', paddingHorizontal: spacing.xl },
  art: { width: '88%', marginBottom: spacing.xl, ...{} },
  mote: {
    position: 'absolute',
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: colors.white,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  mark: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brand: {
    fontFamily: type.hero.fontFamily,
    fontSize: 40,
    color: colors.ink,
  },
  tagline: {
    ...type.body,
    color: colors.inkSoft,
    marginTop: spacing.xs,
  },
  foot: {
    position: 'absolute',
    bottom: spacing.xxl + spacing.md,
    ...type.caption,
    color: colors.inkFaint,
  },
});
