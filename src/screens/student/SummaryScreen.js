import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Badge } from '../../components/ui';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 13 — Session Summary
 * The gentle close of the loop. A hilltop-at-sunset scene, the score in a
 * soft matrix, and two paths: home, or share progress with the teacher. */
export default function SummaryScreen({ navigation, route }) {
  const profile = route?.params?.profile || { name: 'Sravanth' };
  const score = route?.params?.score ?? 2;
  const total = route?.params?.total ?? 3;

  const pop = useRef(new Animated.Value(0)).current;
  const stars = [useRef(new Animated.Value(0)).current,
                 useRef(new Animated.Value(0)).current,
                 useRef(new Animated.Value(0)).current];

  useEffect(() => {
    Animated.spring(pop, { toValue: 1, friction: 6, useNativeDriver: true }).start();
    stars.forEach((s, i) => {
      Animated.timing(s, {
        toValue: 1, duration: 400, delay: 350 + i * 220,
        easing: Easing.out(Easing.back(2)), useNativeDriver: true,
      }).start();
    });
  }, []);

  const pct = Math.round((score / total) * 100);
  const cheer =
    pct >= 80 ? 'Brilliant work!' :
    pct >= 50 ? 'Good effort today!' :
    'Every try makes you stronger';

  return (
    <ScreenScaffold
      tint="meadow"
      footer={
        <View>
          <PrimaryButton
            label="Share Progress with Teacher"
            variant="sky"
            onPress={() => navigation.navigate('QRExport', { profile, score, total })}
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path d="M7 12 L17 7 M7 12 L17 17" stroke={colors.white}
                      strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <Circle cx="5" cy="12" r="2.4" fill={colors.white} />
                <Circle cx="19" cy="6" r="2.4" fill={colors.white} />
                <Circle cx="19" cy="18" r="2.4" fill={colors.white} />
              </Svg>
            }
          />
          <PrimaryButton
            label="Return to Home"
            variant="ghost"
            style={{ marginTop: spacing.xs }}
            onPress={() => navigation.popToTop()}
          />
        </View>
      }
    >
      <View style={styles.body}>
        <Animated.View
          style={[
            styles.artWrap,
            { transform: [{ scale: pop }], opacity: pop },
          ]}
        >
          <Illustration name="summary" height={260} rounded={radius.lg} />
        </Animated.View>

        <Text style={styles.cheer}>{cheer}</Text>
        <Text style={styles.sub}>
          Here is how today's practice went, {profile.name}.
        </Text>

        {/* score matrix card */}
        <View style={styles.scoreCard}>
          {/* stars */}
          <View style={styles.starsRow}>
            {stars.map((s, i) => (
              <Animated.View
                key={i}
                style={{
                  transform: [{ scale: s }],
                  opacity: s,
                  marginHorizontal: 5,
                }}
              >
                <Svg width={42} height={42} viewBox="0 0 24 24">
                  <Path d="M12 3 L14.6 9 L21 9.4 L16 13.6 L17.7 20 L12 16.3 L6.3 20 L8 13.6 L3 9.4 L9.4 9Z"
                        fill={i < score ? colors.gold : colors.lineSoft}
                        stroke={i < score ? '#C9963F' : colors.line}
                        strokeWidth="1" strokeLinejoin="round" />
                </Svg>
              </Animated.View>
            ))}
          </View>

          <Text style={styles.bigScore}>
            {score}<Text style={styles.scoreTotal}> / {total}</Text>
          </Text>
          <Text style={styles.scoreLabel}>questions correct</Text>

          {/* mini matrix */}
          <View style={styles.matrix}>
            {Array.from({ length: total }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.matrixCell,
                  {
                    backgroundColor: i < score ? colors.sage : colors.errorWash,
                  },
                ]}
              >
                {i < score ? (
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path d="M5 12 L10 17 L19 7" stroke={colors.white}
                          strokeWidth="3" fill="none" strokeLinecap="round"
                          strokeLinejoin="round" />
                  </Svg>
                ) : (
                  <Svg width={14} height={14} viewBox="0 0 24 24">
                    <Path d="M6 6 L18 18 M18 6 L6 18" stroke={colors.error}
                          strokeWidth="3" strokeLinecap="round" />
                  </Svg>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* saved confirmation */}
        <View style={styles.savedRow}>
          <View style={styles.savedIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Path d="M5 12 L10 17 L19 7" stroke={colors.sageDeep}
                    strokeWidth="2.6" fill="none" strokeLinecap="round"
                    strokeLinejoin="round" />
            </Svg>
          </View>
          <Text style={styles.savedText}>
            Progress saved locally on this device
          </Text>
        </View>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  body: { alignItems: 'center', paddingTop: spacing.md },
  artWrap: { width: '100%' },
  cheer: {
    fontFamily: type.hero.fontFamily,
    fontSize: 28,
    color: colors.ink,
    marginTop: spacing.lg,
  },
  sub: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: spacing.lg,
  },

  scoreCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
  },
  starsRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bigScore: {
    fontFamily: type.hero.fontFamily,
    fontSize: 52,
    color: colors.sageDeep,
  },
  scoreTotal: {
    fontFamily: type.heading.fontFamily,
    fontSize: 28,
    color: colors.inkFaint,
  },
  scoreLabel: { ...type.body, color: colors.inkSoft },
  matrix: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  matrixCell: {
    width: 38, height: 38, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 4,
  },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageWash,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: spacing.lg,
  },
  savedIcon: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.sageLight,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  savedText: { ...type.smallBold, color: colors.sageDeep },
});
