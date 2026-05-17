import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ScreenScaffold, PrimaryButton, ProgressDots } from '../../components/ui';
import { ScreenHeader } from '../../components/widgets';
import Illustration from '../../components/Illustration';
import { colors, type, spacing, radius, shadow } from '../../theme/tokens';

/* Screens 10-12 — Challenge Arena
 * One stateful screen covering: the question (10), the correct-answer
 * reveal (11) and the incorrect-answer reveal (12). 3 calibrated MCQs.
 * The difficulty engine note is shown when a mistake is registered. */
const QUESTIONS = [
  {
    q: 'What does a plant mainly use to catch sunlight?',
    options: [
      'Its roots in the soil',
      'A green colour called chlorophyll',
      'The water it drinks',
      'The wind around it',
    ],
    answer: 1,
    why: 'Chlorophyll is the green pigment in leaves that absorbs sunlight — that captured light powers the whole process.',
  },
  {
    q: 'Which gas does a plant breathe IN during photosynthesis?',
    options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Water vapour'],
    answer: 1,
    why: 'Leaves take in carbon dioxide from the air, and give out oxygen as the result.',
  },
  {
    q: 'What food does the plant make for itself?',
    options: ['Glucose', 'Protein', 'Salt', 'Vitamin C'],
    answer: 0,
    why: 'The plant makes glucose, a simple sugar, which is its energy-rich food.',
  },
];

export default function QuizScreen({ navigation, route }) {
  const profile = route?.params?.profile;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const item = QUESTIONS[index];
  const answered = picked !== null;
  const correct = picked === item.answer;
  const lastQuestion = index === QUESTIONS.length - 1;

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === item.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (lastQuestion) {
      navigation.replace('Summary', { profile, score, total: QUESTIONS.length });
    } else {
      setIndex((x) => x + 1);
      setPicked(null);
    }
  };

  return (
    <ScreenScaffold
      tint="dusk"
      footer={
        answered ? (
          <PrimaryButton
            label={lastQuestion ? 'See Your Results' : 'Next Question'}
            variant={correct ? 'sage' : 'sky'}
            onPress={next}
            icon={
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path d="M9 5 L16 12 L9 19" stroke={colors.white} strokeWidth="2.6"
                      fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            }
          />
        ) : null
      }
    >
      <ScreenHeader
        title="Challenge Arena"
        kicker={`QUESTION ${index + 1} OF ${QUESTIONS.length}`}
        onBack={() => navigation.goBack()}
      />

      {/* progress */}
      <View style={styles.progressRow}>
        <ProgressDots total={QUESTIONS.length} index={index} tone={colors.coral} />
        <View style={styles.scorePill}>
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Path d="M12 3 L14.5 9 L21 9 L16 13 L18 20 L12 16 L6 20 L8 13 L3 9 L9.5 9Z"
                  fill={colors.gold} />
          </Svg>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </View>

      {/* small scene strip */}
      <View style={styles.scene}>
        <Illustration name="quiz" height={104} rounded={radius.md} />
      </View>

      {/* question */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{item.q}</Text>
      </View>

      {/* options */}
      {item.options.map((opt, i) => {
        const isAnswer = i === item.answer;
        const isPicked = i === picked;

        let state = 'idle';
        if (answered && isAnswer) state = 'correct';
        else if (answered && isPicked && !isAnswer) state = 'wrong';
        else if (answered) state = 'dim';

        return (
          <OptionRow
            key={i}
            letter={['A', 'B', 'C', 'D'][i]}
            label={opt}
            state={state}
            onPress={() => choose(i)}
          />
        );
      })}

      {/* feedback panel — the correct (11) / incorrect (12) state */}
      {answered && (
        <View
          style={[
            styles.feedback,
            { backgroundColor: correct ? colors.sageWash : colors.errorWash },
          ]}
        >
          <View style={styles.feedbackHead}>
            {correct ? (
              <>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Circle cx="12" cy="12" r="10" fill={colors.sage} />
                  <Path d="M7 12 L11 16 L17 8" stroke={colors.white} strokeWidth="2.6"
                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={[styles.feedbackTitle, { color: colors.sageDeep }]}>
                  Wonderful — that's right!
                </Text>
              </>
            ) : (
              <>
                <Svg width={22} height={22} viewBox="0 0 24 24">
                  <Circle cx="12" cy="12" r="10" fill={colors.error} />
                  <Path d="M9 9 L15 15 M15 9 L9 15" stroke={colors.white}
                        strokeWidth="2.6" strokeLinecap="round" />
                </Svg>
                <Text style={[styles.feedbackTitle, { color: colors.error }]}>
                  Not quite — let's learn it together
                </Text>
              </>
            )}
          </View>
          <Text style={styles.feedbackWhy}>{item.why}</Text>

          {!correct && (
            <View style={styles.adaptNote}>
              <View style={styles.adaptIcon}>
                <Svg width={18} height={18} viewBox="0 0 24 24">
                  <Path
                    d="M12 4 V20 M12 10 H6 Q4 10 4 12 V14 M12 10 H18 Q20 10 20 12 V14"
                    stroke={colors.skyDeep}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="4" r="1.8" fill={colors.skyDeep} />
                  <Circle cx="4" cy="16" r="1.8" fill={colors.skyDeep} />
                  <Circle cx="20" cy="16" r="1.8" fill={colors.skyDeep} />
                </Svg>
              </View>
              <Text style={styles.adaptText}>
                EduLens noticed this was tricky — the next question adapts to you.
              </Text>
            </View>
          )}
        </View>
      )}
    </ScreenScaffold>
  );
}

