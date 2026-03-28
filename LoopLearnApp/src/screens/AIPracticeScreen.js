import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo, VibeCMDBadge } from '../components/AppLogo';
import { FadeIn } from '../components/FadeIn';
import { GlassCard } from '../components/GlassCard';
import { LoopBuddy } from '../components/LoopBuddy';
import { QuizQuestion } from '../components/QuizQuestion';
import { Sparkle } from '../components/Sparkle';
import COLORS, { BADGE_DEFS } from '../config/colors';
import TYPE from '../config/typography';
import { generateQuestions } from '../services/aiTeacher';
import { SoundService } from '../services/SoundService';
import { useGameStore } from '../store/useGameStore';

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy', emoji: '🌱', color: COLORS.correct },
  { key: 'medium', label: 'Medium', emoji: '⚡', color: COLORS.gold },
  { key: 'hard', label: 'Hard', emoji: '🔥', color: COLORS.wrong },
];

const MATH_TOPICS = {
  1: ['Addition', 'Subtraction', 'Counting', 'Shapes'],
  2: ['Addition', 'Subtraction', 'Place Value', 'Time'],
  3: ['Multiplication', 'Division', 'Fractions', 'Word Problems'],
  4: ['Multiplication', 'Fractions', 'Decimals', 'Geometry'],
  5: ['Fractions', 'Decimals', 'Percentages', 'Order of Operations'],
  6: ['Ratios', 'Integers', 'Expressions', 'Equations'],
};

const SCIENCE_TOPICS = {
  1: ['Animals', 'Plants', 'Weather', 'Senses'],
  2: ['Habitats', 'Life Cycles', 'States of Matter', 'Forces'],
  3: ['Ecosystems', 'Adaptations', 'Simple Machines', 'Weather'],
  4: ['Energy', 'Electricity', 'Food Chains', 'Water Cycle'],
  5: ['Cells', 'Human Body', 'Chemical Changes', 'Space'],
  6: ['Atoms', 'Energy Transfer', 'Genetics', 'Earth Systems'],
};

// Fisher-Yates shuffle
const shuffleAnswers = (answers, correctIdx) => {
  const indices = answers.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map(i => answers[i]);
  const newCorrect = indices.indexOf(correctIdx);
  return { shuffled, correctIndex: newCorrect };
};

