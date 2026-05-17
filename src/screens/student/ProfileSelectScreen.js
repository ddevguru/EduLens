import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenScaffold, Badge } from '../../components/ui';
import { ScreenHeader, Avatar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Sample local profiles — in the real app these come from the on-device DB. */
const PROFILES = [
  { id: '1', name: 'Sravanth', avatar: 'fox',    grade: 7 },
  { id: '2', name: 'Rahul',    avatar: 'owl',    grade: 8 },
  { id: '3', name: 'Meera',    avatar: 'deer',   grade: 6 },
  { id: '4', name: 'Aisha',    avatar: 'rabbit', grade: 9 },
];

/* Screen 3 — Profile Selection
 * Avatar cards for the children who share this device. The header art is a
 * sunlit window — the "who is learning today?" moment. */
export default function ProfileSelectScreen({ navigation }) {
  return (
    <ScreenScaffold tint="morning">
      <ScreenHeader
        title="Who is learning today?"
        kicker="CHOOSE YOUR PROFILE"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.banner}>
        <Illustration name="profilePick" height={150} />
      </View>

      <Text style={styles.lead}>
        Tap your card to continue your journey. Each profile keeps its own
        progress, safely on this device.
      </Text>

      <View style={styles.grid}>
        {PROFILES.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => navigation.navigate('PinUnlock', { profile: p })}
            style={({ pressed }) => [
              styles.profileCard,
              { transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
          >
            <Avatar name={p.avatar} size={84} />
            <Text style={styles.profileName}>{p.name}</Text>
            <Badge label={`GRADE ${p.grade}`} tone="sky" style={{ marginTop: 6 }} />
          </Pressable>
        ))}

        {/* add new profile card */}
        <Pressable
          onPress={() => navigation.navigate('NewProfile')}
          style={({ pressed }) => [
            styles.addCard,
            { transform: [{ scale: pressed ? 0.97 : 1 }] },
          ]}
        >
          <View style={styles.addCircle}>
            <Svg width={30} height={30} viewBox="0 0 24 24">
              <Path d="M12 5 V19 M5 12 H19" stroke={colors.coralDeep}
                    strokeWidth="2.8" strokeLinecap="round" />
            </Svg>
          </View>
          <Text style={styles.addText}>New Learner</Text>
          <Text style={styles.addSub}>Create a profile</Text>
        </Pressable>
      </View>
    </ScreenScaffold>
  );
}

const CARD_GAP = spacing.sm;

const styles = StyleSheet.create({
  banner: { marginTop: spacing.xs, marginBottom: spacing.md },
  lead: {
    ...type.body,
    color: colors.inkSoft,
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileCard: {
    width: `${(100 - 4) / 2}%`,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: CARD_GAP,
    ...shadow.soft,
  },
  profileName: {
    ...type.subhead,
    color: colors.ink,
    marginTop: spacing.sm,
  },
  addCard: {
    width: `${(100 - 4) / 2}%`,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: CARD_GAP,
    borderWidth: 2,
    borderColor: colors.coralLight,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  addCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.coralWash,
    alignItems: 'center', justifyContent: 'center',
  },
  addText: { ...type.subhead, color: colors.coralDeep, marginTop: spacing.sm },
  addSub: { ...type.small, color: colors.inkFaint, marginTop: 2 },
});
