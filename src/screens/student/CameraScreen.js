import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { OfflineBadge } from '../../components/ui';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 7 — Camera Scan
 * A dark "viewfinder" screen — the one moment the app goes dim, like a
 * twilight anime scene. A glowing alignment frame guides the child. */
export default function CameraScreen({ navigation, route }) {
  const profile = route?.params?.params || route?.params?.profile;
  const scan = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scan, {
          toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.root}>
      {/* simulated camera feed — a soft dusk gradient stands in for the
          live camera until the LiteRT camera bridge is wired up */}
      <LinearGradient
        colors={['#2A2638', '#3D3650', '#4A4260']}
        style={StyleSheet.absoluteFill}
      />
      {[15, 38, 62, 80].map((l, i) => (
        <View key={i} style={[styles.dust, { left: `${l}%`, top: `${18 + i * 17}%` }]} />
      ))}

      {/* top bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M6 6 L18 18 M18 6 L6 18" stroke={colors.white}
                  strokeWidth="2.4" strokeLinecap="round" />
          </Svg>
        </Pressable>
        <View style={styles.scanPill}>
          <Text style={styles.scanPillText}>Align the textbook page</Text>
        </View>
        <View style={styles.roundBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path d="M12 6 V3 M12 6 Q17 6 18 11 M12 6 Q7 6 6 11"
                  stroke={colors.gold} strokeWidth="2" fill="none" strokeLinecap="round" />
            <Circle cx="12" cy="14" r="5" stroke={colors.gold} strokeWidth="2" fill="none" />
          </Svg>
        </View>
      </View>

      {/* alignment frame */}
      <View style={styles.frameArea}>
        <View style={styles.frame}>
          {/* corner brackets */}
          {[
            { top: -2, left: -2, rot: '0deg' },
            { top: -2, right: -2, rot: '90deg' },
            { bottom: -2, right: -2, rot: '180deg' },
            { bottom: -2, left: -2, rot: '270deg' },
          ].map((c, i) => (
            <View key={i} style={[styles.corner, c, { transform: [{ rotate: c.rot }] }]}>
              <Svg width={36} height={36} viewBox="0 0 36 36">
                <Path d="M2 14 L2 2 L14 2" stroke={colors.gold} strokeWidth="4"
                      fill="none" strokeLinecap="round" />
              </Svg>
            </View>
          ))}

          {/* moving scan line */}
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [{
                  translateY: scan.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 240],
                  }),
                }],
              },
            ]}
          >
            <LinearGradient
              colors={['transparent', 'rgba(228,179,99,0.9)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: 2 }}
            />
          </Animated.View>

          <View style={styles.frameHintWrap}>
            <Text style={styles.frameHint}>
              Keep the page flat inside the frame
            </Text>
          </View>
        </View>
      </View>

      {/* bottom controls */}
      <View style={styles.bottom}>
        <OfflineBadge style={{ alignSelf: 'center', marginBottom: spacing.md }} />
        <View style={styles.controls}>
          <Pressable
            style={styles.sideBtn}
            onPress={() => navigation.goBack()}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path d="M4 12 Q4 5 12 5 Q17 5 19 9 M19 4 V9 H14"
                    stroke={colors.white} strokeWidth="2.2" fill="none"
                    strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.sideLabel}>Retake</Text>
          </Pressable>

          {/* shutter */}
          <Pressable
            onPress={() => navigation.navigate('AILoading', { profile })}
            style={({ pressed }) => [
              styles.shutter,
              { transform: [{ scale: pressed ? 0.92 : 1 }] },
            ]}
          >
            <View style={styles.shutterRing} />
            <View style={styles.shutterCore} />
          </Pressable>

          <Pressable
            style={styles.sideBtn}
            onPress={() => navigation.navigate('AILoading', { profile })}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24">
              <Path d="M5 12 L10 17 L19 7" stroke={colors.white} strokeWidth="2.6"
                    fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={styles.sideLabel}>Process</Text>
          </Pressable>
        </View>
        <Text style={styles.tip}>
          Tip: good light makes the explanation clearer
        </Text>
      </View>
    </View>
  );
}

const FRAME = 260;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A2638' },
  dust: {
    position: 'absolute',
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  roundBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  scanPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: radius.pill,
  },
  scanPillText: { ...type.smallBold, color: colors.white },

  frameArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: FRAME, height: FRAME,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  corner: { position: 'absolute' },
  scanLine: {
    position: 'absolute',
    left: 14, right: 14,
    height: 4,
  },
  frameHintWrap: {
    position: 'absolute',
    bottom: 14, left: 0, right: 0,
    alignItems: 'center',
  },
  frameHint: {
    ...type.small,
    color: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: radius.pill,
  },

  bottom: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  sideBtn: { alignItems: 'center', width: 70 },
  sideLabel: { ...type.caption, color: colors.white, marginTop: 6 },
  shutter: {
    width: 84, height: 84, borderRadius: 42,
    alignItems: 'center', justifyContent: 'center',
  },
  shutterRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  shutterCore: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.coral,
    ...shadow.lift,
  },
  tip: {
    ...type.small,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
