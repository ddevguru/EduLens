import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenScaffold, Card, Badge, Chip } from '../../components/ui';
import { ScreenHeader, MasteryBar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 17 — Topic Mastery
 * A class-wide heatmap. Each cell is one topic; warmth shows struggle.
 * Below, the same data unrolled as readable rows so a teacher can plan
 * the week without squinting at a grid. */
export default function TopicMasteryScreen({ navigation }) {
  const [grade, setGrade] = useState('Class 8');
  const grades = ['Class 6', 'Class 7', 'Class 8', 'Class 9'];

  // mastery % per topic — drives the heatmap colour
  const topics = [
    { name: 'Photosynthesis', pct: 88, attempts: 34 },
    { name: 'Light & Reflection', pct: 79, attempts: 31 },
    { name: 'Algebra Basics', pct: 73, attempts: 38 },
    { name: 'Force & Motion', pct: 66, attempts: 29 },
    { name: 'Fractions & Ratios', pct: 58, attempts: 36 },
    { name: 'Chemical Reactions', pct: 52, attempts: 27 },
    { name: 'Cell Structure', pct: 49, attempts: 22 },
    { name: '3D Geometry', pct: 41, attempts: 33 },
    { name: 'Trigonometry', pct: 38, attempts: 19 },
  ];

  const heatColor = (pct) => {
    if (pct >= 75) return { bg: colors.sage, fg: colors.white };
    if (pct >= 60) return { bg: colors.sageLight, fg: colors.sageDeep };
    if (pct >= 50) return { bg: colors.gold, fg: colors.ink };
    if (pct >= 40) return { bg: colors.coralLight, fg: colors.coralDeep };
    return { bg: colors.coral, fg: colors.white };
  };

  const classAvg = Math.round(
    topics.reduce((s, t) => s + t.pct, 0) / topics.length
  );

  return (
    <ScreenScaffold tint="night" dark>
      <ScreenHeader
        title="Topic Mastery"
        kicker="CLASS ANALYTICS"
        dark
        onBack={() => navigation.goBack()}
      />

      <Illustration
        name="topicMastery"
        height={150}
        rounded={radius.lg}
        overlay
        style={{ ...shadow.lift, marginBottom: spacing.md }}
      />

      <Text style={styles.lead}>
        A warmer cell means more students are stuck. Tap any topic
        to see who needs help.
      </Text>

      {/* grade selector */}
      <View style={styles.chipRow}>
        {grades.map((g) => (
          <Chip
            key={g}
            label={g}
            active={grade === g}
            onPress={() => setGrade(g)}
            style={{ marginRight: 8 }}
          />
        ))}
      </View>

      {/* heatmap */}
      <View style={styles.heatCard}>
        <Text style={styles.heatTitle}>Mastery heatmap · {grade}</Text>
        <View style={styles.heatGrid}>
          {topics.map((t, i) => {
            const c = heatColor(t.pct);
            return (
              <Pressable
                key={i}
                onPress={() => navigation.navigate('StudentDetail',
                  { student: { name: 'Class view', topic: t.name } })}
                style={({ pressed }) => [
                  styles.heatCell,
                  { backgroundColor: c.bg, opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <Text style={[styles.heatPct, { color: c.fg }]}>{t.pct}%</Text>
                <Text style={[styles.heatName, { color: c.fg }]}
                      numberOfLines={2}>
                  {t.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.coral }]} />
            <Text style={styles.legendText}>Struggling</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.gold }]} />
            <Text style={styles.legendText}>Mixed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: colors.sage }]} />
            <Text style={styles.legendText}>Confident</Text>
          </View>
        </View>
      </View>

      {/* class average */}
      <View style={styles.avgRow}>
        <Text style={styles.avgLabel}>Class average mastery</Text>
        <Text style={styles.avgValue}>{classAvg}%</Text>
      </View>

      {/* topic breakdown rows */}
      <Text style={styles.sectionLabel}>Topic breakdown</Text>

      {topics.map((t, i) => (
        <Card key={i} soft style={styles.row}
              onPress={() => navigation.navigate('StudentDetail',
                { student: { name: 'Class view', topic: t.name } })}>
          <View style={styles.rowTop}>
            <Text style={styles.rowName}>{t.name}</Text>
            <Badge
              label={`${t.pct}%`}
              tone={t.pct >= 60 ? 'sage' : t.pct >= 50 ? 'gold' : 'coral'}
            />
          </View>
          <MasteryBar pct={t.pct} />
          <Text style={styles.rowMeta}>{t.attempts} attempts logged this week</Text>
        </Card>
      ))}

      <View style={styles.tipCard}>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M12 3 A6 6 0 0 1 15 14 V16 H9 V14 A6 6 0 0 1 12 3Z"
                stroke={colors.gold} strokeWidth="2" fill="none"
                strokeLinejoin="round" />
          <Path d="M9.5 19 H14.5 M10.5 21.5 H13.5" stroke={colors.gold}
                strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <Text style={styles.tipText}>
          Topics under 50% are good candidates for a whole-class
          reteach session.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  lead: {
    ...type.small,
    color: 'rgba(255,255,255,0.66)',
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },

  heatCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow.card,
    marginBottom: spacing.md,
  },
  heatTitle: {
    ...type.smallBold,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  heatCell: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: radius.md,
    padding: spacing.xs,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  heatPct: {
    fontFamily: type.hero.fontFamily,
    fontSize: 22,
  },
  heatName: {
    ...type.caption,
    lineHeight: 14,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  legendSwatch: {
    width: 12, height: 12, borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    ...type.small,
    color: colors.inkFaint,
  },

  avgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  avgLabel: {
    ...type.bodyBold,
    color: colors.white,
  },
  avgValue: {
    fontFamily: type.hero.fontFamily,
    fontSize: 24,
    color: colors.gold,
  },

  sectionLabel: {
    ...type.smallBold,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  row: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  rowName: { ...type.bodyBold, color: colors.ink, flex: 1 },
  rowMeta: {
    ...type.small,
    color: colors.inkFaint,
    marginTop: 8,
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldWash,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  tipText: {
    ...type.small,
    color: '#A87A2C',
    marginLeft: 8,
    flex: 1,
  },
});
