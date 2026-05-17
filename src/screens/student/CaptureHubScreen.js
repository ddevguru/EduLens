import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ScreenScaffold, OfflineBadge, Card } from '../../components/ui';
import { Avatar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 6 — Capture Hub (student home)
 * The heart of the student app. One huge friendly action: scan a page.
 * Recent lessons sit below as small storybook entries. */
export default function CaptureHubScreen({ navigation, route }) {
  const profile = route?.params?.profile || { name: 'Sravanth', avatar: 'fox', grade: 7 };
  const [lang, setLang] = useState('English');

  const recents = [
    { subject: 'Science', topic: 'Photosynthesis', tone: colors.sage },
    { subject: 'Maths', topic: 'Fractions', tone: colors.sky },
  ];

  return (
    <ScreenScaffold tint="morning">
      {/* greeting row */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.hello}>Good morning,</Text>
          <Text style={styles.name}>{profile.name}</Text>
        </View>
        <Pressable onPress={() => navigation.navigate('ProfileSelect')}>
          <Avatar name={profile.avatar} size={52} />
        </Pressable>
      </View>

      {/* offline + language strip */}
      <View style={styles.strip}>
        <OfflineBadge />
        <Pressable
          style={styles.langToggle}
          onPress={() =>
            setLang((l) => (l === 'English' ? 'हिंदी' : l === 'हिंदी' ? 'தமிழ்' : 'English'))
          }
        >
          <Svg width={15} height={15} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="9" stroke={colors.skyDeep} strokeWidth="2" fill="none" />
            <Path d="M3 12 H21" stroke={colors.skyDeep} strokeWidth="1.6" />
          </Svg>
          <Text style={styles.langText}>{lang}</Text>
        </Pressable>
      </View>

      {/* the big scan card */}
      <Pressable
        onPress={() => navigation.navigate('Camera', { profile })}
        style={({ pressed }) => [
          styles.scanCard,
          { transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        <Illustration name="captureHub" height={196} rounded={radius.lg} overlay />
        <View style={styles.scanOverlay}>
          <View style={styles.scanIcon}>
            <Svg width={32} height={32} viewBox="0 0 24 24">
              <Path d="M4 8 V6 Q4 4 6 4 H8 M16 4 H18 Q20 4 20 6 V8 M20 16 V18 Q20 20 18 20 H16 M8 20 H6 Q4 20 4 18 V16"
                    stroke={colors.white} strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <Circle cx="12" cy="12" r="3.6" stroke={colors.white} strokeWidth="2.2" fill="none" />
            </Svg>
          </View>
          <Text style={styles.scanTitle}>Tap to Scan Textbook</Text>
          <Text style={styles.scanSub}>Point your camera at any page</Text>
        </View>
      </Pressable>

      {/* quick paths */}
      <View style={styles.quickRow}>
        <QuickTile
          label="Type a Question"
          tone={colors.paperDeep}
          onPress={() => navigation.navigate('Camera', { profile, mode: 'text' })}
          glyph={
            <Path d="M5 5 H19 M5 12 H19 M5 19 H13"
                  stroke={colors.inkSoft} strokeWidth="2.4" strokeLinecap="round" />
          }
        />
        <QuickTile
          label="Practice Quiz"
          tone={colors.paperDeep}
          onPress={() => navigation.navigate('Quiz', { profile })}
          glyph={
            <>
              <Circle cx="12" cy="12" r="8" stroke={colors.inkSoft}
                      strokeWidth="2.4" fill="none" />
              <Path d="M9 10 Q9 7.5 12 7.5 Q15 7.5 15 10 Q15 12 12 13 V15"
                    stroke={colors.inkSoft} strokeWidth="2.2" fill="none"
                    strokeLinecap="round" />
              <Circle cx="12" cy="17.5" r="1.2" fill={colors.inkSoft} />
            </>
          }
        />
      </View>

      {/* recent lessons — editorial list */}
      <View style={styles.recentHead}>
        <Text style={styles.recentTitle}>Continue Learning</Text>
        <Text style={styles.recentCount}>{recents.length} saved</Text>
      </View>

      {recents.map((r, i) => (
        <Card
          key={i}
          soft
          onPress={() => navigation.navigate('Lesson', { profile, topic: r.topic })}
          style={styles.recentCard}
        >
          <View style={[styles.recentDot, { backgroundColor: r.tone }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.recentSubject}>{r.subject}</Text>
            <Text style={styles.recentTopic}>{r.topic}</Text>
          </View>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Path d="M9 5 L16 12 L9 19" stroke={colors.inkFaint} strokeWidth="2.4"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Card>
      ))}
    </ScreenScaffold>
  );
}

function QuickTile({ label, glyph, tone, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickTile,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={[styles.quickIcon, { backgroundColor: tone }]}>
        <Svg width={24} height={24} viewBox="0 0 24 24">{glyph}</Svg>
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  hello: { ...type.body, color: colors.inkSoft },
  name: { ...type.title, color: colors.ink },

  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  langToggle: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: radius.pill,
    ...shadow.soft,
  },
  langText: { ...type.smallBold, color: colors.skyDeep, marginLeft: 6 },

  scanCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadow.card,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
  },
  scanIcon: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: 'rgba(232,131,107,0.92)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
    ...shadow.lift,
  },
  scanTitle: {
    fontFamily: type.heading.fontFamily,
    fontSize: 22,
    color: colors.white,
  },
  scanSub: { ...type.small, color: 'rgba(255,255,255,0.9)' },

  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  quickTile: {
    width: '48.5%',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
  },
  quickIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  quickLabel: { ...type.smallBold, color: colors.ink, flex: 1 },

  recentHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  recentTitle: { ...type.heading, color: colors.ink },
  recentCount: { ...type.small, color: colors.inkFaint },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    padding: spacing.md,
  },
  recentDot: {
    width: 10, height: 10, borderRadius: 5,
    marginRight: spacing.sm,
  },
  recentSubject: { ...type.caption, color: colors.inkFaint },
  recentTopic: { ...type.bodyBold, color: colors.ink },
});
