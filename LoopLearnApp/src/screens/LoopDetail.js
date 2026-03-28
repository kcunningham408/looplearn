import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppLogo } from '../components/AppLogo';
import { FadeIn } from '../components/FadeIn';
import { LinkCard } from '../components/LinkCard';
import { ProgressRing } from '../components/ProgressRing';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import lessons from '../data/lessons.json';
import { useGameStore } from '../store/useGameStore';

export const LoopDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subject, loop } = route.params;
  const completedLinks = useGameStore(state => state.completedLinks);

  const subjectLoops = lessons[subject] || [];
  const loopData = subjectLoops.find(item => item.loop === loop);
  const accent = subject === 'math' ? COLORS.math : COLORS.science;
  const gradient = subject === 'math' ? COLORS.mathGradient : COLORS.scienceGradient;

  if (!loopData) {
    return (
      <View style={st.container} accessibilityRole="alert">
        <Text style={st.title}>Loop not found</Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: 20, paddingTop: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={{ color: COLORS.primaryLight }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const done = loopData.links.filter(l =>
    completedLinks.some(c => c.id === l.id)
  ).length;
  const pct = loopData.links.length > 0 ? Math.floor((done / loopData.links.length) * 100) : 0;
  const gradeColor = GRADE_COLORS[loopData.grade] || COLORS.primary;

  return (
    <View style={st.container}>
      <FadeIn>
        <View style={st.header}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={st.headerGradient}
          />
          <View style={st.headerContent}>
            <View style={st.headerText}>
              <View style={st.titleRow}>
                <Text style={st.title}>{loopData.title}</Text>
                <AppLogo size="xs" />
              </View>
              <View style={st.metaRow}>
                <View style={[st.gradeBadge, { backgroundColor: `${gradeColor}25`, borderColor: `${gradeColor}50` }]}>
                  <Text style={[st.gradeBadgeText, { color: gradeColor }]}>Grade {loopData.grade}</Text>
                </View>
                <Text style={st.subjectLabel}>{subject === 'math' ? '🔢' : '🔬'} {subject}</Text>
                <Text style={st.lessonCount}>{loopData.links.length} lessons</Text>
              </View>
            </View>
            <ProgressRing value={pct} size={68} color={accent} />
          </View>
          {pct === 100 && (
            <View style={st.completeBanner}>
              <Text style={st.completeBannerText}>🎉 Loop Complete!</Text>
            </View>
          )}
        </View>
      </FadeIn>
      <FlatList
        data={loopData.links}
        keyExtractor={item => item.id}
        contentContainerStyle={st.list}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        renderItem={({ item, index }) => (
          <FadeIn delay={150 + index * 80}>
            <LinkCard
              link={item}
              completed={completedLinks.some(c => c.id === item.id)}
              scoreData={completedLinks.find(c => c.id === item.id)}
              onPress={() => navigation.navigate('QuizScreen', { subject, loop, linkId: item.id })}
            />
          </FadeIn>
        )}
      />
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 18,
  },
  headerText: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    ...TYPE.h3,
    ...TYPE.extrabold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  gradeBadgeText: {
    ...TYPE.xs,
    ...TYPE.bold,
  },
  subjectLabel: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
  },
  lessonCount: {
    ...TYPE.sm,
    color: COLORS.textMuted,
  },
  completeBanner: {
    backgroundColor: `${COLORS.correct}15`,
    borderTopWidth: 1,
    borderTopColor: `${COLORS.correct}30`,
    paddingVertical: 8,
    alignItems: 'center',
  },
  completeBannerText: {
    ...TYPE.sm,
    ...TYPE.bold,
    color: COLORS.correct,
  },
  list: { padding: 20, paddingBottom: 40 },
});
