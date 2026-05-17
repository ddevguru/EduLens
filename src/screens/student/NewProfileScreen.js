import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Chip, Divider } from '../../components/ui';
import { ScreenHeader, Avatar } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';
import { avatarKeys } from '../../theme/illustrations';

const GRADES = [6, 7, 8, 9, 10];
const LANGS = ['English', 'हिंदी', 'தமிழ்', 'বাংলা', 'Kiswahili'];

/* Screen 4 — New Profile
 * A calm, single-scroll form. Each field is its own soft card so it never
 * feels like a dense data entry screen — more like filling a storybook page. */
export default function NewProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(avatarKeys[0]);
  const [grade, setGrade] = useState(7);
  const [lang, setLang] = useState('English');

  const ready = name.trim().length >= 2;

  return (
    <ScreenScaffold
      tint="meadow"
      footer={
        <PrimaryButton
          label="Set Your Secret PIN"
          variant="sage"
          disabled={!ready}
          onPress={() => navigation.navigate('PinUnlock', {
            profile: { name: name.trim(), avatar, grade, lang },
            setup: true,
          })}
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path d="M9 5 L16 12 L9 19" stroke={colors.white} strokeWidth="2.6"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          }
        />
      }
    >
      <ScreenHeader
        title="Create a New Learner"
        kicker="A NEW JOURNEY BEGINS"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.banner}>
        <Illustration name="newProfile" height={150} rounded={radius.lg} />
      </View>

      {/* live avatar preview */}
      <View style={styles.preview}>
        <Avatar name={avatar} size={96} />
        <Text style={styles.previewName}>
          {name.trim() || 'Your name here'}
        </Text>
      </View>

      {/* name */}
      <FieldCard label="What is your name?">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Type your first name"
          placeholderTextColor={colors.inkFaint}
          style={styles.input}
          maxLength={20}
        />
      </FieldCard>

      {/* avatar picker */}
      <FieldCard label="Pick a friend to be your avatar">
        <View style={styles.avatarRow}>
          {avatarKeys.map((k) => (
            <Pressable
              key={k}
              onPress={() => setAvatar(k)}
              style={[
                styles.avatarPick,
                avatar === k && styles.avatarPickActive,
              ]}
            >
              <Avatar name={k} size={52} ring={false} />
            </Pressable>
          ))}
        </View>
      </FieldCard>

      {/* grade */}
      <FieldCard label="Which grade are you in?">
        <View style={styles.chipWrap}>
          {GRADES.map((g) => (
            <Chip
              key={g}
              label={`Grade ${g}`}
              active={grade === g}
              onPress={() => setGrade(g)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>
      </FieldCard>

      {/* language */}
      <FieldCard label="Choose your learning language">
        <View style={styles.chipWrap}>
          {LANGS.map((l) => (
            <Chip
              key={l}
              label={l}
              active={lang === l}
              onPress={() => setLang(l)}
              style={{ marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </View>
      </FieldCard>

      <Text style={styles.note}>
        Your profile is saved only on this device. Nothing is sent anywhere.
      </Text>
    </ScreenScaffold>
  );
}

function FieldCard({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { marginTop: spacing.xs, marginBottom: spacing.md },
  preview: { alignItems: 'center', marginBottom: spacing.lg },
  previewName: {
    ...type.heading,
    color: colors.ink,
    marginTop: spacing.sm,
  },

  field: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.soft,
  },
  fieldLabel: {
    ...type.smallBold,
    color: colors.inkSoft,
    marginBottom: spacing.sm,
  },
  input: {
    ...type.body,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap' },
  avatarPick: {
    padding: 4,
    borderRadius: radius.md,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarPickActive: {
    borderColor: colors.sage,
    backgroundColor: colors.sageWash,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  note: {
    ...type.small,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
});