function OptionRow({ letter, label, state, onPress }) {
  const palette = {
    idle:    { bg: colors.card,      border: colors.line,        fg: colors.ink,     badge: colors.skyWash,  badgeFg: colors.skyDeep },
    correct: { bg: colors.sageWash,  border: colors.sage,        fg: colors.sageDeep,badge: colors.sage,     badgeFg: colors.white },
    wrong:   { bg: colors.errorWash, border: colors.error,       fg: colors.error,   badge: colors.error,    badgeFg: colors.white },
    dim:     { bg: colors.card,      border: colors.line,        fg: colors.inkFaint,badge: colors.lineSoft, badgeFg: colors.inkFaint },
  }[state];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: state === 'dim' ? 0.6 : 1,
          transform: [{ scale: pressed && state === 'idle' ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={[styles.optBadge, { backgroundColor: palette.badge }]}>
        {state === 'correct' ? (
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path d="M5 12 L10 17 L19 7" stroke={palette.badgeFg} strokeWidth="3"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        ) : state === 'wrong' ? (
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Path d="M6 6 L18 18 M18 6 L6 18" stroke={palette.badgeFg}
                  strokeWidth="3" strokeLinecap="round" />
          </Svg>
        ) : (
          <Text style={[styles.optLetter, { color: palette.badgeFg }]}>{letter}</Text>
        )}
      </View>
      <Text style={[styles.optLabel, { color: palette.fg }]}>{label}</Text>
      {state === 'correct' && (
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Path d="M12 3 L14.5 9 L21 9 L16 13 L18 20 L12 16 L6 20 L8 13 L3 9 L9.5 9Z"
                fill={colors.gold} />
        </Svg>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.goldWash,
    paddingVertical: 5, paddingHorizontal: 11,
    borderRadius: radius.pill,
  },
  scoreText: {
    ...type.smallBold, color: '#A87A2C', marginLeft: 5,
  },

  scene: {
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },

  questionCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  questionText: {
    fontFamily: type.heading.fontFamily,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  optBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.sm,
  },
  optLetter: { fontFamily: type.bodyExtra.fontFamily, fontSize: 16 },
  optLabel: { ...type.bodyBold, flex: 1 },

  feedback: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  feedbackHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  feedbackTitle: {
    ...type.subhead,
    marginLeft: 8,
    flex: 1,
  },
  feedbackWhy: {
    ...type.body,
    color: colors.ink,
  },
  adaptNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.skyWash,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  adaptIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  adaptText: {
    ...type.smallBold,
    color: colors.skyDeep,
    flex: 1,
    lineHeight: 19,
  },
});
