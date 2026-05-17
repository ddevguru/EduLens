import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, Badge } from '../../components/ui';
import { ScreenHeader, SpeakerButton } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screen 9 — Lesson Studio (Explanation page)
 * The structured output: an analogy card up top, then max 3 bullets with
 * bold English scaffolding keywords. A floating speaker reads it aloud. */
const LESSON = {
  subject: 'Science · Class 7',
  topic: 'Photosynthesis',
  analogy:
    'Think of a leaf like a tiny kitchen. Sunlight is the stove, and the ' +
    'plant cooks its own food using light, water, and air.',
  bullets: [
    {
      key: 'Sunlight',
      text: 'The plant catches sunlight using a green colour called [chlorophyll] inside its leaves.',
    },
    {
      key: 'Water + Air',
      text: 'Roots drink [water] from the soil, and leaves breathe in [carbon dioxide] from the air.',
    },
    {
      key: 'Food + Oxygen',
      text: 'These mix together to make [glucose] (the plant\u2019s food) and release [oxygen] for us to breathe.',
    },
  ],
};

export default function LessonScreen({ navigation, route }) {
  const profile = route?.params?.profile;
  const [playing, setPlaying] = useState(false);

  return (
    <ScreenScaffold
      tint="study"
      footer={
        <PrimaryButton
          label="Test Your Understanding"
          variant="coral"
          onPress={() => navigation.navigate('Quiz', { profile })}
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
        title="Lesson Studio"
        kicker="YOUR EXPLANATION"
        onBack={() => navigation.goBack()}
        right={
          <Badge label="OFFLINE" tone="sage" />
        }
      />

      {/* scanned page thumbnail + topic */}
      <View style={styles.topicRow}>
        <View style={styles.thumb}>
          <Illustration name="lesson" height={64} rounded={radius.md} />
        </View>
        <View style={{ flex: 1, marginLeft: spacing.md }}>
          <Text style={styles.subject}>{LESSON.subject}</Text>
          <Text style={styles.topic}>{LESSON.topic}</Text>
        </View>
      </View>

      {/* analogy card — the highlighted "real world" box */}
      <View style={styles.analogyCard}>
        <View style={styles.analogyTag}>
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path d="M12 3 V6 M12 18 V21 M5 12 H3 M21 12 H18 M6 6 L7.5 7.5 M18 18 L16.5 16.5"
                  stroke={colors.gold} strokeWidth="2" strokeLinecap="round" />
            <Circle cx="12" cy="12" r="4.4" fill={colors.gold} />
          </Svg>
          <Text style={styles.analogyTagText}>THINK OF IT LIKE THIS</Text>
        </View>
        <Text style={styles.analogyText}>{LESSON.analogy}</Text>
      </View>

      {/* core explanation — max 3 bullets */}
      <Text style={styles.sectionLabel}>Step by step</Text>

      {LESSON.bullets.map((b, i) => (
        <View key={i} style={styles.bullet}>
          <View style={styles.bulletNum}>
            <Text style={styles.bulletNumText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bulletKey}>{b.key}</Text>
            <ScaffoldText text={b.text} />
          </View>
        </View>
      ))}

      <View style={styles.audioHint}>
        <Text style={styles.audioHintText}>
          Tap the speaker to hear this read aloud
        </Text>
      </View>

      {/* floating speaker FAB */}
      <View style={styles.fab}>
        <SpeakerButton playing={playing} onPress={() => setPlaying((p) => !p)} />
      </View>
    </ScreenScaffold>
  );
}

/* Renders [keyword] markers as bold English scaffolding keywords. */
function ScaffoldText({ text }) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <Text style={styles.bulletText}>
      {parts.map((p, i) => {
        if (p.startsWith('[') && p.endsWith(']')) {
          return (
            <Text key={i} style={styles.keyword}>
              {p.slice(1, -1)}
            </Text>
          );
        }
        return p;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 64, height: 64,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  subject: { ...type.caption, color: colors.inkFaint },
  topic: { ...type.heading, color: colors.ink },

  analogyCard: {
    backgroundColor: colors.goldWash,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.goldLight,
    marginBottom: spacing.lg,
  },
  analogyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  analogyTagText: {
    ...type.caption,
    color: '#A87A2C',
    marginLeft: 6,
  },
  analogyText: {
    fontFamily: type.heading.fontFamily,
    fontSize: 18,
    lineHeight: 27,
    color: colors.ink,
  },

  sectionLabel: {
    ...type.smallBold,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },

  bullet: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow.soft,
  },
  bulletNum: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.goldWash,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  bulletNumText: {
    fontFamily: type.bodyExtra.fontFamily,
    fontSize: 15,
    color: '#A87A2C',
  },
  bulletKey: {
    ...type.smallBold,
    color: colors.coralDeep,
    marginBottom: 2,
  },
  bulletText: {
    ...type.body,
    color: colors.ink,
  },
  keyword: {
    fontFamily: type.bodyExtra.fontFamily,
    color: colors.skyDeep,
  },

  audioHint: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  audioHintText: {
    ...type.small,
    color: colors.inkFaint,
  },

  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
  },
});
