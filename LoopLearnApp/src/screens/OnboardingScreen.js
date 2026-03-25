import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoopBuddy } from '../components/LoopBuddy';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import { useGameStore } from '../store/useGameStore';

const GRADE_EMOJIS = { 1: '🌟', 2: '🔥', 3: '⚡', 4: '🚀', 5: '💎', 6: '👑' };

const SLIDES = [
  {
    emoji: '🧠',
    mood: 'wave',
    title: 'Welcome to LoopLearn!',
    body: 'The fun way to master Math & Science for Grades 1–6.',
  },
  {
    emoji: '🔁',
    mood: 'idle',
    title: 'Learn in Loops',
    body: 'Each Loop has bite-sized lessons followed by quizzes to test what you learned.',
  },
  {
    emoji: '⭐',
    mood: 'celebrate',
    title: 'Earn XP & Badges',
    body: 'Answer questions correctly to earn XP, level up, and unlock cool badges!',
  },
  {
    emoji: '🔥',
    mood: 'encourage',
    title: 'Build Streaks',
    body: 'Come back every day to build your streak and become a learning champion!',
  },
];

export const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const setOnboarded = useGameStore(state => state.setOnboarded);
  const setGrade = useGameStore(state => state.setGrade);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState(1);
  const flatRef = useRef(null);

  const isLast = currentPage >= SLIDES.length;
  const showGradePicker = currentPage === SLIDES.length;

  const handleNext = () => {
    if (currentPage < SLIDES.length) {
      flatRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFinish = () => {
    setGrade(selectedGrade);
    setOnboarded();
  };

  const allPages = [...SLIDES, { isGradePicker: true }];

  return (
    <View style={[st.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <FlatList
        ref={flatRef}
        data={allPages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => String(i)}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item, index }) => {
          if (item.isGradePicker) {
            return (
              <View style={[st.slide, { width }]}>
                <LoopBuddy mood="think" size="lg" message="Which grade are you in?" />
                <Text style={st.emoji}>🎓</Text>
                <Text style={st.title}>Pick Your Grade</Text>
                <Text style={st.body}>You can always change this later in Settings.</Text>
                <View style={st.gradeGrid}>
                  {[1, 2, 3, 4, 5, 6].map(g => (
                    <Pressable
                      key={g}
                      style={[st.gradeBtn, selectedGrade === g && { ...st.gradeSelected, borderColor: GRADE_COLORS[g], backgroundColor: `${GRADE_COLORS[g]}20` }]}
                      onPress={() => setSelectedGrade(g)}>
                      <Text style={st.gradeEmoji}>{GRADE_EMOJIS[g]}</Text>
                      <Text style={[st.gradeNum, selectedGrade === g && { color: GRADE_COLORS[g] }]}>
                        {g}
                      </Text>
                      <Text style={st.gradeLabel}>Grade {g}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            );
          }
          return (
            <View style={[st.slide, { width }]}>
              <LoopBuddy mood={item.mood} size="lg" message={item.title} />
              <Text style={st.emoji}>{item.emoji}</Text>
              <Text style={st.title}>{item.title}</Text>
              <Text style={st.body}>{item.body}</Text>
            </View>
          );
        }}
      />

      {/* Dots */}
      <View style={st.dots}>
        {allPages.map((_, i) => (
          <View key={i} style={[st.dot, currentPage === i && st.dotActive]} />
        ))}
      </View>

      {/* Button */}
      <View style={st.footer}>
        {showGradePicker ? (
          <Pressable onPress={handleFinish}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={st.btn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={st.btnText}>Let's Go! 🚀</Text>
            </LinearGradient>
          </Pressable>
        ) : (
          <Pressable onPress={handleNext}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={st.btn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={st.btnText}>Next</Text>
            </LinearGradient>
          </Pressable>
        )}
        {!showGradePicker && (
          <Pressable onPress={() => {
            flatRef.current?.scrollToIndex({ index: SLIDES.length, animated: true });
            setCurrentPage(SLIDES.length);
          }}>
            <Text style={st.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emoji: { fontSize: 60, marginBottom: 16, marginTop: 12 },
  title: { ...TYPE.h1, ...TYPE.black, color: COLORS.textPrimary, textAlign: 'center', marginBottom: 14 },
  body: { ...TYPE.lg, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 28, fontSize: 18 },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24,
  },
  gradeBtn: {
    width: 90,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
  },
  gradeSelected: {
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  gradeEmoji: { fontSize: 20, marginBottom: 4 },
  gradeNum: { ...TYPE.h3, ...TYPE.extrabold, color: COLORS.textSecondary },
  gradeNumSelected: { color: COLORS.primary },
  gradeLabel: { ...TYPE.xs, color: COLORS.textMuted, marginTop: 4 },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 28,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 14,
  },
  btn: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 64,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnText: { ...TYPE.xl, ...TYPE.bold, color: COLORS.white },
  skipText: { ...TYPE.md, color: COLORS.textMuted },
});
