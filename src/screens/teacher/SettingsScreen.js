import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { ScreenScaffold, Card, Badge, Chip } from '../../components/ui';
import { ScreenHeader } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 21 — Settings
 * The quiet control room. Language, the on-device Gemma model's health,
 * offline status, storage, and the app's version card. Everything here
 * is local — there is nothing to sign into and nothing to sync. */
export default function SettingsScreen({ navigation }) {
  const [lang, setLang] = useState('English');
  const [voice, setVoice] = useState(true);
  const [largeText, setLargeText] = useState(false);

  const languages = ['English', 'हिंदी', 'தமிழ்', 'বাংলা', 'Kiswahili'];

  return (
    <ScreenScaffold tint="night" dark>
      <ScreenHeader
        title="Settings"
        kicker="DEVICE & APP"
        dark
        onBack={() => navigation.goBack()}
      />

      <Illustration
        name="settings"
        height={150}
        rounded={radius.lg}
        overlay
        style={{ ...shadow.lift, marginBottom: spacing.md }}
      />

      {/* model status */}
      <Text style={styles.groupLabel}>AI Model</Text>
      <Card style={styles.card}>
        <View style={styles.modelTop}>
          <View style={styles.modelIcon}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="3" fill={colors.sky} />
              <Circle cx="12" cy="12" r="8" stroke={colors.sky}
                       strokeWidth="1.8" fill="none" />
              <Path d="M12 4 V1.5 M12 22.5 V20 M20 12 H22.5 M1.5 12 H4"
                    stroke={colors.sky} strokeWidth="1.8" strokeLinecap="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modelName}>Gemma 4 · E4B</Text>
            <Text style={styles.modelMeta}>~1.3 GB · 4-bit quantized · LiteRT</Text>
          </View>
          <View style={styles.statusPill}>
            <Svg width={14} height={14} viewBox="0 0 24 24">
              <Path d="M5 12 L10 17 L19 7" stroke={colors.sageDeep} strokeWidth="2.8"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={[styles.statusText, { marginLeft: 4 }]}>Ready · Offline</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <Row label="Model size" value="~1.3 GB" />
        <Row label="Fine-tuned on" value="NCERT 6–10" />
        <Row label="Last used" value="Today, 2:14 PM" />
        <Row label="Inference" value="On-device only" last />
      </Card>

      {/* offline status */}
      <Text style={styles.groupLabel}>Connectivity</Text>
      <Card style={styles.card}>
        <View style={styles.offlineRow}>
          <View style={styles.offlineIcon}>
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path d="M5 12.5 Q12 6 19 12.5 M8 15.5 Q12 12 16 15.5"
                    stroke={colors.sageDeep} strokeWidth="2.2" fill="none"
                    strokeLinecap="round" />
              <Circle cx="12" cy="18.5" r="1.6" fill={colors.sageDeep} />
              <Path d="M4 4 L20 20" stroke={colors.sageDeep} strokeWidth="2.2"
                    strokeLinecap="round" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.offlineTitle}>Works fully offline</Text>
            <Text style={styles.offlineSub}>
              No internet is used for lessons, quizzes, or sync.
            </Text>
          </View>
          <Badge label="✓ OFFLINE" tone="sage" />
        </View>
      </Card>

      {/* language */}
      <Text style={styles.groupLabel}>Language</Text>
      <Card style={styles.card}>
        <Text style={styles.cardHint}>
          Used for explanations, quizzes, and voice.
        </Text>
        <View style={styles.chipWrap}>
          {languages.map((l) => (
            <Chip
              key={l}
              label={l}
              active={lang === l}
              onPress={() => setLang(l)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>
      </Card>

      {/* accessibility toggles */}
      <Text style={styles.groupLabel}>Accessibility</Text>
      <Card style={styles.card}>
        <ToggleRow
          title="Voice narration"
          sub="Read explanations aloud"
          value={voice}
          onChange={setVoice}
        />
        <View style={styles.cardDivider} />
        <ToggleRow
          title="Larger text"
          sub="Increase font size across the app"
          value={largeText}
          onChange={setLargeText}
          last
        />
      </Card>

      {/* storage */}
      <Text style={styles.groupLabel}>Storage</Text>
      <Card style={styles.card}>
        <View style={styles.storageBar}>
          <View style={[styles.storageSeg, { flex: 38, backgroundColor: colors.sky }]} />
          <View style={[styles.storageSeg, { flex: 14, backgroundColor: colors.coral }]} />
          <View style={[styles.storageSeg, { flex: 48, backgroundColor: colors.line }]} />
        </View>
        <View style={styles.storageLegend}>
          <LegendDot color={colors.sky} label="Model 1.4 GB" />
          <LegendDot color={colors.coral} label="Sessions 0.5 GB" />
          <LegendDot color={colors.line} label="Free 1.8 GB" />
        </View>
      </Card>

      {/* app version */}
      <View style={styles.versionCard}>
        <View style={styles.versionMark}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            <Path d="M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z"
                  stroke={colors.gold} strokeWidth="2" fill="none"
                  strokeLinejoin="round" />
            <Path d="M9 11 L11.5 13.5 L16 9" stroke={colors.gold}
                  strokeWidth="2" fill="none" strokeLinecap="round"
                  strokeLinejoin="round" />
          </Svg>
        </View>
        <Text style={styles.versionName}>EduLens</Text>
        <Text style={styles.versionNo}>Version 1.0.0 · Build 2026.05</Text>
        <Text style={styles.versionTag}>
          Offline learning companion · Built for the Gemma Hackathon
        </Text>
      </View>

      <Text style={styles.footerNote}>
        All data stays on this device. EduLens never connects to a server.
      </Text>
    </ScreenScaffold>
  );
}

function Row({ label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowDivider]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function ToggleRow({ title, sub, value, onChange, last }) {
  return (
    <View style={[styles.toggleRow, !last && styles.toggleDivider]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.line, true: colors.sageLight }}
        thumbColor={value ? colors.sageDeep : colors.card}
        ios_backgroundColor={colors.line}
      />
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    ...type.smallBold,
    color: 'rgba(255,255,255,0.82)',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  cardHint: {
    ...type.small,
    color: colors.inkFaint,
    marginBottom: spacing.sm,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.lineSoft,
    marginVertical: spacing.sm,
  },

  modelTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modelIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.skyWash,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  modelName: { ...type.subhead, color: colors.ink },
  modelMeta: { ...type.small, color: colors.inkFaint },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sageWash,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.sageDeep,
    marginRight: 5,
  },
  statusText: {
    ...type.caption,
    color: colors.sageDeep,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
  },
  infoLabel: { ...type.body, color: colors.inkSoft },
  infoValue: { ...type.bodyBold, color: colors.ink },

  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: colors.sageWash,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  offlineTitle: { ...type.bodyBold, color: colors.ink },
  offlineSub: { ...type.small, color: colors.inkFaint },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  toggleDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xs,
  },
  toggleTitle: { ...type.bodyBold, color: colors.ink },
  toggleSub: { ...type.small, color: colors.inkFaint },

  storageBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  storageSeg: { height: '100%' },
  storageLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginTop: 4,
  },
  legendDot: {
    width: 9, height: 9, borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    ...type.small,
    color: colors.inkSoft,
  },

  versionCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  versionMark: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(228,179,99,0.16)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  versionName: {
    ...type.title,
    color: colors.white,
  },
  versionNo: {
    ...type.small,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  versionTag: {
    ...type.small,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  footerNote: {
    ...type.small,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
});
