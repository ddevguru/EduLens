import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ScreenScaffold } from '../../components/ui';
import { ScreenHeader, Avatar, PinPad } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius } from '../../theme/tokens';

/* Screen 5 — PIN Unlock
 * Doubles as both "unlock existing profile" and "set PIN for new profile"
 * via the route param `setup`. Soft cottage-door art = coming home. */
export default function PinUnlockScreen({ navigation, route }) {
  const profile = route?.params?.profile || { name: 'Sravanth', avatar: 'fox' };
  const isSetup = route?.params?.setup;

  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [stage, setStage] = useState(isSetup ? 'create' : 'enter');
  const shake = useState(new Animated.Value(0))[0];

  const doShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    if (stage === 'create' && pin.length === 4) {
      setTimeout(() => setStage('confirm'), 200);
    }
    if (stage === 'confirm' && confirm.length === 4) {
      if (confirm === pin) {
        setTimeout(() => navigation.replace('CaptureHub', { profile }), 250);
      } else {
        doShake();
        setTimeout(() => setConfirm(''), 400);
      }
    }
    if (stage === 'enter' && pin.length === 4) {
      // demo: any 4-digit pin unlocks
      setTimeout(() => navigation.replace('CaptureHub', { profile }), 250);
    }
  }, [pin, confirm, stage]);

  const copy = {
    enter:   { title: 'Welcome back', sub: `Tap your secret 4-digit PIN, ${profile.name}` },
    create:  { title: 'Create your PIN', sub: 'Pick 4 numbers only you will remember' },
    confirm: { title: 'Tap it once more', sub: 'Enter the same 4 numbers to confirm' },
  }[stage];

  return (
    <ScreenScaffold tint="dawn" scroll={false}>
      <ScreenHeader
        title={isSetup ? 'Set Your PIN' : 'Unlock Profile'}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.body}>
        <View style={styles.art}>
          <Illustration name="pinUnlock" height={150} rounded={radius.lg} />
        </View>

        <Avatar name={profile.avatar} size={80} />
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.sub}>{copy.sub}</Text>

        <Animated.View style={{ transform: [{ translateX: shake }], width: '100%' }}>
          <PinPad
            value={stage === 'confirm' ? confirm : pin}
            onChange={stage === 'confirm' ? setConfirm : setPin}
            tone={isSetup ? colors.sage : colors.sky}
          />
        </Animated.View>

        <Text style={styles.hint}>
          A PIN keeps profiles from being opened by accident.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  art: { width: '70%', marginBottom: spacing.lg },
  title: {
    ...type.title,
    color: colors.ink,
    marginTop: spacing.md,
  },
  sub: {
    ...type.body,
    color: colors.inkSoft,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  hint: {
    ...type.small,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
