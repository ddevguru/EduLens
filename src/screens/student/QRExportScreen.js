import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Badge } from '../../components/ui';
import { ScreenHeader } from '../../components/widgets';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 14 — Student QR Export
 * The student turns their week into a dense QR code for the teacher to scan.
 * A tidy weekly summary card sits below so the child sees what they're sharing. */
export default function QRExportScreen({ navigation, route }) {
  const profile = route?.params?.profile || { name: 'Sravanth', grade: 7 };

  const week = {
    sessions: 6,
    avgScore: 74,
    topics: [
      { name: 'Photosynthesis', score: 88, tone: colors.sage },
      { name: 'Fractions', score: 71, tone: colors.gold },
      { name: '3D Geometry', score: 42, tone: colors.coral },
    ],
  };

  return (
    <ScreenScaffold
      tint="morning"
      footer={
        <PrimaryButton
          label="Done — Back to Home"
          variant="sky"
          onPress={() => navigation.popToTop()}
        />
      }
    >
      <ScreenHeader
        title="Share with Teacher"
        kicker="WEEKLY PROGRESS"
        onBack={() => navigation.goBack()}
      />

      <Text style={styles.lead}>
        Show this code to your teacher. They will scan it to see how your
        week went — no internet needed.
      </Text>

      {/* QR card */}
      <View style={styles.qrCard}>
        <View style={styles.qrFrame}>
          <QRPlaceholder />
        </View>
        <Badge label="OFFLINE QR · READY TO SCAN" tone="sage" style={{ marginTop: spacing.md }} />
        <Text style={styles.qrName}>
          {profile.name} · Grade {profile.grade}
        </Text>
      </View>

      {/* weekly summary */}
      <Text style={styles.sectionLabel}>What this code contains</Text>

      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.skyDeep }]}>
            {week.sessions}
          </Text>
          <Text style={styles.statLabel}>Lessons this week</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: colors.sageDeep }]}>
            {week.avgScore}%
          </Text>
          <Text style={styles.statLabel}>Average score</Text>
        </View>
      </View>

      <View style={styles.topicCard}>
        <Text style={styles.topicHead}>Topics practised</Text>
        {week.topics.map((t, i) => (
          <View key={i} style={styles.topicRow}>
            <View style={[styles.topicDot, { backgroundColor: t.tone }]} />
            <Text style={styles.topicName}>{t.name}</Text>
            <Text style={[styles.topicScore, { color: t.tone }]}>{t.score}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.privacyNote}>
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path d="M12 3 L19 6 V12 Q19 18 12 21 Q5 18 5 12 V6Z"
                stroke={colors.sageDeep} strokeWidth="2" fill="none"
                strokeLinejoin="round" />
          <Path d="M9 12 L11 14 L15 10" stroke={colors.sageDeep}
                strokeWidth="2" fill="none" strokeLinecap="round"
                strokeLinejoin="round" />
        </Svg>
        <Text style={styles.privacyText}>
          Only learning progress is shared — never personal data.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

/* A decorative QR placeholder drawn in SVG. Replace with a real generated
   QR (e.g. react-native-qrcode-svg) when the sync payload is wired up. */
function QRPlaceholder() {
  const cells = [];
  const pattern = [
    '1111111011111110',
    '1000001000000010',
    '1011101011101010',
    '1011101000101110',
    '1011101011001010',
    '1000001001110110',
    '1111111010101110',
    '0000000011010000',
    '1101011101011010',
    '0100100100110110',
    '1110111011101010',
    '0001001000010100',
    '1111111010110110',
    '1000001001011010',
    '1011101011101110',
    '1011101000101010',
  ];
  pattern.forEach((row, y) => {
    row.split('').forEach((c, x) => {
      if (c === '1') {
        cells.push(
          <Rect key={`${x}-${y}`} x={x * 11} y={y * 11} width={10} height={10}
                rx={2} fill={colors.ink} />
        );
      }
    });
  });
  return (
    <Svg width={176} height={176} viewBox="0 0 176 176">
      {cells}
    </Svg>
  );
}

const styles = StyleSheet.create({
  lead: {
    ...type.body,
    color: colors.inkSoft,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  qrCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadow.card,
    marginBottom: spacing.lg,
  },
  qrFrame: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.line,
  },
  qrName: {
    ...type.subhead,
    color: colors.ink,
    marginTop: spacing.sm,
  },

  sectionLabel: {
    ...type.smallBold,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  statBox: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow.soft,
  },
  statValue: {
    fontFamily: type.hero.fontFamily,
    fontSize: 32,
  },
  statLabel: {
    ...type.small,
    color: colors.inkSoft,
    textAlign: 'center',
  },

  topicCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.soft,
  },
  topicHead: {
    ...type.smallBold,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  topicDot: {
    width: 10, height: 10, borderRadius: 5,
    marginRight: spacing.sm,
  },
  topicName: { ...type.bodyBold, color: colors.ink, flex: 1 },
  topicScore: { ...type.bodyBold },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageWash,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
  },
  privacyText: {
    ...type.small,
    color: colors.sageDeep,
    marginLeft: 8,
    flex: 1,
  },
});
