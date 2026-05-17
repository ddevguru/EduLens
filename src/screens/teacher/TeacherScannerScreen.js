import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Badge } from '../../components/ui';
import { ScreenHeader } from '../../components/widgets';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 19 — Teacher QR Scanner
 * The teacher's camera trained on a student's screen. A dark viewfinder
 * with a bracketed frame and a sweeping scan line. On a real build this
 * wraps expo-camera with a QR barcode scanner. */
export default function TeacherScannerScreen({ navigation }) {
  const scan = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1, duration: 2000,
          easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
        Animated.timing(scan, {
          toValue: 0, duration: 2000,
          easing: Easing.inOut(Easing.quad), useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const FRAME = 248;
  const lineY = scan.interpolate({
    inputRange: [0, 1], outputRange: [10, FRAME - 10],
  });
  const cornerOpacity = pulse.interpolate({
    inputRange: [0, 1], outputRange: [0.45, 1],
  });

  // simulate a detection — wire to expo-camera onBarCodeScanned in production
  const simulateScan = (result) =>
    navigation.navigate('QRImport', { result });

  return (
    <ScreenScaffold tint="night" dark scroll={false} padded={false}>
      <View style={styles.viewfinder}>
        {/* faux camera backdrop */}
        <View style={styles.cameraBg}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.bgGlow,
                {
                  top: `${12 + i * 15}%`,
                  left: `${(i % 2) * 55 + 8}%`,
                  opacity: 0.06 + (i % 3) * 0.03,
                },
              ]}
            />
          ))}
        </View>

        {/* header over camera */}
        <View style={styles.headerWrap}>
          <ScreenHeader
            title="Scan Student QR"
            kicker="IMPORT PROGRESS"
            dark
            onBack={() => navigation.goBack()}
          />
        </View>

        {/* scan frame */}
        <View style={styles.frameZone}>
          <View style={[styles.frame, { width: FRAME, height: FRAME }]}>
            {/* corner brackets */}
            {[
              { top: 0, left: 0, r: '0' },
              { top: 0, right: 0, r: '90' },
              { bottom: 0, right: 0, r: '180' },
              { bottom: 0, left: 0, r: '270' },
            ].map((pos, i) => (
              <Animated.View
                key={i}
                style={[styles.corner, pos, { opacity: cornerOpacity }]}
              >
                <Svg width={36} height={36} viewBox="0 0 36 36">
                  <Path
                    d="M2 14 V2 H14"
                    stroke={colors.gold}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    transform={`rotate(${pos.r} 18 18)`}
                  />
                </Svg>
              </Animated.View>
            ))}

            {/* sweeping scan line */}
            <Animated.View
              style={[styles.scanLine, { transform: [{ translateY: lineY }] }]}
            />

            {/* center QR hint glyph */}
            <View style={styles.qrHint}>
              <Svg width={64} height={64} viewBox="0 0 24 24">
                <Rect x="3" y="3" width="7" height="7" rx="1.5"
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1.6" fill="none" />
                <Rect x="14" y="3" width="7" height="7" rx="1.5"
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1.6" fill="none" />
                <Rect x="3" y="14" width="7" height="7" rx="1.5"
                      stroke="rgba(255,255,255,0.25)" strokeWidth="1.6" fill="none" />
                <Rect x="14.5" y="14.5" width="2.6" height="2.6"
                      fill="rgba(255,255,255,0.25)" />
                <Rect x="18.4" y="18.4" width="2.6" height="2.6"
                      fill="rgba(255,255,255,0.25)" />
                <Rect x="14.5" y="18.4" width="2.6" height="2.6"
                      fill="rgba(255,255,255,0.25)" />
                <Rect x="18.4" y="14.5" width="2.6" height="2.6"
                      fill="rgba(255,255,255,0.25)" />
              </Svg>
            </View>
          </View>

          <Text style={styles.instruction}>
            Hold the student's QR code inside the frame
          </Text>
          <Badge
            label="OFFLINE IMPORT · NO INTERNET"
            tone="ink"
            style={{ marginTop: spacing.sm }}
          />
        </View>

        {/* bottom panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Ready to scan</Text>
          <Text style={styles.panelSub}>
            The student opens "Share with Teacher" on their device.
            Their progress imports the moment the code is read.
          </Text>

          {/* demo triggers — replace with real onBarCodeScanned */}
          <PrimaryButton
            label="Simulate Successful Scan"
            variant="gold"
            onPress={() => simulateScan('success')}
            style={{ marginTop: spacing.sm }}
          />
          <View style={styles.demoRow}>
            <Pressable
              onPress={() => simulateScan('duplicate')}
              style={({ pressed }) => [styles.demoBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={styles.demoText}>Duplicate</Text>
            </Pressable>
            <Pressable
              onPress={() => simulateScan('invalid')}
              style={({ pressed }) => [styles.demoBtn, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={styles.demoText}>Invalid code</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  viewfinder: {
    flex: 1,
    backgroundColor: '#211D31',
  },
  cameraBg: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGlow: {
    position: 'absolute',
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: colors.skyLight,
  },
  headerWrap: {
    paddingHorizontal: spacing.lg,
  },

  frameZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  corner: {
    position: 'absolute',
  },
  scanLine: {
    position: 'absolute',
    left: 12, right: 12,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  qrHint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    ...type.bodyBold,
    color: 'rgba(255,255,255,0.85)',
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  panel: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  panelTitle: {
    ...type.heading,
    color: colors.ink,
  },
  panelSub: {
    ...type.small,
    color: colors.inkSoft,
    marginTop: 4,
  },
  demoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  demoBtn: {
    width: '48.5%',
    height: 46,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoText: {
    ...type.smallBold,
    color: colors.inkSoft,
  },
});
