import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, OfflineBadge, Chip } from '../../components/ui';
import { ScreenHeader } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

const LANGUAGES = ['English', 'हिंदी', 'தமிழ்', 'বাংলা', 'Kiswahili'];

/* Screen 2 — Welcome
 * Two large role cards under a warm anime scene. The "WordPress editorial"
 * feel comes from the kicker + serif headline + airy spacing. */
export default function WelcomeScreen({ navigation }) {
  const [lang, setLang] = useState('English');
  const [showLangs, setShowLangs] = useState(false);

  return (
    <ScreenScaffold tint="dawn">
      {/* top bar: brand + language */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.mark}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="9" stroke={colors.white} strokeWidth="2.4" fill="none" />
              <Circle cx="12" cy="12" r="3.2" fill={colors.white} />
            </Svg>
          </View>
          <Text style={styles.brand}>EduLens</Text>
        </View>
        <Pressable style={styles.langChip} onPress={() => setShowLangs((s) => !s)}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="9" stroke={colors.skyDeep} strokeWidth="2" fill="none" />
            <Path d="M3 12 H21 M12 3 Q17 8 12 21 Q7 8 12 3"
                  stroke={colors.skyDeep} strokeWidth="1.6" fill="none" />
          </Svg>
          <Text style={styles.langChipText}>{lang}</Text>
        </Pressable>
      </View>

      {showLangs && (
        <View style={styles.langTray}>
          {LANGUAGES.map((l) => (
            <Chip
              key={l}
              label={l}
              active={l === lang}
              onPress={() => { setLang(l); setShowLangs(false); }}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>
      )}

      {/* hero illustration */}
      <View style={styles.hero}>
        <Illustration name="welcome" height={260} rounded={radius.lg} />
      </View>

      {/* editorial headline */}
      <ScreenHeader title="" kicker="WELCOME TO EDULENS" />
      <Text style={styles.headline}>
        Every page holds a{'\n'}story waiting to be understood
      </Text>
      <Text style={styles.sub}>
        Photograph any textbook page and learn step by step — in your own
        language, with no internet needed.
      </Text>

      {/* role cards */}
      <RoleCard
        title="I am a Student"
        desc="Scan, learn, and grow at your own pace"
        tone={colors.coral}
        wash={colors.paperDeep}
        onPress={() => navigation.navigate('ProfileSelect')}
        glyph={
          <Path d="M6 19 V9 L12 5 L18 9 V19 M9 19 V13 H15 V19"
                stroke={colors.inkSoft} strokeWidth="2.2"
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
        }
      />
      <RoleCard
        title="I am a Teacher"
        desc="See where your class needs you most"
        tone={colors.sky}
        wash={colors.paperDeep}
        onPress={() => navigation.navigate('TeacherLogin')}
        glyph={
          <>
            <Circle cx="12" cy="8" r="3.4" stroke={colors.inkSoft}
                    strokeWidth="2.2" fill="none" />
            <Path d="M5 20 Q5 13 12 13 Q19 13 19 20"
                  stroke={colors.inkSoft} strokeWidth="2.2"
                  fill="none" strokeLinecap="round" />
          </>
        }
      />

      <OfflineBadge style={{ alignSelf: 'center', marginTop: spacing.lg }} />
    </ScreenScaffold>
  );
}

function RoleCard({ title, desc, onPress, tone, wash, glyph }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.role,
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.roleIcon, { backgroundColor: wash }]}>
        <Svg width={28} height={28} viewBox="0 0 24 24">{glyph}</Svg>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDesc}>{desc}</Text>
      </View>
      <View style={[styles.roleArrow, { backgroundColor: tone }]}>
        <Svg width={18} height={18} viewBox="0 0 24 24">
          <Path d="M9 5 L16 12 L9 19" stroke={colors.white} strokeWidth="2.6"
                fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  mark: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.coral,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  brand: { fontFamily: type.heading.fontFamily, fontSize: 22, color: colors.ink },
  langChip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 7, paddingHorizontal: 12,
    borderRadius: radius.pill,
    ...shadow.soft,
  },
  langChipText: {
    ...type.smallBold, color: colors.skyDeep, marginLeft: 6,
  },
  langTray: {
    flexDirection: 'row', flexWrap: 'wrap',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },

  hero: { marginTop: spacing.xs, marginBottom: spacing.lg },

  kickerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  kickerLine: {
    width: 22, height: 2.5, borderRadius: 2,
    backgroundColor: colors.coral, marginRight: 8,
  },
  kicker: { ...type.caption, color: colors.coralDeep },
  headline: {
    fontFamily: type.hero.fontFamily,
    fontSize: 28, lineHeight: 36,
    color: colors.ink,
  },
  sub: {
    ...type.body,
    color: colors.inkSoft,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  role: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.soft,
  },
  roleIcon: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  roleTitle: { ...type.subhead, color: colors.ink },
  roleDesc: { ...type.small, color: colors.inkSoft, marginTop: 2 },
  roleArrow: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
});
