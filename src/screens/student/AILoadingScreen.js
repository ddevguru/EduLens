import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenScaffold } from '../../components/ui';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, gradients } from '../../theme/tokens';

/* Screen 8 — AI Loading
 * The "EduLens is reading your page" moment. A patient owl, a soft filling
 * progress bar, and rotating reassurance lines. Auto-advances to the Lesson. */
const STEPS = [
  'Looking at your page…',
  'Reading the words and pictures…',
  'Thinking of a simple way to explain…',
  'Writing it in your language…',
];

export default function AILoadingScreen({ navigation, route }) {
  const profile = route?.params?.profile;
  const progress = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 4200,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start(() => navigation.replace('Lesson', { profile }));

    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();

    const interval = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i));
    }, 1050);
    return () => clearInterval(interval);
  }, []);

  const widthPct = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });
  const lift = float.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });

  return (
    <ScreenScaffold tint="study" scroll={false} padded>
      <View style={styles.body}>
        <Animated.View style={{ transform: [{ translateY: lift }], width: '100%' }}>
          <Illustration name="aiThinking" height={260} rounded={radius.lg} />
        </Animated.View>

        <View style={styles.kickerRow}>
          <View style={styles.kickerDot} />
          <Text style={styles.kicker}>EDULENS IS READING YOUR PAGE</Text>
        </View>

        <Text style={styles.title}>Give me just a moment</Text>
        <Text style={styles.step}>{STEPS[stepIndex]}</Text>

        {/* progress bar */}
        <View style={styles.track}>
          <Animated.View style={[styles.fillWrap, { width: widthPct }]}>
            <LinearGradient
              colors={[colors.gold, colors.coral]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fill}
            />
          </Animated.View>
        </View>

        {/* step dots */}
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i <= stepIndex
                  ? { backgroundColor: colors.coral }
                  : { backgroundColor: colors.line },
              ]}
            />
          ))}
        </View>

        <Text style={styles.note}>
          Everything happens right here on your device — no internet needed.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  kickerDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.coral, marginRight: 8,
  },
  kicker: { ...type.caption, color: colors.coralDeep },
  title: {
    ...type.title,
    color: colors.ink,
    marginTop: spacing.xs,
  },
  step: {
    ...type.body,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    minHeight: 26,
  },
  track: {
    width: '100%',
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  fillWrap: { height: '100%' },
  fill: { flex: 1, borderRadius: 7 },
  dotsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    marginHorizontal: 5,
  },
  note: {
    ...type.small,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});