export const AIPracticeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const grade = useGameStore(s => s.grade);
  const addXp = useGameStore(s => s.addXp);
  const addQuizStreak = useGameStore(s => s.addQuizStreak);
  const resetQuizStreak = useGameStore(s => s.resetQuizStreak);
  const checkBadges = useGameStore(s => s.checkBadges);
  const updateDailyChallenge = useGameStore(s => s.updateDailyChallenge);
  const logWrongAnswer = useGameStore(s => s.logWrongAnswer);
  const quizStreak = useGameStore(s => s.quizStreak);
  const cacheQuestions = useGameStore(s => s.cacheQuestions);
  const getCachedQuestions = useGameStore(s => s.getCachedQuestions);
  const incrementAiPractice = useGameStore(s => s.incrementAiPractice);

  // Setup phase state
  const [phase, setPhase] = useState('setup'); // 'setup' | 'loading' | 'quiz' | 'results'
  const [subject, setSubject] = useState('math');
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Quiz phase state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [newBadges, setNewBadges] = useState([]);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [leveledUp, setLeveledUp] = useState(null);
  const [loadError, setLoadError] = useState(null);

  // Confetti
  const screenWidth = Dimensions.get('window').width;
  const CONFETTI_EMOJIS = ['🎉', '⭐', '✨', '🌟', '💫', '🎊', '🏆'];
  const confettiTimer = useRef(null);
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
        Animated.timing(p.y, { toValue: Dimensions.get('window').height + 60, duration: 1800 + i * 120, delay: i * 80, useNativeDriver: true }),
        Animated.timing(p.opacity, { toValue: 0, duration: 1800 + i * 120, delay: i * 80 + 800, useNativeDriver: true }),
        Animated.timing(p.rotate, { toValue: 1, duration: 1800 + i * 120, delay: i * 80, useNativeDriver: true }),
      ]).start();
    });
    confettiTimer.current = setTimeout(() => setShowConfetti(false), 3500);
  }, [confettiAnims]);

  useEffect(() => { 
    return () => { 
      if (confettiTimer.current) clearTimeout(confettiTimer.current);
      // Stop all confetti animations
      confettiAnims.forEach(p => {
        p.y.stopAnimation();
        p.opacity.stopAnimation();
        p.rotate.stopAnimation();
      });
    }; 
  }, [confettiAnims]);

  const accent = subject === 'math' ? COLORS.math : COLORS.science;
  const gradient = subject === 'math' ? COLORS.mathGradient : COLORS.scienceGradient;
  const topicsList = subject === 'math' ? MATH_TOPICS[grade] || MATH_TOPICS[3] : SCIENCE_TOPICS[grade] || SCIENCE_TOPICS[3];

  const toggleTopic = (topic) => {
    SoundService.play('tap');
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleGenerate = async () => {
    if (phase === 'loading') return; // prevent double-tap
    setPhase('loading');
    setLoadError(null);

    const result = await generateQuestions({
      grade,
      subject,
      topics: selectedTopics.length > 0 ? selectedTopics : undefined,
      count: 5,
      difficulty,
    });

    if (result.error) {
      // Try cached questions as fallback
      const cached = getCachedQuestions(grade, subject);
      if (cached && cached.questions?.length) {
        setupQuiz(cached.questions);
        return;
      }
      setLoadError(result.error);
      setPhase('setup');
      return;
    }

    // Cache for offline use
    cacheQuestions({ grade, subject, difficulty, questions: result.questions });
    setupQuiz(result.questions);
  };

  const setupQuiz = (rawQuestions) => {
    const shuffled = rawQuestions.map(q => {
      const { shuffled: sa, correctIndex } = shuffleAnswers(q.a, q.correct);
      return { ...q, a: sa, correct: correctIndex, originalQ: q.q };
    });

    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswered(false);
    setCorrectCount(0);
    setXpEarned(0);
    setNewBadges([]);
    setWrongAnswers([]);
    setLeveledUp(null);
    setPhase('quiz');
    SoundService.play('tap');
  };

  // Intercept back during quiz or loading
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (phase === 'loading') {
        e.preventDefault();
        return;
      }
      if (phase !== 'quiz') return;
      e.preventDefault();
      Alert.alert('Leave Practice?', "Your progress won't be saved.", [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
      ]);
    });
    return unsub;
  }, [navigation, phase]);

  // SETUP PHASE
  if (phase === 'setup') {
    return (
      <ScrollView style={st.container} contentContainerStyle={[st.scroll, { paddingTop: insets.top + 20 }]}>
        <FadeIn>
          <View style={{ alignItems: 'center' }}>
            <AppLogo size="md" style={{ marginBottom: 16 }} />
            <Text style={st.setupTitle}>AI Practice</Text>
            <Text style={st.setupSub}>Fresh questions generated just for you!</Text>
          </View>
        </FadeIn>

        {loadError && (
          <FadeIn>
            <View style={st.errorBox}>
              <Text style={st.errorText}>⚠️ {loadError}</Text>
              <Pressable 
                style={st.retryButton}
                onPress={() => { setLoadError(null); setPhase('setup'); }}
                accessibilityRole="button"
                accessibilityLabel="Try again"
              >
                <Text style={st.retryText}>Try Again</Text>
              </Pressable>
            </View>
          </FadeIn>
        )}

        {/* Subject Picker */}
        <FadeIn delay={100}>
          <GlassCard>
            <Text style={st.sectionLabel}>SUBJECT</Text>
            <View style={st.subjectRow}>
              {['math', 'science'].map(s => (
                <Pressable
                  key={s}
                  style={[st.subjectBtn, subject === s && { backgroundColor: s === 'math' ? COLORS.math : COLORS.science, borderColor: s === 'math' ? COLORS.math : COLORS.science }]}
                  onPress={() => { setSubject(s); setSelectedTopics([]); SoundService.play('tap'); }}>
                  <Text style={st.subjectEmoji}>{s === 'math' ? '🔢' : '🔬'}</Text>
                  <Text style={[st.subjectText, subject === s && { color: '#FFF' }]}>{s === 'math' ? 'Math' : 'Science'}</Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        </FadeIn>

        {/* Difficulty */}
        <FadeIn delay={200}>
          <GlassCard>
            <Text style={st.sectionLabel}>DIFFICULTY</Text>
            <View style={st.diffRow}>
              {DIFFICULTIES.map(d => (
                <Pressable
                  key={d.key}
                  style={[st.diffBtn, difficulty === d.key && { backgroundColor: d.color + '30', borderColor: d.color }]}
                  onPress={() => { setDifficulty(d.key); SoundService.play('tap'); }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: difficulty === d.key }}
                  accessibilityLabel={`${d.label} difficulty`}>
                  <Text style={st.diffEmoji}>{d.emoji}</Text>
                  <Text style={[st.diffText, difficulty === d.key && { color: d.color }]}>{d.label}</Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        </FadeIn>

        {/* Topics */}
        <FadeIn delay={300}>
          <GlassCard accent={accent}>
            <Text style={st.sectionLabel}>TOPICS (optional)</Text>
            <Text style={st.topicHint}>Select specific topics or leave blank for a mix</Text>
            <View style={st.topicGrid}>
              {topicsList.map(t => {
                const selected = selectedTopics.includes(t);
                return (
                  <Pressable
                    key={t}
                    style={[st.topicChip, selected && { backgroundColor: accent + '30', borderColor: accent }]}
                    onPress={() => toggleTopic(t)}>
                    <Text style={[st.topicText, selected && { color: accent }]}>{t}</Text>
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
        </FadeIn>

        {/* Generate Button */}
        <FadeIn delay={400}>
          <Pressable onPress={handleGenerate} accessibilityRole="button" accessibilityLabel={`Generate ${subject} questions for grade ${grade}`}>
            <LinearGradient colors={gradient} style={st.generateBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={st.generateText}>🤖 Generate Questions</Text>
            </LinearGradient>
          </Pressable>
        </FadeIn>

        <FadeIn delay={450}>
          <Text style={st.gradeNote}>Grade {grade} · Powered by VibeCMD AI</Text>
        </FadeIn>

        <VibeCMDBadge style={{ marginTop: 8 }} />
      </ScrollView>
    );
  }

  // LOADING PHASE
  if (phase === 'loading') {
    return (
      <View style={[st.container, st.centerContent, { paddingTop: insets.top }]}>
        <LoopBuddy mood="think" size="lg" grade={grade} message="Generating questions..." />
        <ActivityIndicator size="large" color={accent} style={{ marginTop: 24 }} />
        <Text style={st.loadingText}>Creating your quiz...</Text>
        <Text style={st.loadingSubtext}>This takes a few seconds</Text>
      </View>
    );
  }

  // RESULTS PHASE
  if (phase === 'results') {
    const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const emoji = pct === 100 ? '🌟' : pct >= 70 ? '👏' : pct >= 50 ? '👍' : '💪';

    return (
      <View style={st.container}>
        <ScrollView contentContainerStyle={[st.scroll, { paddingTop: insets.top + 20 }]}>
          <FadeIn>
            <View style={{ alignItems: 'center' }}>
              <LoopBuddy
                mood={pct === 100 ? 'celebrate' : pct >= 50 ? 'idle' : 'encourage'}
                size="lg" grade={grade}
                message={pct === 100 ? 'Perfect!' : pct >= 70 ? 'Great job!' : 'Keep practicing!'}
              />
              <Sparkle active={pct >= 70} color={COLORS.gold} size={50} />
              <Text style={st.resultEmoji}>{emoji}</Text>
              <Text style={st.resultTitle}>{pct === 100 ? 'Perfect!' : 'Practice Complete!'}</Text>
            </View>
          </FadeIn>

          {leveledUp && (
            <FadeIn delay={80}>
              <GlassCard accent={COLORS.primary} glow>
                <View style={st.levelUpRow}>
                  <Text style={{ fontSize: 36 }}>🎉</Text>
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
                <Text style={st.sectionLabel}>🎖️ NEW BADGES!</Text>
                {newBadges.map(b => {
                  const def = BADGE_DEFS[b];
                  return def ? (
                    <View key={b} style={st.badgeRow}>
                      <Text style={{ fontSize: 28, marginRight: 14 }}>{def.emoji}</Text>
                      <View>
                        <Text style={st.badgeName}>{def.name}</Text>
                        <Text style={st.badgeDesc}>{def.description}</Text>
                      </View>
                    </View>
                  ) : null;
                })}
              </GlassCard>
            </FadeIn>
          )}

          {/* Wrong answer review inline */}
          {wrongAnswers.length > 0 && (
            <FadeIn delay={400}>
              <GlassCard accent={COLORS.wrong}>
                <Text style={st.sectionLabel}>📝 REVIEW</Text>
                {wrongAnswers.map((wa, idx) => (
                  <View key={idx} style={st.reviewItem}>
                    <Text style={st.reviewQ}>{wa.question}</Text>
                    <Text style={st.reviewWrong}>Your answer: {wa.yourAnswer}</Text>
                    <Text style={st.reviewCorrect}>Correct: {wa.correctAnswer}</Text>
                    {wa.explanation && <Text style={st.reviewExplanation}>💡 {wa.explanation}</Text>}
                  </View>
                ))}
              </GlassCard>
            </FadeIn>
          )}

          <FadeIn delay={500}>
            <View style={st.resultActions}>
              <Pressable onPress={() => { setPhase('setup'); SoundService.play('tap'); }} style={st.retakeBtn}>
                <Text style={st.retakeText}>🔄 New Quiz</Text>
              </Pressable>
              <Pressable style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                <LinearGradient colors={gradient} style={st.ctaButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={st.ctaText}>Done ✓</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </FadeIn>

          <VibeCMDBadge />
        </ScrollView>

        {showConfetti && (
          <View style={st.confettiOverlay} pointerEvents="none">
            {confettiAnims.map((p, i) => (
              <Animated.Text key={i} style={[st.confettiParticle, {
                left: p.x, opacity: p.opacity,
                transform: [{ translateY: p.y }, { rotate: p.rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${360 + i * 30}deg`] }) }],
              }]}>{p.emoji}</Animated.Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  // QUIZ PHASE
  if (questions.length === 0) {
    return (
      <View style={[st.container, st.centerContent, { paddingTop: insets.top }]}>
        <Text style={{ color: COLORS.textPrimary }}>No questions available.</Text>
        <Pressable onPress={() => setPhase('setup')} style={{ padding: 20 }}>
          <Text style={{ color: COLORS.primaryLight }}>Try Again</Text>
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
        const streakBonus = quizStreak >= 4 ? 5 : 0;
        const xpGain = 10 + streakBonus;
        setXpEarned(v => v + xpGain);
        const newLevel = addXp(xpGain);
        if (newLevel) {
          setLeveledUp(newLevel);
          SoundService.play('levelup');
        }
        addQuizStreak();
        if (quizStreak + 1 >= 3) SoundService.play('streak');
      } else {
        SoundService.play('wrong');
        resetQuizStreak();
        setWrongAnswers(prev => [...prev, {
          question: current.q,
          yourAnswer: current.a[selectedIndex],
          correctAnswer: current.a[current.correct],
          explanation: current.explanation || null,
        }]);
      }
      return;
    }

    // Next question or finish
    if (currentIndex + 1 >= questions.length) {
      updateDailyChallenge();
      incrementAiPractice();

      wrongAnswers.forEach(wa => {
        logWrongAnswer({
          question: wa.question, yourAnswer: wa.yourAnswer, correctAnswer: wa.correctAnswer,
          subject, loop: 'ai-practice', linkId: 'ai-practice', linkTitle: `AI ${subject} Practice`,
        });
      });

      const earned = checkBadges();
      setNewBadges(earned);
      if (earned.length > 0) SoundService.play('badge');

      const pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      if (pct >= 70) {
        triggerConfetti();
        SoundService.play('complete');
      }
      setPhase('results');
      return;
    }

    setSelectedIndex(null);
    setAnswered(false);
    setCurrentIndex(idx => idx + 1);
  };

  return (
    <View style={st.container}>
      <View style={[st.quizHeader, { paddingTop: insets.top + 8 }]}>
        <Pressable style={st.exitBtn} onPress={() => navigation.goBack()}>
          <Text style={st.exitText}>✕</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={st.quizTitle}>🤖 AI Practice</Text>
          <Text style={st.questionCount}>Q {currentIndex + 1}/{questions.length}</Text>
        </View>
        <LoopBuddy
          mood={answered ? (selectedIndex === current.correct ? 'celebrate' : 'encourage') : 'think'}
          size="sm" grade={grade}
        />
        {quizStreak > 0 && (
          <View style={st.streakBadge}>
            <Text style={st.streakText}>🔥 {quizStreak}</Text>
          </View>
        )}
      </View>

      <View style={st.progressTrack}>
        <View style={[st.progressFill, { width: `${((currentIndex + (answered ? 1 : 0)) / questions.length) * 100}%`, backgroundColor: accent }]} />
      </View>

      <ScrollView style={st.quizBody} contentContainerStyle={{ paddingBottom: 40 }}>
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
              {current.explanation && answered && selectedIndex !== current.correct && (
                <Text style={st.explanationInline}>💡 {current.explanation}</Text>
              )}
            </View>
          </FadeIn>
        )}
      </ScrollView>

      <View style={st.bottomBar}>
        <Pressable
          onPress={onSubmit}
          disabled={selectedIndex === null}
          style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
          <LinearGradient
            colors={selectedIndex !== null ? gradient : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.06)']}
            style={st.submitBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={[st.submitText, selectedIndex === null && { color: COLORS.textMuted }]}>
              {answered ? (currentIndex + 1 >= questions.length ? 'Finish' : 'Next Question') : 'Submit'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  centerContent: { alignItems: 'center', justifyContent: 'center' },

  // Setup
  setupHeader: { alignItems: 'center', paddingVertical: 30 },
  setupTitle: { ...TYPE.h1, ...TYPE.black, color: COLORS.textPrimary },
  setupSub: { ...TYPE.md, color: COLORS.textSecondary, marginTop: 6 },
  sectionLabel: { ...TYPE.xs, ...TYPE.bold, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 12 },
  subjectRow: { flexDirection: 'row', gap: 12 },
  subjectBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  subjectEmoji: { fontSize: 28, marginBottom: 6 },
  subjectText: { ...TYPE.md, ...TYPE.bold, color: COLORS.textSecondary },
  diffRow: { flexDirection: 'row', gap: 10 },
  diffBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 14,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  diffEmoji: { fontSize: 22, marginBottom: 4 },
  diffText: { ...TYPE.sm, ...TYPE.bold, color: COLORS.textSecondary },
  topicHint: { ...TYPE.sm, color: COLORS.textMuted, marginBottom: 12 },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.06)',
  },
  topicText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.textSecondary },
  generateBtn: { borderRadius: 20, paddingVertical: 20, alignItems: 'center', marginTop: 24 },
  generateText: { ...TYPE.xl, ...TYPE.bold, color: COLORS.white },
  gradeNote: { ...TYPE.sm, color: COLORS.textMuted, textAlign: 'center', marginTop: 16 },
  errorBox: { backgroundColor: COLORS.wrongGlow, borderColor: COLORS.wrong, borderWidth: 1.5, borderRadius: 14, padding: 14, marginBottom: 12, alignItems: 'center' },
  errorText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.wrong, marginBottom: 12 },
  retryButton: { backgroundColor: COLORS.wrong, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  retryText: { ...TYPE.sm, ...TYPE.bold, color: COLORS.white },

  // Loading
  loadingText: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary, marginTop: 20 },
  loadingSubtext: { ...TYPE.sm, color: COLORS.textMuted, marginTop: 6 },

  // Quiz
  quizHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  quizTitle: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary },
  questionCount: { ...TYPE.sm, color: COLORS.textSecondary, marginTop: 2 },
  exitBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  exitText: { ...TYPE.lg, color: COLORS.textSecondary },
  streakBadge: { backgroundColor: 'rgba(248,113,113,0.20)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: 'rgba(248,113,113,0.30)' },
  streakText: { ...TYPE.md, ...TYPE.bold, color: '#F87171' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.10)', marginHorizontal: 20, borderRadius: 3 },
  progressFill: { height: 6, borderRadius: 3 },
  quizBody: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  bottomBar: { paddingHorizontal: 20, paddingBottom: 34, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', backgroundColor: COLORS.bgElevated },
  submitBtn: { borderRadius: 20, paddingVertical: 22, alignItems: 'center', minHeight: 60 },
  submitText: { ...TYPE.xl, ...TYPE.bold, color: COLORS.white },

  feedbackBanner: { borderRadius: 14, padding: 14, marginTop: 12, alignItems: 'center' },
  feedbackCorrect: { backgroundColor: COLORS.correctGlow, borderWidth: 1.5, borderColor: COLORS.correct },
  feedbackWrong: { backgroundColor: COLORS.wrongGlow, borderWidth: 1.5, borderColor: COLORS.wrong },
  feedbackText: { ...TYPE.md, ...TYPE.semibold, color: COLORS.textPrimary, textAlign: 'center' },
  explanationInline: { ...TYPE.sm, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center', lineHeight: 18 },

  // Results
  resultCenter: { alignItems: 'center', paddingVertical: 36 },
  resultEmoji: { fontSize: 72, marginBottom: 16 },
  resultTitle: { ...TYPE.hero, ...TYPE.black, color: COLORS.textPrimary },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around' },
  scoreStat: { alignItems: 'center' },
  scoreValue: { ...TYPE.h2, ...TYPE.extrabold },
  scoreLabel: { ...TYPE.xs, color: COLORS.textMuted, marginTop: 4 },
  levelUpRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  levelUpTitle: { ...TYPE.xl, ...TYPE.extrabold, color: COLORS.primary },
  levelUpDesc: { ...TYPE.md, color: COLORS.textSecondary },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  badgeName: { ...TYPE.lg, ...TYPE.bold, color: COLORS.gold },
  badgeDesc: { ...TYPE.sm, color: COLORS.textSecondary },
  resultActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  retakeBtn: {
    borderRadius: 16, paddingVertical: 18, paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  retakeText: { ...TYPE.md, ...TYPE.bold, color: COLORS.textSecondary },
  ctaButton: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  ctaText: { ...TYPE.lg, ...TYPE.bold, color: COLORS.white },
  reviewItem: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  reviewQ: { ...TYPE.md, ...TYPE.bold, color: COLORS.textPrimary, marginBottom: 6 },
  reviewWrong: { ...TYPE.sm, color: COLORS.wrong, marginBottom: 2 },
  reviewCorrect: { ...TYPE.sm, color: COLORS.correct, marginBottom: 4 },
  reviewExplanation: { ...TYPE.sm, color: COLORS.textSecondary, marginTop: 4, lineHeight: 18 },

  confettiOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  confettiParticle: { position: 'absolute', fontSize: 24 },
});
