import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrimaryButton, OfflineBadge, ProgressDots } from '../../components/ui';
import Illustration from '../../components/Illustration';
import { colors, gradients, type, spacing, radius } from '../../theme/tokens';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    art: 'onboard1',
    tint: 'dawn',
    kicker: 'LEARN ANYWHERE',
    headline: 'Turn any textbook page into a lesson',
    body:
      'Photograph a page from any book. EduLens explains it, step by step — no internet needed.',
  },
  {
    art: 'onboard2',
    tint: 'morning',
    kicker: 'IN YOUR LANGUAGE',
    headline: 'Learning that speaks your language',
    body:
      'Explanations and quizzes in Hindi, Tamil, Bengali, Kiswahili and English — read aloud, so every learner can follow.',
  },
  {
    art: 'onboard3',
    tint: 'study',
    kicker: 'EVERYONE GROWS',
    headline: 'Your teacher sees how to help you',
    body:
      'A simple QR code shares your week with your teacher. No accounts, no cloud — your progress stays yours.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  /* Per-slide entrance animation: the active slide's content fades + rises
     when its index becomes active, mirroring Splash's pattern. */
  const fades = useRef(SLIDES.map(() => new Animated.Value(0))).current;
  const rises = useRef(SLIDES.map(() => new Animated.Value(16))).current;
  const textFades = useRef(SLIDES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animateSlideIn(0);
  }, []);

  const animateSlideIn = (i) => {
    Animated.parallel([
      Animated.timing(fades[i], { toValue: 1, duration: 360, useNativeDriver: true }),
      Animated.timing(rises[i], { toValue: 0, duration: 360, useNativeDriver: true }),
    ]).start();
    Animated.timing(textFades[i], {
      toValue: 1, duration: 320, delay: 120, useNativeDriver: true,
    }).start();
  };

  const onMomentumEnd = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (i !== index) {
      setIndex(i);
      animateSlideIn(i);
    }
  };

  const finish = async () => {
    try {
      await AsyncStorage.setItem('edulens_onboarded', 'true');
    } catch (_) {
      /* swallow — non-critical for the demo */
    }
    navigation.replace('Welcome');
  };

  const goNext = () => {
    if (index < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * SCREEN_W, animated: true });
    } else {
      finish();
    }
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      {/* Cross-fading gradient sky tied to scroll position */}
      {SLIDES.map((s, i) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (i - 1) * SCREEN_W,
            i * SCREEN_W,
            (i + 1) * SCREEN_W,
          ],
          outputRange: [0, 1, 0],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={s.art}
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity }]}
          >
            <LinearGradient
              colors={gradients[s.tint]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        );
      })}

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* Skip — hidden on the last slide */}
        <View style={styles.topBar}>
          {!isLast ? (
            <Pressable onPress={finish} hitSlop={12}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View />
          )}
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumEnd}
          style={styles.scroller}
        >
          {SLIDES.map((s, i) => (
            <View key={s.art} style={styles.slide}>
              <Animated.View
                style={{
                  opacity: fades[i],
                  transform: [{ translateY: rises[i] }],
                  width: '100%',
                }}
              >
                <Illustration name={s.art} height={260} rounded={radius.lg} />
              </Animated.View>

              <Animated.View style={{ opacity: textFades[i], alignItems: 'center' }}>
                <Text style={styles.kicker}>{s.kicker}</Text>
                <Text style={styles.headline} numberOfLines={2}>
                  {s.headline}
                </Text>
                <Text style={styles.body} numberOfLines={3}>
                  {s.body}
                </Text>
              </Animated.View>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.footer}>
          <View style={styles.dotsWrap}>
            <ProgressDots total={SLIDES.length} index={index} tone={colors.coral} />
          </View>
          <OfflineBadge style={styles.offline} />
          <PrimaryButton
            label={isLast ? 'Get Started' : 'Next'}
            variant="coral"
            onPress={goNext}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  safe: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    minHeight: 36,
  },
  skip: {
    ...type.smallBold,
    color: colors.inkFaint,
  },

  scroller: { flex: 1 },
  slide: {
    width: SCREEN_W,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
  },
  kicker: {
    ...type.caption,
    color: colors.coralDeep,
    textTransform: 'uppercase',
    marginTop: spacing.xl,
  },
  headline: {
    fontFamily: type.hero.fontFamily,
    fontSize: 28,
    lineHeight: 36,
    color: colors.ink,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  body: {
    ...type.body,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  dotsWrap: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  offline: {
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
});
