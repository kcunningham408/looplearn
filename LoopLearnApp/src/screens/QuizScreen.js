import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AiTeacherModal } from '../components/AiTeacherModal';
import { FadeIn } from '../components/FadeIn';
import { GlassCard } from '../components/GlassCard';
import { LoopBuddy } from '../components/LoopBuddy';
import { QuizQuestion } from '../components/QuizQuestion';
import { Sparkle } from '../components/Sparkle';
import COLORS, { BADGE_DEFS } from '../config/colors';
import TYPE from '../config/typography';
import lessons from '../data/lessons.json';
import { explainMistake } from '../services/aiTeacher';
import { SoundService } from '../services/SoundService';
import { useGameStore } from '../store/useGameStore';

// Fisher-Yates shuffle with index map so we can track correct answer
const shuffleAnswers = (answers, correctIdx, type) => {
  // Don't shuffle True/False — always show True first
  if (type === 'tf') return { shuffled: [...answers], correctIndex: correctIdx };
  const indices = answers.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map(i => answers[i]);
  const newCorrect = indices.indexOf(correctIdx);
  return { shuffled, correctIndex: newCorrect };
};

export const QuizScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subject, loop, linkId } = route.params;

  const addXp = useGameStore(state => state.addXp);
  const addQuizStreak = useGameStore(state => state.addQuizStreak);
  const resetQuizStreak = useGameStore(state => state.resetQuizStreak);
  const completeLoop = useGameStore(state => state.completeLoop);
  const completeLink = useGameStore(state => state.completeLink);
  const checkBadges = useGameStore(state => state.checkBadges);
  const addQuizRecord = useGameStore(state => state.addQuizRecord);
  const updateDailyChallenge = useGameStore(state => state.updateDailyChallenge);
  const logWrongAnswer = useGameStore(state => state.logWrongAnswer);
  const wrongAnswerLog = useGameStore(state => state.wrongAnswerLog);
  const quizStreak = useGameStore(state => state.quizStreak);
  const grade = useGameStore(state => state.grade);

  // 'lesson' | 'quiz' | 'review' | 'results'
  const [phase, setPhase] = useState('lesson');
  const [showAi, setShowAi] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [leveledUp, setLeveledUp] = useState(null);
  const [quizAttempt, setQuizAttempt] = useState(0);
  // AI explanations for wrong answers (keyed by index)
  const [explanations, setExplanations] = useState({});
  const [loadingExplanation, setLoadingExplanation] = useState(null);
  const [lessonPage, setLessonPage] = useState(0);

  const link = useMemo(() => {
    const loopData = lessons[subject]?.find(l => l.loop === loop);
    return loopData?.links.find(item => item.id === linkId);
  }, [subject, loop, linkId]);

  const loopData = useMemo(() => {
    return lessons[subject]?.find(l => l.loop === loop);
  }, [subject, loop]);

  // Build lesson pages for step-through UI
  const lessonPages = useMemo(() => {
    if (!link?.lesson) return [];
    const pages = [];
    if (link.lesson.sections?.length) {
      link.lesson.sections.forEach(s => pages.push({ type: 'section', ...s }));
      pages.push({ type: 'summary', keyPoints: link.lesson.keyPoints, funFact: link.lesson.funFact });
    } else {
      // Legacy format — single page with title + examples
      pages.push({ type: 'legacy', title: link.lesson.title, examples: link.lesson.examples, diagram: link.lesson.diagram });
    }
    return pages;
  }, [link]);

  // Shuffle answers once per quiz attempt (re-shuffles on retake)
  const shuffledQuestions = useMemo(() => {
    if (!link?.quiz) return [];
    return link.quiz.map(q => {
    const { shuffled, correctIndex } = shuffleAnswers(q.a, q.correct, q.type);
      return { ...q, a: shuffled, correct: correctIndex, originalQ: q.q };
    });
  }, [link, quizAttempt]);

  const questions = shuffledQuestions;
  // Find the next link in this loop for "Next Lesson" navigation
  const nextLinkId = useMemo(() => {
    if (!loopData?.links) return null;
    const idx = loopData.links.findIndex(l => l.id === linkId);
    if (idx >= 0 && idx < loopData.links.length - 1) return loopData.links[idx + 1].id;
    return null;
  }, [loopData, linkId]);

  const accent = subject === 'math' ? COLORS.math : COLORS.science;
  const gradient = subject === 'math' ? COLORS.mathGradient : COLORS.scienceGradient;

  // Confetti particles
  const confettiTimer = useRef(null);
  const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟', '💫', '🎊', '🏆'];
  const screenWidth = Dimensions.get('window').width;
  const confettiAnims = useRef(
    Array.from({ length: 12 }, () => ({
      y: new Animated.Value(-60),
      x: Math.random() * screenWidth,
      emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    })),
  ).current;
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    confettiAnims.forEach((p, i) => {
      p.y.setValue(-60);
      p.opacity.setValue(1);
      p.rotate.setValue(0);
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: Dimensions.get('window').height + 60,
          duration: 1800 + i * 120,
          delay: i * 80,
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: 1800 + i * 120,
          delay: i * 80 + 800,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: 1,
          duration: 1800 + i * 120,
          delay: i * 80,
          useNativeDriver: true,
        }),
      ]).start();
    });
    confettiTimer.current = setTimeout(() => setShowConfetti(false), 3500);
  }, [confettiAnims]);

  useEffect(() => {
    return () => { if (confettiTimer.current) clearTimeout(confettiTimer.current); };
  }, []);

  // Intercept back navigation during quiz to prevent accidental exit
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (phase !== 'quiz') return;
      e.preventDefault();
      Alert.alert('Leave Quiz?', "Your progress won't be saved.", [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
      ]);
    });
    return unsubscribe;
  }, [navigation, phase]);

  if (!link) {
    return (
      <View style={st.container}>
        <Text style={{ color: COLORS.textPrimary, padding: 20 }}>Lesson not found.</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: COLORS.primaryLight }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleRetake = () => {
    setPhase('lesson');
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setCorrectCount(0);
    setXpEarned(0);
    setNewBadges([]);
    setWrongAnswers([]);
    setLeveledUp(null);
    setQuizAttempt(a => a + 1);
    setExplanations({});
    setLoadingExplanation(null);
    setLessonPage(0);
  };

  // Adaptive hint — check if student has prior wrong answers on this topic
  const adaptiveHint = useMemo(() => {
    if (!link || !wrongAnswerLog?.length) return null;
    const relevantMistakes = wrongAnswerLog.filter(
      e => e.loop === loop || e.linkId === linkId
    );
    if (relevantMistakes.length < 2) return null;
    // Find the most common mistake pattern
    const counts = {};
    relevantMistakes.forEach(e => {
      const key = e.correctAnswer;
      counts[key] = (counts[key] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted[0][1] >= 2) {
      return `💡 Tip: You\'ve missed questions about "${sorted[0][0]}" before — take extra care on those!`;
    }
    return null;
  }, [link, wrongAnswerLog, loop, linkId]);

  // Request AI explanation for a wrong answer
  const handleExplainMistake = async (idx) => {
    if (explanations[idx] || loadingExplanation === idx) return;
    setLoadingExplanation(idx);
    const item = wrongAnswers[idx];
    const result = await explainMistake({
      question: item.question,
      yourAnswer: item.yourAnswer,
      correctAnswer: item.correctAnswer,
      grade,
      subject,
      linkTitle: link?.title,
    });
    setExplanations(prev => ({
      ...prev,
      [idx]: result.explanation || result.error || 'Could not explain right now.',
    }));
    setLoadingExplanation(null);
  };

  // LESSON PHASE — multi-page step-through
  if (phase === 'lesson') {
    const totalPages = lessonPages.length;
    const currentPage = lessonPages[lessonPage] || lessonPages[0];

    if (!currentPage) {
      // No lesson content — skip straight to quiz
      setPhase('quiz');
      return null;
    }

    const isLastPage = lessonPage >= totalPages - 1;
    const isLegacy = totalPages === 1 && currentPage?.type === 'legacy';

    return (
      <ScrollView style={st.container} contentContainerStyle={st.scroll}>
        <Pressable style={st.exitBtn} onPress={() => navigation.goBack()}>
          <Text style={st.exitText}>✕</Text>
        </Pressable>

        <FadeIn>
          <View style={st.lessonHeader}>
            <Text style={st.lessonEmoji}>{subject === 'math' ? '🔢' : '🔬'}</Text>
            <Text style={st.lessonTitle}>{link.title}</Text>
            {!isLegacy && (
              <Text style={st.lessonPageNum}>
                {lessonPage + 1} of {totalPages}
              </Text>
            )}
          </View>
        </FadeIn>

        {/* Page dots */}
        {!isLegacy && totalPages > 1 && (
          <View style={st.pageDots}>
            {lessonPages.map((_, i) => (
              <View
                key={i}
                style={[
                  st.pageDot,
                  i === lessonPage && { backgroundColor: accent, transform: [{ scale: 1.3 }] },
                  i < lessonPage && { backgroundColor: COLORS.textMuted },
                ]}
              />
            ))}
          </View>
        )}

        {/* Content card */}
        <FadeIn key={lessonPage} delay={100}>
          <GlassCard accent={accent}>
            {currentPage.type === 'section' && (
              <>
                <Text style={st.sectionLabel}>LESSON</Text>
                <Text style={st.sectionHeading}>{currentPage.heading}</Text>
                <Text style={st.sectionContent}>{currentPage.content}</Text>
                {currentPage.visual && (
                  <View style={st.visualBox}>
                    <Text style={st.visualText}>{currentPage.visual}</Text>
                  </View>
                )}
              </>
            )}
            {currentPage.type === 'summary' && (
              <>
                <Text style={st.sectionLabel}>📝 KEY POINTS</Text>
                {currentPage.keyPoints?.map((kp, i) => (
                  <View key={i} style={st.keyPointRow}>
                    <Text style={st.keyPointCheck}>✓</Text>
                    <Text style={st.keyPointText}>{kp}</Text>
                  </View>
                ))}
                {currentPage.funFact && (
                  <View style={st.funFactBox}>
                    <Text style={st.funFactLabel}>🤓 Fun Fact</Text>
                    <Text style={st.funFactText}>{currentPage.funFact}</Text>
                  </View>
                )}
              </>
            )}
            {currentPage.type === 'legacy' && (
              <>
                <Text style={st.sectionLabel}>LESSON</Text>
                <Text style={st.lessonContent}>{currentPage.title}</Text>
                {currentPage.examples?.map((ex, i) => (
                  <View key={i} style={st.exampleRow}>
                    <Text style={st.exampleBullet}>•</Text>
                    <Text style={st.exampleText}>{ex}</Text>
                  </View>
                ))}
                {currentPage.diagram && (
                  <Text style={st.diagramNote}>📊 {currentPage.diagram}</Text>
                )}
              </>
            )}
          </GlassCard>
        </FadeIn>

        {/* Navigation */}
        <FadeIn delay={200}>
          {isLegacy || isLastPage ? (
            <Pressable onPress={() => setPhase('quiz')}>
              <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={st.ctaText}>Start Quiz ({questions.length} questions)</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <View style={st.lessonNav}>
              {lessonPage > 0 && (
                <Pressable style={st.navBack} onPress={() => setLessonPage(p => p - 1)}>
                  <Text style={st.navBackText}>← Back</Text>
                </Pressable>
              )}
              <Pressable style={{ flex: 1 }} onPress={() => setLessonPage(p => p + 1)}>
                <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={st.ctaText}>Continue →</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}
        </FadeIn>

        <FadeIn delay={300}>
          <Pressable style={st.askAiBtn} onPress={() => setShowAi(true)}>
            <Text style={st.askAiText}>🤖 Ask LoopBot</Text>
          </Pressable>
        </FadeIn>

        <AiTeacherModal
          visible={showAi}
          onClose={() => setShowAi(false)}
          grade={grade}
          subject={subject}
        />
      </ScrollView>
    );
  }

  // REVIEW PHASE — show wrong answers
  if (phase === 'review') {
    return (
      <ScrollView style={st.container} contentContainerStyle={st.scroll}>
        <FadeIn>
          <View style={st.reviewHeader}>
            <Text style={st.reviewTitle}>📝 Review</Text>
            <Text style={st.reviewSubtitle}>
              {wrongAnswers.length} question{wrongAnswers.length !== 1 ? 's' : ''} to review
            </Text>
          </View>
        </FadeIn>

        {wrongAnswers.map((item, idx) => (
          <FadeIn key={idx} delay={idx * 100}>
            <GlassCard accent={COLORS.wrong}>
              <Text style={st.reviewQ}>{item.question}</Text>
              <View style={st.reviewAnswer}>
                <Text style={st.reviewWrongLabel}>Your answer:</Text>
                <Text style={st.reviewWrongText}>{item.yourAnswer}</Text>
              </View>
              <View style={st.reviewAnswer}>
                <Text style={st.reviewCorrectLabel}>Correct answer:</Text>
                <Text style={st.reviewCorrectText}>{item.correctAnswer}</Text>
              </View>
              {/* AI Explain button */}
              {explanations[idx] ? (
                <View style={st.explanationBox}>
                  <Text style={st.explanationLabel}>🤖 LoopBot says:</Text>
                  <Text style={st.explanationText}>{explanations[idx]}</Text>
                </View>
              ) : (
                <Pressable
                  style={st.explainBtn}
                  onPress={() => handleExplainMistake(idx)}
                  disabled={loadingExplanation === idx}>
                  {loadingExplanation === idx ? (
                    <View style={st.explainLoadingRow}>
                      <ActivityIndicator size="small" color={COLORS.primaryLight} />
                      <Text style={st.explainBtnText}> Thinking...</Text>
                    </View>
                  ) : (
                    <Text style={st.explainBtnText}>🤖 Understand Why</Text>
                  )}
                </Pressable>
              )}
            </GlassCard>
          </FadeIn>
        ))}

        <FadeIn delay={wrongAnswers.length * 100 + 100}>
          <Pressable onPress={() => {
            const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
            if (pct >= 70) triggerConfetti();
            setPhase('results');
          }}>
            <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={st.ctaText}>See Results</Text>
            </LinearGradient>
          </Pressable>
        </FadeIn>
      </ScrollView>
    );
  }

  // RESULTS PHASE
  if (phase === 'results') {
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const emoji = pct === 100 ? '🌟' : pct >= 70 ? '👏' : pct >= 50 ? '👍' : '💪';

    return (
      <View style={st.container}>
      <ScrollView contentContainerStyle={st.scroll}>
        <FadeIn>
          <View style={st.resultCenter}>
            <LoopBuddy
              mood={pct === 100 ? 'celebrate' : pct >= 50 ? 'idle' : 'encourage'}
              size="lg"
              grade={grade}
              message={pct === 100 ? 'Amazing!' : pct >= 70 ? 'Great job!' : 'Keep trying!'}
            />
            <Sparkle active={pct >= 70} color={COLORS.gold} size={50} />
            <Text style={st.resultEmoji}>{emoji}</Text>
            <Text style={st.resultTitle}>
              {pct === 100 ? 'Perfect!' : 'Quiz Complete!'}
            </Text>
          </View>
        </FadeIn>

        {leveledUp && (
          <FadeIn delay={80}>
            <GlassCard accent={COLORS.primary} glow>
              <View style={st.levelUpRow}>
                <Text style={st.levelUpEmoji}>🎉</Text>
                <View>
                  <Text style={st.levelUpTitle}>Level Up!</Text>
                  <Text style={st.levelUpDesc}>You reached Level {leveledUp}!</Text>
                </View>
              </View>
            </GlassCard>
          </FadeIn>
        )}

        <FadeIn delay={150}>
          <GlassCard accent={COLORS.gold} glow>
            <View style={st.scoreRow}>
              <View style={st.scoreStat}>
                <Text style={[st.scoreValue, { color: accent }]}>{correctCount}/{questions.length}</Text>
                <Text style={st.scoreLabel}>Correct</Text>
              </View>
              <View style={st.scoreStat}>
                <Text style={[st.scoreValue, { color: COLORS.gold }]}>+{xpEarned}</Text>
                <Text style={st.scoreLabel}>XP Earned</Text>
              </View>
              <View style={st.scoreStat}>
                <Text style={[st.scoreValue, { color: COLORS.textPrimary }]}>{pct}%</Text>
                <Text style={st.scoreLabel}>Score</Text>
              </View>
            </View>
          </GlassCard>
        </FadeIn>

        {newBadges.length > 0 && (
          <FadeIn delay={300}>
            <GlassCard accent={COLORS.gold}>
              <Text style={st.sectionLabel}>🎖️ NEW BADGES EARNED!</Text>
              {newBadges.map(b => {
                const def = BADGE_DEFS[b];
                return def ? (
                  <View key={b} style={st.newBadgeRow}>
                    <Text style={st.newBadgeEmoji}>{def.emoji}</Text>
                    <View>
                      <Text style={st.newBadgeName}>{def.name}</Text>
                      <Text style={st.newBadgeDesc}>{def.description}</Text>
                    </View>
                  </View>
                ) : null;
              })}
            </GlassCard>
          </FadeIn>
        )}

        <FadeIn delay={450}>
          <View style={st.resultActions}>
            <Pressable onPress={handleRetake} style={st.retakeBtn}>
              <Text style={st.retakeText}>🔄 Retake Quiz</Text>
            </Pressable>
            {nextLinkId ? (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => navigation.replace('QuizScreen', { subject, loop, linkId: nextLinkId })}>
                <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={st.ctaText}>Next Lesson →</Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable
                style={{ flex: 1 }}
                onPress={() => navigation.goBack()}>
                <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={st.ctaText}>Done ✓</Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </FadeIn>

      </ScrollView>

        {/* Confetti overlay — outside ScrollView so it stays fixed on screen */}
        {showConfetti && (
          <View style={st.confettiOverlay} pointerEvents="none">
            {confettiAnims.map((p, i) => (
              <Animated.Text
                key={i}
                style={[
                  st.confettiParticle,
                  {
                    left: p.x,
                    opacity: p.opacity,
                    transform: [
                      { translateY: p.y },
                      {
                        rotate: p.rotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', `${360 + i * 30}deg`],
                        }),
                      },
                    ],
                  },
                ]}>
                {p.emoji}
              </Animated.Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  // QUIZ PHASE
  if (questions.length === 0) {
    return (
      <View style={st.container}>
        <Text style={{ color: COLORS.textPrimary, padding: 20 }}>No quiz questions available.</Text>
        <Pressable onPress={() => navigation.goBack()} style={{ padding: 20 }}>
          <Text style={{ color: COLORS.primaryLight }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const current = questions[currentIndex];

  const onSelect = (index) => {
    if (answered) return;
    SoundService.play('tap');
    setSelectedIndex(index);
  };

  const onSubmit = () => {
    if (selectedIndex === null) return;

    if (!answered) {
      setAnswered(true);
      const isCorrect = selectedIndex === current.correct;
      if (isCorrect) {
        SoundService.play('correct');
        setCorrectCount(v => v + 1);
        // Bonus XP for streaks
        const streakBonus = quizStreak >= 4 ? 5 : 0;
        const xpGain = 10 + streakBonus;
        setXpEarned(v => v + xpGain);
        const newLevel = addXp(xpGain);
        if (newLevel) { setLeveledUp(newLevel); SoundService.play('levelup'); }
        addQuizStreak();
        if (quizStreak + 1 >= 3) SoundService.play('streak');
      } else {
        SoundService.play('wrong');
        resetQuizStreak();
        setWrongAnswers(prev => [...prev, {
          question: current.q || current.originalQ,
          yourAnswer: current.a[selectedIndex],
          correctAnswer: current.a[current.correct],
        }]);
      }
      return;
    }

    // Move to next question or finish
    if (currentIndex + 1 >= questions.length) {
      // correctCount and wrongAnswers are already updated from the "check" step

      // Quiz complete — record & process
      addQuizRecord({ linkId, subject, loop, score: correctCount, total: questions.length });
      updateDailyChallenge();

      // Only mark link completed if score >= 70%
      const pct = Math.round((correctCount / questions.length) * 100);
      if (pct >= 70) {
        completeLink(linkId, correctCount, questions.length);
        const store = useGameStore.getState();
        const allDone = loopData?.links.every(l =>
          store.completedLinks.some(c => (typeof c === 'string' ? c : c.id) === l.id) || l.id === linkId
        );
        if (allDone) completeLoop(loop, subject);
      }

      const earned = checkBadges();
      setNewBadges(earned);
      if (earned.length > 0) SoundService.play('badge');

      // Log wrong answers to store for adaptive learning pattern analysis
      wrongAnswers.forEach(wa => {
        logWrongAnswer({
          question: wa.question,
          yourAnswer: wa.yourAnswer,
          correctAnswer: wa.correctAnswer,
          subject, loop, linkId, linkTitle: link?.title,
        });
      });

      if (wrongAnswers.length > 0) {
        setPhase('review');
      } else {
        triggerConfetti();
        SoundService.play('complete');
        setPhase('results');
      }
      return;
    }

    setSelectedIndex(null);
    setAnswered(false);
    setCurrentIndex(idx => idx + 1);
  };

  return (
    <View style={st.container}>
      <View style={st.quizHeader}>
        <Pressable style={st.exitBtnSmall} onPress={() => navigation.goBack()}>
          <Text style={st.exitText}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={st.quizTitle}>{link.title}</Text>
          <Text style={st.questionCount}>
            Q {currentIndex + 1}/{questions.length}
          </Text>
        </View>
        <LoopBuddy
          mood={answered ? (selectedIndex === current.correct ? 'celebrate' : 'encourage') : 'think'}
          size="sm"
          grade={grade}
        />
        {quizStreak > 0 && (
          <View style={st.streakBadge}>
            <Text style={st.streakText}>🔥 {quizStreak}</Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      <View style={st.progressTrack}>
        <View
          style={[
            st.progressFill,
            {
              width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`,
              backgroundColor: accent,
            },
          ]}
        />
      </View>

      <ScrollView style={st.quizBody} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Adaptive hint from past learning patterns */}
        {adaptiveHint && currentIndex === 0 && (
          <FadeIn>
            <View style={st.adaptiveHint}>
              <Text style={st.adaptiveHintText}>{adaptiveHint}</Text>
            </View>
          </FadeIn>
        )}

        <FadeIn key={currentIndex}>
          <QuizQuestion
            question={current}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            answered={answered}
            correctIndex={current.correct}
          />
        </FadeIn>

        {answered && (
          <FadeIn>
            <View style={[st.feedbackBanner, selectedIndex === current.correct ? st.feedbackCorrect : st.feedbackWrong]}>
              <Sparkle active={selectedIndex === current.correct} color={COLORS.gold} />
              <Text style={st.feedbackText}>
                {selectedIndex === current.correct ? 'Correct! 🎉' : `Not quite — the answer is: ${current.a[current.correct]}`}
              </Text>
            </View>
          </FadeIn>
        )}
      </ScrollView>

      <View style={st.bottomBar}>
        <View style={st.bottomRow}>
          <Pressable style={st.askAiBtnSmall} onPress={() => setShowAi(true)}>
            <Text style={st.askAiSmallText}>🤖</Text>
          </Pressable>
          <Pressable
            onPress={onSubmit}
            disabled={selectedIndex === null}
            style={({ pressed }) => [{ flex: 1 }, pressed && { opacity: 0.8 }]}>
            <LinearGradient
              colors={selectedIndex !== null ? gradient : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.06)']}
              style={st.submitBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={[st.submitText, selectedIndex === null && { color: COLORS.textMuted }]}>
                {answered ? (currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question') : 'Submit'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <AiTeacherModal
        visible={showAi}
        onClose={() => setShowAi(false)}
        grade={grade}
        subject={subject}
      />
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },

  // Exit button
  exitBtn: {
    position: 'absolute', top: 16, right: 16, zIndex: 10,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  exitBtnSmall: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  exitText: { ...TYPE.lg, color: COLORS.textSecondary },

  // Lesson phase
  lessonHeader: { alignItems: 'center', paddingVertical: 30 },
  lessonEmoji: { fontSize: 48, marginBottom: 12 },
  lessonTitle: { ...TYPE.h2, ...TYPE.extrabold, color: COLORS.textPrimary, textAlign: 'center' },
  lessonPageNum: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.textMuted, marginTop: 6 },
  pageDots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  pageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.12)' },
  sectionLabel: { ...TYPE.xs, ...TYPE.bold, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 12 },
  sectionHeading: { ...TYPE.xl, ...TYPE.bold, color: COLORS.textPrimary, marginBottom: 10 },
  sectionContent: { ...TYPE.lg, color: COLORS.textSecondary, lineHeight: 26, marginBottom: 12 },
  visualBox: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 18, marginTop: 10, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.10)' },
  visualText: { ...TYPE.lg, ...TYPE.semibold, color: COLORS.textPrimary, textAlign: 'center', lineHeight: 28 },
  keyPointRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' },
  keyPointCheck: { ...TYPE.lg, ...TYPE.bold, color: COLORS.correct, marginRight: 10, marginTop: 1 },
  keyPointText: { ...TYPE.lg, color: COLORS.textPrimary, flex: 1, lineHeight: 24 },
  funFactBox: { backgroundColor: 'rgba(252,211,77,0.12)', borderWidth: 1.5, borderColor: 'rgba(252,211,77,0.30)', borderRadius: 16, padding: 16, marginTop: 16 },
  funFactLabel: { ...TYPE.sm, ...TYPE.bold, color: COLORS.gold, marginBottom: 6 },
  funFactText: { ...TYPE.md, color: COLORS.textSecondary, lineHeight: 22 },
  lessonNav: { flexDirection: 'row', gap: 12, marginTop: 20 },
  navBack: { borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)', justifyContent: 'center' },
  navBackText: { ...TYPE.md, ...TYPE.bold, color: COLORS.textSecondary },
  lessonContent: { ...TYPE.lg, ...TYPE.semibold, color: COLORS.textPrimary, marginBottom: 12 },
  exampleRow: { flexDirection: 'row', marginBottom: 6 },
  exampleBullet: { ...TYPE.lg, color: COLORS.textSecondary, marginRight: 8 },
  exampleText: { ...TYPE.lg, color: COLORS.textSecondary, flex: 1 },
  diagramNote: { ...TYPE.sm, color: COLORS.textMuted, marginTop: 12 },
  ctaButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 20 },
  ctaText: { ...TYPE.lg, ...TYPE.bold, color: COLORS.white },

  // Quiz phase
  quizHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  quizTitle: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary },
  questionCount: { ...TYPE.sm, color: COLORS.textSecondary, marginTop: 2 },
  streakBadge: { backgroundColor: 'rgba(248,113,113,0.20)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: 'rgba(248,113,113,0.30)' },
  streakText: { ...TYPE.md, ...TYPE.bold, color: '#F87171' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.10)', marginHorizontal: 20, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  quizBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  bottomBar: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', backgroundColor: COLORS.bgElevated },
  submitBtn: { borderRadius: 20, paddingVertical: 22, alignItems: 'center', minHeight: 60 },
  submitText: { ...TYPE.xl, ...TYPE.bold, color: COLORS.white },

  // Review phase
  reviewHeader: { alignItems: 'center', paddingVertical: 20 },
  reviewTitle: { ...TYPE.h2, ...TYPE.extrabold, color: COLORS.textPrimary },
  reviewSubtitle: { ...TYPE.md, color: COLORS.textSecondary, marginTop: 4 },
  reviewQ: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary, marginBottom: 12 },
  reviewAnswer: { marginBottom: 8 },
  reviewWrongLabel: { ...TYPE.xs, ...TYPE.bold, color: COLORS.wrong, letterSpacing: 1, marginBottom: 2 },
  reviewWrongText: { ...TYPE.md, color: COLORS.wrong },
  reviewCorrectLabel: { ...TYPE.xs, ...TYPE.bold, color: COLORS.correct, letterSpacing: 1, marginBottom: 2 },
  reviewCorrectText: { ...TYPE.md, color: COLORS.correct },

  // Explain mistake (AI)
  explainBtn: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}30`,
    alignItems: 'center',
  },
  explainBtnText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.primaryLight },
  explainLoadingRow: { flexDirection: 'row', alignItems: 'center' },
  explanationBox: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}25`,
  },
  explanationLabel: { ...TYPE.xs, ...TYPE.bold, color: COLORS.primaryLight, letterSpacing: 1, marginBottom: 4 },
  explanationText: { ...TYPE.md, color: COLORS.textPrimary, lineHeight: 20 },

  // Adaptive hint
  adaptiveHint: {
    backgroundColor: `${COLORS.gold}15`,
    borderWidth: 1.5,
    borderColor: `${COLORS.gold}30`,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  adaptiveHintText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.gold, lineHeight: 18 },

  feedbackBanner: {
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: COLORS.correctGlow,
    borderWidth: 1.5,
    borderColor: COLORS.correct,
  },
  feedbackWrong: {
    backgroundColor: COLORS.wrongGlow,
    borderWidth: 1.5,
    borderColor: COLORS.wrong,
  },
  feedbackText: {
    ...TYPE.md,
    ...TYPE.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },

  // Results phase
  resultCenter: { alignItems: 'center', paddingVertical: 36 },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { ...TYPE.hero, ...TYPE.black, color: COLORS.textPrimary },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around' },
  scoreStat: { alignItems: 'center' },
  scoreValue: { ...TYPE.h2, ...TYPE.extrabold },
  scoreLabel: { ...TYPE.xs, color: COLORS.textMuted, marginTop: 4 },
  newBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  newBadgeEmoji: { fontSize: 28, marginRight: 14 },
  newBadgeName: { ...TYPE.lg, ...TYPE.bold, color: COLORS.gold },
  newBadgeDesc: { ...TYPE.sm, color: COLORS.textSecondary },
  levelUpRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelUpEmoji: { fontSize: 36 },
  levelUpTitle: { ...TYPE.xl, ...TYPE.extrabold, color: COLORS.primary },
  levelUpDesc: { ...TYPE.md, color: COLORS.textSecondary },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  retakeBtn: {
    borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  retakeText: { ...TYPE.md, ...TYPE.bold, color: COLORS.textSecondary },

  // AI Teacher
  askAiBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  askAiText: { ...TYPE.md, ...TYPE.semibold, color: COLORS.primaryLight },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  askAiBtnSmall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderWidth: 1.5, borderColor: `${COLORS.primary}40`,
    alignItems: 'center', justifyContent: 'center',
  },
  askAiSmallText: { fontSize: 20 },

  // Confetti
  confettiOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  confettiParticle: {
    position: 'absolute',
    fontSize: 28,
    top: 0,
  },
});
