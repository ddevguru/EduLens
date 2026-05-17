import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, Card, Badge } from '../../components/ui';
import { ScreenHeader, Avatar, Stat, MasteryBar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 18 — Student Detail
 * One child, seen clearly. A portrait header, the shape of their week,
 * what they're strong at, where they slip, and a gentle session log. */
export default function StudentDetailScreen({ navigation, route }) {
  const passed = route?.params?.student || {};
  const student = {
    name: passed.name || 'Sravanth',
    avatar: passed.avatar || 'fox',
    grade: passed.grade || 7,
    score: passed.score ?? 74,
    sessions: 6,
    streak: 4,
  };

  const strengths = [
    { name: 'Photosynthesis', pct: 92 },
    { name: 'Light & Reflection', pct: 84 },
  ];
  const weaknesses = [
    { name: '3D Geometry', pct: 38 },
    { name: 'Chemical Reactions', pct: 46 },
  ];

  const history = [
    { topic: 'Photosynthesis', result: '3/3', when: 'Today', tone: colors.sage },
    { topic: '3D Geometry', result: '1/3', when: 'Today', tone: colors.coral },
    { topic: 'Fractions & Ratios', result: '2/3', when: 'Yesterday', tone: colors.gold },
    { topic: 'Light & Reflection', result: '3/3', when: '2 days ago', tone: colors.sage },
  ];

  return (
    <ScreenScaffold tint="night" dark>
      <ScreenHeader
        title="Student Profile"
        kicker="INDIVIDUAL VIEW"
        dark
        onBack={() => navigation.goBack()}
      />

      {/* portrait header */}
      <View style={styles.hero}>
        <Illustration
          name="studentDetail"
          height={150}
          rounded={radius.lg}
          overlay
          style={shadow.lift}
        />
        <View style={styles.heroFront}>
          <View style={styles.avatarRing}>
            <Avatar name={student.avatar} size={76} ring={false} />
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <View style={styles.heroBadges}>
            <Badge label={`GRADE ${student.grade}`} tone="sky" />
            <View style={{ width: 8 }} />
            <Badge label={`${student.streak}-DAY STREAK`} tone="gold" />
          </View>
        </View>
      </View>

      {/* week stats */}
      <View style={styles.statCard}>
        <Stat value={`${student.score}%`} label="Avg score" tone={colors.skyDeep} />
        <View style={styles.statSplit} />
        <Stat value={student.sessions} label="Lessons" tone={colors.sageDeep} />
        <View style={styles.statSplit} />
        <Stat value={student.streak} label="Day streak" tone={colors.gold} />
      </View>

      {/* strengths */}
      <View style={styles.sectionHead}>
        <View style={[styles.dot, { backgroundColor: colors.sage }]} />
        <Text style={styles.sectionLabel}>Strong topics</Text>
      </View>
      <Card style={styles.groupCard}>
        {strengths.map((s, i) => (
          <View key={i} style={[
            styles.skillRow,
            i < strengths.length - 1 && styles.skillDivider,
          ]}>
            <View style={styles.skillTop}>
              <Text style={styles.skillName}>{s.name}</Text>
              <Text style={[styles.skillPct, { color: colors.sageDeep }]}>
                {s.pct}%
              </Text>
            </View>
            <MasteryBar pct={s.pct} tone={colors.sage} />
          </View>
        ))}
      </Card>

      {/* weaknesses */}
      <View style={styles.sectionHead}>
        <View style={[styles.dot, { backgroundColor: colors.coral }]} />
        <Text style={styles.sectionLabel}>Needs more practice</Text>
      </View>
      <Text style={styles.weakSuggest}>
        EduLens suggests: re-scan the 3D Geometry chapter together.
      </Text>
      <Card style={styles.groupCard}>
        {weaknesses.map((w, i) => (
          <View key={i} style={[
            styles.skillRow,
            i < weaknesses.length - 1 && styles.skillDivider,
          ]}>
            <View style={styles.skillTop}>
              <Text style={styles.skillName}>{w.name}</Text>
              <Text style={[styles.skillPct, { color: colors.coralDeep }]}>
                {w.pct}%
              </Text>
            </View>
            <MasteryBar pct={w.pct} tone={colors.coral} />
          </View>
        ))}
      </Card>

      {/* gemma note */}
      <View style={styles.noteCard}>
        <View style={styles.noteIcon}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15.5 L7 19 L9 13 L4 9 L10 9Z"
                  fill={colors.gold} />
          </Svg>
        </View>
        <Text style={styles.noteText}>
          {student.name} learns visual topics quickly but slows down on
          spatial reasoning. Pairing 3D Geometry with diagrams may help.
        </Text>
      </View>

      {/* session history */}
      <Text style={[styles.sectionLabel, { marginTop: spacing.lg, marginLeft: 0 }]}>
        Recent sessions
      </Text>
      <View style={styles.historyCard}>
        {history.map((h, i) => (
          <View key={i} style={[
            styles.histRow,
            i < history.length - 1 && styles.histDivider,
          ]}>
            <View style={[styles.histDot, { backgroundColor: h.tone }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.histTopic}>{h.topic}</Text>
              <Text style={styles.histWhen}>{h.when}</Text>
            </View>
            <Text style={[styles.histResult, { color: h.tone }]}>{h.result}</Text>
          </View>
        ))}
      </View>

      <View style={styles.privacy}>
        <Svg width={15} height={15} viewBox="0 0 24 24">
          <Path d="M12 3 L19 6 V12 Q19 18 12 21 Q5 18 5 12 V6Z"
                stroke={colors.sageLight} strokeWidth="2" fill="none"
                strokeLinejoin="round" />
        </Svg>
        <Text style={styles.privacyText}>
          Imported via QR · stored only on this device
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: spacing.md,
  },
  heroFront: {
    alignItems: 'center',
    marginTop: -52,
  },
  avatarRing: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: colors.card,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.card,
  },
  name: {
    ...type.title,
    color: colors.white,
    marginTop: spacing.xs,
  },
  heroBadges: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },

  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
    marginBottom: spacing.lg,
  },
  statSplit: {
    width: 1, height: 38,
    backgroundColor: colors.line,
  },

  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 9, height: 9, borderRadius: 5,
    marginRight: 8,
  },
  sectionLabel: {
    ...type.smallBold,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },

  groupCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  weakSuggest: {
    ...type.small,
    color: colors.skyLight,
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  skillRow: {
    paddingVertical: spacing.sm,
  },
  skillDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  skillTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: { ...type.bodyBold, color: colors.ink },
  skillPct: { ...type.bodyBold },

  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#46406040',
    borderWidth: 1,
    borderColor: 'rgba(228,179,99,0.35)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  noteIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(228,179,99,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  noteText: {
    ...type.small,
    color: 'rgba(255,255,255,0.78)',
    flex: 1,
    lineHeight: 21,
  },

  historyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  histDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  histDot: {
    width: 10, height: 10, borderRadius: 5,
    marginRight: spacing.sm,
  },
  histTopic: { ...type.bodyBold, color: colors.ink },
  histWhen: { ...type.small, color: colors.inkFaint },
  histResult: {
    fontFamily: type.subhead.fontFamily,
    fontSize: 17,
  },

  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  privacyText: {
    ...type.small,
    color: 'rgba(255,255,255,0.46)',
    marginLeft: 6,
  },
});
