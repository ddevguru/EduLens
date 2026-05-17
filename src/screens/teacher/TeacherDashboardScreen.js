import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Card, Badge } from '../../components/ui';
import { ScreenHeader, Stat, MasteryBar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 16 — Teacher Dashboard
 * The lamp-lit desk where a teacher sees the whole class at a glance.
 * Three glance-stats, a "focus this week" recommendation from Gemma,
 * the weakest topics, and the most recent QR imports. */
export default function TeacherDashboardScreen({ navigation }) {
  const klass = {
    students: 38,
    avgMastery: 64,
    needHelp: 9,
  };

  const focusTopic = '3D Geometry';

  const weakTopics = [
    { name: '3D Geometry', pct: 41, grade: 'Class 8' },
    { name: 'Chemical Reactions', pct: 52, grade: 'Class 9' },
    { name: 'Fractions & Ratios', pct: 58, grade: 'Class 6' },
  ];

  const recentImports = [
    { name: 'Sravanth', avatar: 'fox', when: '2 min ago', score: 74, tone: colors.gold },
    { name: 'Aisha', avatar: 'owl', when: '14 min ago', score: 91, tone: colors.sage },
    { name: 'Rahul', avatar: 'deer', when: '1 hr ago', score: 48, tone: colors.coral },
  ];

  return (
    <ScreenScaffold
      tint="night"
      dark
      footer={
        <PrimaryButton
          label="Scan a Student's QR Code"
          variant="gold"
          onPress={() => navigation.navigate('TeacherScanner')}
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path d="M4 8 V4 H8 M16 4 H20 V8 M20 16 V20 H16 M8 20 H4 V16"
                    stroke={colors.ink} strokeWidth="2.2" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
              <Rect x="9" y="9" width="6" height="6" rx="1.2" fill={colors.ink} />
            </Svg>
          }
        />
      }
    >
      <ScreenHeader
        title="Class Dashboard"
        kicker="TEACHER VIEW"
        dark
        right={
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            style={({ pressed }) => [styles.gear, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="3.2" stroke={colors.white}
                       strokeWidth="2" fill="none" />
              <Path d="M12 2.5 V5 M12 19 V21.5 M21.5 12 H19 M5 12 H2.5 M18.7 5.3 L17 7 M7 17 L5.3 18.7 M18.7 18.7 L17 17 M7 7 L5.3 5.3"
                    stroke={colors.white} strokeWidth="2" strokeLinecap="round" />
            </Svg>
          </Pressable>
        }
      />

      {/* hero strip */}
      <Illustration
        name="teacherDash"
        height={260}
        rounded={radius.lg}
        overlay
        style={{ ...shadow.lift, marginBottom: spacing.md }}
      />

      <Text style={styles.greeting}>Good evening</Text>
      <Text style={styles.greetingSub}>
        Here's how your class has been learning this week.
      </Text>

      {/* glance stats */}
      <View style={styles.statCard}>
        <Stat value={klass.students} label="Students" tone={colors.skyDeep} />
        <View style={styles.statSplit} />
        <Stat value={`${klass.avgMastery}%`} label="Avg mastery" tone={colors.skyDeep} />
        <View style={styles.statSplit} />
        <Stat value={klass.needHelp} label="Need help" tone={colors.skyDeep} />
      </View>

      {/* focus recommendation */}
      <View style={styles.focusCard}>
        <View style={styles.focusGlow}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path d="M12 3 L14 9 L20 9 L15 13 L17 19 L12 15.5 L7 19 L9 13 L4 9 L10 9Z"
                  fill={colors.gold} />
          </Svg>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.focusKicker}>EDULENS SUGGESTS</Text>
          <Text style={styles.focusTitle}>
            This week, focus on{'\n'}
            <Text style={{ color: colors.gold }}>{focusTopic}</Text>
          </Text>
          <Text style={styles.focusBody}>
            41% class mastery — the lowest this week. A short reteach
            could lift many students at once.
          </Text>
        </View>
      </View>

      {/* weak topics */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Topics that need attention</Text>
        <Pressable onPress={() => navigation.navigate('TopicMastery')}>
          <Text style={styles.sectionLink}>See all</Text>
        </Pressable>
      </View>

      {weakTopics.map((t, i) => (
        <Card key={i} soft style={styles.topicCard}
              onPress={() => navigation.navigate('TopicMastery')}>
          <View style={styles.topicTop}>
            <Text style={styles.topicName}>{t.name}</Text>
            <Text style={[styles.topicPct, {
              color: t.pct >= 70 ? colors.sageDeep
                   : t.pct >= 50 ? colors.gold : colors.coralDeep,
            }]}>{t.pct}%</Text>
          </View>
          <MasteryBar pct={t.pct} />
          <Text style={styles.topicGrade}>{t.grade}</Text>
        </Card>
      ))}

      {/* recent imports */}
      <Text style={[styles.sectionLabel, { marginTop: spacing.lg }]}>
        Recent QR imports
      </Text>

      <View style={styles.importCard}>
        {recentImports.map((s, i) => (
          <Pressable
            key={i}
            onPress={() => navigation.navigate('StudentDetail', { student: s })}
            style={({ pressed }) => [
              styles.importRow,
              i < recentImports.length - 1 && styles.importDivider,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View style={[styles.importDot, { backgroundColor: s.tone }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.importName}>{s.name}</Text>
              <Text style={styles.importWhen}>{s.when}</Text>
            </View>
            <Badge
              label={`${s.score}%`}
              tone={s.score >= 70 ? 'sage' : s.score >= 50 ? 'gold' : 'coral'}
            />
            <Svg width={18} height={18} viewBox="0 0 24 24" style={{ marginLeft: 6 }}>
              <Path d="M9 5 L16 12 L9 19" stroke={colors.inkFaint}
                    strokeWidth="2.2" fill="none" strokeLinecap="round"
                    strokeLinejoin="round" />
            </Svg>
          </Pressable>
        ))}
      </View>

      <View style={styles.syncNote}>
        <View style={styles.syncDot} />
        <Text style={styles.syncText}>
          All data lives on this device. Nothing is sent online.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  gear: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },

  greeting: {
    ...type.title,
    color: colors.white,
  },
  greetingSub: {
    ...type.small,
    color: 'rgba(255,255,255,0.62)',
    marginTop: 2,
    marginBottom: spacing.md,
  },

  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    ...shadow.card,
    marginBottom: spacing.md,
  },
  statSplit: {
    width: 1,
    height: 38,
    backgroundColor: colors.line,
  },

  focusCard: {
    flexDirection: 'row',
    backgroundColor: '#46406040',
    borderWidth: 1,
    borderColor: 'rgba(228,179,99,0.4)',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  focusGlow: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(228,179,99,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  focusKicker: {
    ...type.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  focusTitle: {
    ...type.heading,
    color: colors.white,
    marginTop: 2,
  },
  focusBody: {
    ...type.small,
    color: 'rgba(255,255,255,0.66)',
    marginTop: 6,
  },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    ...type.smallBold,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  sectionLink: {
    ...type.smallBold,
    color: colors.gold,
  },

  topicCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  topicTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  topicName: { ...type.bodyBold, color: colors.ink },
  topicPct: { ...type.bodyBold },
  topicGrade: {
    ...type.small,
    color: colors.inkFaint,
    marginTop: 8,
  },

  importCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    ...shadow.card,
  },
  importRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  importDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  importDot: {
    width: 12, height: 12, borderRadius: 6,
    marginRight: spacing.sm,
  },
  importName: { ...type.bodyBold, color: colors.ink },
  importWhen: { ...type.small, color: colors.inkFaint },

  syncNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  syncDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.sageLight,
    marginRight: 7,
  },
  syncText: {
    ...type.small,
    color: 'rgba(255,255,255,0.46)',
  },
});
