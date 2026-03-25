import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import lessons from '../data/lessons.json';
import { SoundService } from '../services/SoundService';
import { useGameStore } from '../store/useGameStore';
import { BackgroundGlow } from './BackgroundGlow';
import { FadeIn } from './FadeIn';
import { LoopBuddy } from './LoopBuddy';
import { ProgressMap } from './ProgressMap';

const grades = [1, 2, 3, 4, 5, 6];
const GRADE_EMOJIS = { 1: '🌟', 2: '🔥', 3: '⚡', 4: '🚀', 5: '💎', 6: '👑' };

export const SubjectHome = ({ subject }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const grade = useGameStore(state => state.grade);
  const completedLinks = useGameStore(state => state.completedLinks);
  const setGrade = useGameStore(state => state.setGrade);

  const handleGradeChange = (g) => {
    setGrade(g);
  };

  const isMath = subject === 'math';
  const subjectLoops = (lessons[subject] || []).filter(loop => loop.grade === grade);
  const accent = isMath ? COLORS.math : COLORS.science;
  const gradient = isMath ? COLORS.mathGradient : COLORS.scienceGradient;
  const emoji = isMath ? '🔢' : '🔬';
  const label = isMath ? 'Math' : 'Science';

  const getProgress = (loop) => {
    if (!loop.links?.length) return 0;
    const done = loop.links.filter(l =>
      completedLinks.some(c => (typeof c === 'string' ? c : c.id) === l.id)
    ).length;
    return Math.floor((done / loop.links.length) * 100);
  };

  return (
    <BackgroundGlow subject={subject} style={{ paddingTop: insets.top }}>
      {/* Fun Header */}
      <View style={st.header}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={st.headerGradient}
        />
        <View style={st.headerContent}>
          <Text style={st.headerEmoji}>{emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={st.headerTitle}>{label} · Grade {grade}</Text>
            <Text style={st.headerSub}>
              {subjectLoops.length} loop{subjectLoops.length !== 1 ? 's' : ''} available
            </Text>
          </View>
          <LoopBuddy mood="idle" size="sm" grade={grade} />
        </View>
      </View>

      {/* Grade Picker */}
      <View style={st.gradePicker}>
        {grades.map(g => {
          const color = GRADE_COLORS[g];
          const selected = grade === g;
          return (
            <Pressable
              key={g}
              style={({ pressed }) => [
                st.gradeChip,
                selected && { backgroundColor: color, borderColor: color },
                pressed && { opacity: 0.8, transform: [{ scale: 0.93 }] },
              ]}
              onPress={() => handleGradeChange(g)}>
              <Text style={[st.gradeNumber, selected && { color: '#FFF' }]}>{g}</Text>
              <Text style={[st.gradeLabel, selected && { color: '#FFF' }]}>Grade</Text>
            </Pressable>
          );
        })}
      </View>

      {/* AI Practice Button */}
      <FadeIn delay={100}>
        <Pressable
          style={st.aiPracticeBtn}
          onPress={() => { SoundService.play('tap'); navigation.navigate('AIPractice'); }}>
          <LinearGradient
            colors={isMath ? ['#6366F1', '#8B5CF6'] : ['#06B6D4', '#10B981']}
            style={st.aiPracticeGradient}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={st.aiPracticeEmoji}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={st.aiPracticeTitle}>AI Practice</Text>
              <Text style={st.aiPracticeSub}>Unlimited AI-generated questions</Text>
            </View>
            <Text style={st.aiPracticeArrow}>→</Text>
          </LinearGradient>
        </Pressable>
      </FadeIn>

      {subjectLoops.length > 0 ? (
        <ScrollView contentContainerStyle={st.list}>
          <ProgressMap
            loops={subjectLoops}
            subject={subject}
            getProgress={getProgress}
          />
        </ScrollView>
      ) : (
        <FadeIn>
          <View style={st.empty}>
            <LoopBuddy mood="encourage" size="lg" message="Try another grade!" />
            <Text style={st.emptyText}>No {subject} loops for Grade {grade} yet</Text>
            <Text style={st.emptyHint}>Try switching grades above!</Text>
          </View>
        </FadeIn>
      )}
    </BackgroundGlow>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerEmoji: { fontSize: 36, marginRight: 14 },
  headerTitle: {
    ...TYPE.h2,
    ...TYPE.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  headerSub: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gradePicker: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
  },
  gradeChip: {
    width: 56,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: COLORS.bgElevated,
  },
  gradeNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  gradeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  list: { padding: 20, paddingBottom: 40 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary, marginBottom: 6, marginTop: 16 },
  emptyHint: { ...TYPE.sm, color: COLORS.textMuted },
  aiPracticeBtn: { marginHorizontal: 20, marginTop: 12 },
  aiPracticeGradient: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderRadius: 18,
  },
  aiPracticeEmoji: { fontSize: 28, marginRight: 14 },
  aiPracticeTitle: { ...TYPE.lg, ...TYPE.bold, color: COLORS.white },
  aiPracticeSub: { ...TYPE.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  aiPracticeArrow: { ...TYPE.xl, ...TYPE.bold, color: 'rgba(255,255,255,0.60)' },
});
