import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Card, Badge } from '../../components/ui';
import { Avatar } from '../../components/widgets';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 20 — QR Import States
 * One screen, three outcomes after a scan: success (progress merged),
 * duplicate (already imported this week), invalid (unreadable code).
 * Pass the outcome via route.params.result. */
export default function QRImportScreen({ navigation, route }) {
  const result = route?.params?.result || 'success';

  const pop = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(pop, {
      toValue: 1, friction: 5, tension: 90, useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.timing(ring, {
        toValue: 1, duration: 1800,
        easing: Easing.out(Easing.quad), useNativeDriver: true,
      })
    ).start();
  }, []);

  const config = {
    success: {
      tint: 'meadow',
      tone: colors.sage,
      toneDeep: colors.sageDeep,
      wash: colors.sageWash,
      kicker: 'IMPORT COMPLETE',
      title: 'Progress imported',
      body: "Sravanth's week has been merged into your class dashboard.",
      icon: 'check',
    },
    duplicate: {
      tint: 'study',
      tone: colors.gold,
      toneDeep: '#A87A2C',
      wash: colors.goldWash,
      kicker: 'ALREADY IMPORTED',
      title: 'This code was already scanned',
      body: "Sravanth's progress for this week is already in your dashboard. Nothing was changed.",
      icon: 'clock',
    },
    invalid: {
      tint: 'dusk',
      tone: colors.coral,
      toneDeep: colors.coralDeep,
      wash: colors.coralWash,
      kicker: 'COULD NOT READ',
      title: "That code didn't scan",
      body: 'The QR code was blurry or incomplete. Ask the student to hold their screen steady and try once more.',
      icon: 'cross',
    },
  }[result];

  const scale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [0.8, 2.2] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <ScreenScaffold
      tint={config.tint}
      scroll={false}
      footer={
        result === 'success' ? (
          <View>
            <PrimaryButton
              label="View Student Profile"
              variant="sage"
              onPress={() => navigation.replace('StudentDetail', {
                student: { name: 'Sravanth', avatar: 'fox', grade: 7, score: 74 },
              })}
            />
            <PrimaryButton
              label="Scan Another"
              variant="ghost"
              style={{ marginTop: spacing.xs }}
              onPress={() => navigation.replace('TeacherScanner')}
            />
          </View>
        ) : result === 'duplicate' ? (
          <View>
            <PrimaryButton
              label="Back to Dashboard"
              variant="gold"
              onPress={() => navigation.navigate('TeacherDashboard')}
            />
            <PrimaryButton
              label="Scan a Different Code"
              variant="ghost"
              style={{ marginTop: spacing.xs }}
              onPress={() => navigation.replace('TeacherScanner')}
            />
          </View>
        ) : (
          <View>
            <PrimaryButton
              label="Try Scanning Again"
              variant="coral"
              onPress={() => navigation.replace('TeacherScanner')}
            />
            <PrimaryButton
              label="Back to Dashboard"
              variant="ghost"
              style={{ marginTop: spacing.xs }}
              onPress={() => navigation.navigate('TeacherDashboard')}
            />
          </View>
        )
      }
    >
      <View style={styles.center}>
        {/* status emblem */}
        <View style={styles.emblemZone}>
          <Animated.View
            style={[
              styles.ripple,
              {
                borderColor: config.tone,
                transform: [{ scale: ringScale }],
                opacity: ringOpacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.emblem,
              { backgroundColor: config.tone, transform: [{ scale }] },
            ]}
          >
            <StatusGlyph type={config.icon} />
          </Animated.View>
        </View>

        <Badge
          label={config.kicker}
          tone={result === 'success' ? 'sage' : result === 'duplicate' ? 'gold' : 'coral'}
          style={{ marginTop: spacing.lg }}
        />
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.body}>{config.body}</Text>

        {/* success: show the imported summary */}
        {result === 'success' && (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHead}>
              <Avatar name="fox" size={48} />
              <View style={{ marginLeft: spacing.sm, flex: 1 }}>
                <Text style={styles.summaryName}>Sravanth</Text>
                <Text style={styles.summaryGrade}>Grade 7 · 6 lessons this week</Text>
              </View>
              <Text style={[styles.summaryScore, { color: config.toneDeep }]}>
                74%
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <SummaryStat label="New topics" value="3" />
              <SummaryStat label="Questions" value="18" />
              <SummaryStat label="Weak area" value="Geometry" small />
            </View>
          </Card>
        )}

        {/* duplicate: gentle context card */}
        {result === 'duplicate' && (
          <Card soft style={styles.infoCard}>
            <Text style={styles.infoText}>
              Each student's weekly code can only be imported once. They
              can generate a fresh code next week.
            </Text>
          </Card>
        )}

        {/* invalid: troubleshooting tips */}
        {result === 'invalid' && (
          <Card soft style={styles.infoCard}>
            <Text style={styles.infoHead}>Quick fixes</Text>
            {[
              'Increase the student\'s screen brightness',
              'Hold both devices steady for a moment',
              'Fit the whole code inside the frame',
            ].map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipDot, { backgroundColor: config.tone }]} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Card>
        )}
      </View>
    </ScreenScaffold>
  );
}

/* status glyph drawn in SVG so it stays crisp at any size */
function StatusGlyph({ type: t }) {
  if (t === 'check') {
    return (
      <Svg width={48} height={48} viewBox="0 0 24 24">
        <Path d="M5 13 L10 18 L19 6" stroke={colors.white} strokeWidth="3"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (t === 'clock') {
    return (
      <Svg width={48} height={48} viewBox="0 0 24 24">
        <Circle cx="12" cy="12" r="8.5" stroke={colors.white}
                 strokeWidth="2.6" fill="none" />
        <Path d="M12 7 V12 L15.5 14" stroke={colors.white} strokeWidth="2.6"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24">
      <Path d="M7 7 L17 17 M17 7 L7 17" stroke={colors.white}
            strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

function SummaryStat({ label, value, small }) {
  return (
    <View style={styles.sStat}>
      <Text style={[styles.sStatValue, small && { fontSize: 15 }]}>{value}</Text>
      <Text style={styles.sStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemZone: {
    width: 120, height: 120,
    alignItems: 'center', justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2,
  },
  emblem: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.lift,
  },

  title: {
    ...type.title,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  body: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  summaryCard: {
    width: '100%',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  summaryHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryName: { ...type.subhead, color: colors.ink },
  summaryGrade: { ...type.small, color: colors.inkFaint },
  summaryScore: {
    fontFamily: type.hero.fontFamily,
    fontSize: 28,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginVertical: spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sStat: {
    alignItems: 'center',
    flex: 1,
  },
  sStatValue: {
    fontFamily: type.subhead.fontFamily,
    fontSize: 18,
    color: colors.ink,
  },
  sStatLabel: {
    ...type.small,
    color: colors.inkFaint,
  },

  infoCard: {
    width: '100%',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  infoHead: {
    ...type.smallBold,
    color: colors.inkSoft,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...type.small,
    color: colors.inkSoft,
    lineHeight: 21,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  tipDot: {
    width: 7, height: 7, borderRadius: 4,
    marginRight: 10,
  },
  tipText: {
    ...type.small,
    color: colors.inkSoft,
    flex: 1,
  },
});
