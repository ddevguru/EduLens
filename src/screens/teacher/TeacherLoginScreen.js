import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Badge } from '../../components/ui';
import { ScreenHeader, PinPad } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 15 — Teacher PIN Login
 * The quiet evening gateway into the admin world. A fixed master PIN
 * (set during deployment) unlocks the class dashboard. No network, no
 * accounts — just a key to a calm, lamp-lit study. */
const MASTER_PIN = '2468'; // set during school deployment

export default function TeacherLoginScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1, duration: 3200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0, duration: 3200,
          easing: Easing.inOut(Easing.sin), useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === MASTER_PIN) {
        navigation.replace('TeacherDashboard');
      } else {
        setError(true);
        Animated.sequence([
          Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start(() => setTimeout(() => { setPin(''); setError(false); }, 450));
      }
    } else {
      setError(false);
    }
  }, [pin]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1], outputRange: [-9, 9],
  });
  const translateY = float.interpolate({
    inputRange: [0, 1], outputRange: [0, -10],
  });

  return (
    <ScreenScaffold tint="night" dark scroll={false}>
      <ScreenHeader
        title="Teacher Access"
        kicker="ADMIN AREA"
        dark
        onBack={() => navigation.goBack()}
      />

      <View style={styles.center}>
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Illustration
            name="teacherLogin"
            height={260}
            rounded={radius.lg}
            style={styles.art}
          />
        </Animated.View>

        <Text style={styles.title}>Welcome back, teacher</Text>
        <Text style={styles.sub}>
          Enter the master PIN set when this device was{'\n'}prepared for your school.
        </Text>

        <Animated.View style={[styles.pinWrap, { transform: [{ translateX }] }]}>
          <PinPad value={pin} onChange={setPin} tone={colors.gold} />
        </Animated.View>

        <View style={styles.statusRow}>
          {error ? (
            <View style={styles.errorPill}>
              <Svg width={16} height={16} viewBox="0 0 24 24">
                <Circle cx="12" cy="12" r="9" stroke={colors.coralLight}
                         strokeWidth="2" fill="none" />
                <Path d="M12 7 V13 M12 16.5 V16.6" stroke={colors.coralLight}
                      strokeWidth="2.4" strokeLinecap="round" />
              </Svg>
              <Text style={styles.errorText}>Incorrect PIN — try again</Text>
            </View>
          ) : (
            <Badge label="OFFLINE · NO ACCOUNT NEEDED" tone="ink" />
          )}
        </View>
      </View>

      <View style={styles.footnote}>
        <Text style={styles.footnoteText}>
          Forgot the PIN? It can be reset from the deployment{'\n'}
          configuration file on the device.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  art: {
    ...shadow.lift,
    marginBottom: spacing.lg,
    width: 260,
  },
  title: {
    ...type.title,
    color: colors.white,
    textAlign: 'center',
  },
  sub: {
    ...type.small,
    color: 'rgba(255,255,255,0.66)',
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  pinWrap: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  statusRow: {
    marginTop: spacing.lg,
    minHeight: 34,
    justifyContent: 'center',
  },
  errorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201,88,107,0.22)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  errorText: {
    ...type.caption,
    color: colors.coralLight,
    marginLeft: 6,
  },
  footnote: {},
  footnoteText: {
    ...type.small,
    color: 'rgba(255,255,255,0.42)',
    textAlign: 'center',
    paddingBottom: spacing.md,
  },
  footote: {
    paddingBottom: spacing.md,
  },
});
