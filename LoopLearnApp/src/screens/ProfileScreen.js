import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeIn } from '../components/FadeIn';
import { GlassCard } from '../components/GlassCard';
import { LoopBuddy } from '../components/LoopBuddy';
import { ProgressRing } from '../components/ProgressRing';
import { ScreenHeader } from '../components/ScreenHeader';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import { fetchLearningInsights } from '../services/aiTeacher';
import { useGameStore, xpProgressInLevel } from '../store/useGameStore';

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const grade = useGameStore(s => s.grade);
  const xp = useGameStore(s => s.xp);
  const level = useGameStore(s => s.level);
  const dailyStreak = useGameStore(s => s.dailyStreak);
  const quizStreak = useGameStore(s => s.quizStreak);
  const badges = useGameStore(s => s.badges);
  const completedLoops = useGameStore(s => s.completedLoops);
  const completedLinks = useGameStore(s => s.completedLinks);
  const streakDates = useGameStore(s => s.streakDates);
  const dailyChallenge = useGameStore(s => s.dailyChallenge);
  const wrongAnswerLog = useGameStore(s => s.wrongAnswerLog);
  const learningInsights = useGameStore(s => s.learningInsights);
  const setLearningInsights = useGameStore(state => state.setLearningInsights);
  const { currentLevelXp, xpNeeded } = xpProgressInLevel(xp);
  const levelProgress = xpNeeded > 0 ? Math.round((currentLevelXp / xpNeeded) * 100) : 0;
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Check if cached insights are stale (older than 1 hour)
  const insightsAge = learningInsights?.ts ? Date.now() - learningInsights.ts : Infinity;
  const hasInsights = learningInsights?.summary && insightsAge < 3600000;
  const hasEnoughData = (wrongAnswerLog || []).length >= 3;

  const handleFetchInsights = async () => {
    if (insightsLoading) return;
    setInsightsLoading(true);
    const result = await fetchLearningInsights({
      wrongAnswerLog: wrongAnswerLog || [],
      grade,
    });
    if (!result.error) {
      setLearningInsights(result);
    }
    setInsightsLoading(false);
  };

  // Streak calendar — last 28 days
  const today = new Date();
  const localDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const calendarDays = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    calendarDays.push({ key, day: d.getDate(), active: (streakDates || []).includes(key) });
  }

  // Daily challenge
  const todayKey = localDateKey(today);
  const challengeProgress = dailyChallenge?.date === todayKey ? dailyChallenge.progress : 0;
  const challengeTarget = dailyChallenge?.target || 5;
  const challengePct = Math.min(100, Math.round((challengeProgress / challengeTarget) * 100));

  return (
    <ScrollView style={[st.container, { paddingTop: insets.top }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Profile" subtitle="Your learning journey" emoji="👤" />
      <View style={st.content}>
        <FadeIn delay={0}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <LoopBuddy
              mood={dailyStreak > 0 ? 'celebrate' : 'idle'}
              size="lg"
              grade={grade}
              message={dailyStreak > 0 ? `${dailyStreak} day streak!` : 'Keep learning!'}
            />
          </View>
        </FadeIn>

        <FadeIn delay={50}>
          <GlassCard accent={COLORS.gold} glow>
            <View style={st.levelRow}>
              <View style={st.levelInfo}>
                <Text style={st.levelLabel}>LEVEL</Text>
                <Text style={st.levelValue}>{level}</Text>
                <Text style={st.xpText}>{xp} XP total · {xpNeeded - currentLevelXp} to next</Text>
              </View>
              <ProgressRing value={levelProgress} size={80} color={COLORS.gold} />
            </View>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={100}>
          <View style={st.statsRow}>
            <StatBox emoji="🎓" label="Grade" value={grade} color={GRADE_COLORS[grade]} />
            <StatBox emoji="🔥" label="Daily" value={dailyStreak} color={COLORS.wrong} />
            <StatBox emoji="⚡" label="Quiz" value={quizStreak} color={COLORS.gold} />
          </View>
        </FadeIn>

        <FadeIn delay={150}>
          <View style={st.statsRow}>
            <StatBox emoji="🏅" label="Badges" value={badges.length} color={COLORS.gold} />
            <StatBox emoji="🔁" label="Loops" value={(completedLoops || []).length} color={COLORS.primary} />
            <StatBox emoji="📚" label="Lessons" value={(completedLinks || []).length} color={COLORS.science} />
          </View>
        </FadeIn>

        {/* Daily Challenge */}
        <FadeIn delay={200}>
          <GlassCard accent={COLORS.science}>
            <Text style={st.sectionLabel}>📋 DAILY CHALLENGE</Text>
            <Text style={st.challengeText}>
              Complete {challengeTarget} quizzes today
            </Text>
            <View style={st.challengeBar}>
              <View style={[st.challengeFill, { width: `${challengePct}%` }]} />
            </View>
            <Text style={st.challengeProgress}>
              {challengeProgress}/{challengeTarget} {challengePct >= 100 ? '✅ Complete!' : ''}
            </Text>
          </GlassCard>
        </FadeIn>

        {/* Learning Insights — AI-powered pattern analysis */}
        <FadeIn delay={250}>
          <GlassCard accent={COLORS.primary}>
            <Text style={st.sectionLabel}>🧠 LEARNING INSIGHTS</Text>
            {hasInsights ? (
              <View>
                <Text style={st.insightsSummary}>{learningInsights.summary}</Text>
                {(learningInsights.patterns || []).map((p, i) => (
                  <View key={i} style={st.patternRow}>
                    <Text style={st.patternEmoji}>{p.emoji || '📌'}</Text>
                    <View style={st.patternContent}>
                      <Text style={st.patternTitle}>{p.title}</Text>
                      <Text style={st.patternDetail}>{p.detail}</Text>
                    </View>
                  </View>
                ))}
                {(learningInsights.tips || []).length > 0 && (
                  <View style={st.tipsBox}>
                    <Text style={st.tipsLabel}>💡 Tips:</Text>
                    {learningInsights.tips.map((tip, i) => (
                      <Text key={i} style={st.tipText}>• {tip}</Text>
                    ))}
                  </View>
                )}
                <Pressable style={st.refreshBtn} onPress={handleFetchInsights} disabled={insightsLoading}>
                  <Text style={st.refreshBtnText}>
                    {insightsLoading ? 'Analyzing...' : '🔄 Refresh Analysis'}
                  </Text>
                </Pressable>
              </View>
            ) : hasEnoughData ? (
              <View>
                <Text style={st.insightsPrompt}>
                  LoopBot can analyze your learning patterns and suggest ways to improve!
                </Text>
                <Pressable style={st.analyzeBtn} onPress={handleFetchInsights} disabled={insightsLoading}>
                  {insightsLoading ? (
                    <View style={st.analyzeBtnLoading}>
                      <ActivityIndicator size="small" color={COLORS.white} />
                      <Text style={st.analyzeBtnText}> Analyzing...</Text>
                    </View>
                  ) : (
                    <Text style={st.analyzeBtnText}>🤖 Analyze My Learning</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <Text style={st.insightsPrompt}>
                Complete a few more quizzes and LoopBot will analyze your learning patterns to help you improve! 📊
              </Text>
            )}
          </GlassCard>
        </FadeIn>

        {/* Streak Calendar */}
        <FadeIn delay={350}>
          <GlassCard accent={COLORS.wrong}>
            <Text style={st.sectionLabel}>📅 LAST 28 DAYS</Text>
            <View style={st.calendar}>
              {calendarDays.map(d => (
                <View
                  key={d.key}
                  style={[st.calDay, d.active && st.calDayActive]}>
                  <Text style={[st.calDayText, d.active && st.calDayTextActive]}>
                    {d.day}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={st.streakNote}>
              {dailyStreak > 0 ? `🔥 ${dailyStreak} day streak!` : 'Start your streak today!'}
            </Text>
          </GlassCard>
        </FadeIn>
      </View>
    </ScrollView>
  );
};

const StatBox = ({ emoji, label, value, color }) => (
  <View style={[st.statBox, { borderColor: `${color}35`, backgroundColor: `${color}08` }]}>
    <Text style={st.statEmoji}>{emoji}</Text>
    <Text style={[st.statValue, { color }]}>{value}</Text>
    <Text style={st.statLabel}>{label}</Text>
  </View>
);

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20 },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelInfo: { flex: 1 },
  levelLabel: {
    ...TYPE.xs,
    ...TYPE.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  levelValue: {
    ...TYPE.hero,
    ...TYPE.black,
    color: COLORS.gold,
  },
  xpText: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 18,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 26, marginBottom: 6 },
  statValue: {
    ...TYPE.h3,
    ...TYPE.extrabold,
  },
  statLabel: {
    ...TYPE.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  sectionLabel: {
    ...TYPE.xs,
    ...TYPE.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  challengeText: {
    ...TYPE.md,
    ...TYPE.semibold,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  challengeBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  challengeFill: {
    height: 8,
    backgroundColor: COLORS.science,
    borderRadius: 4,
  },
  challengeProgress: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  // Learning Insights
  insightsSummary: {
    ...TYPE.md,
    ...TYPE.semibold,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
  },
  insightsPrompt: {
    ...TYPE.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  patternRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  patternEmoji: { fontSize: 20, marginRight: 10, marginTop: 2 },
  patternContent: { flex: 1 },
  patternTitle: { ...TYPE.md, ...TYPE.bold, color: COLORS.primaryLight, marginBottom: 2 },
  patternDetail: { ...TYPE.sm, color: COLORS.textSecondary, lineHeight: 18 },
  tipsBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: `${COLORS.science}10`,
    borderWidth: 1.5,
    borderColor: `${COLORS.science}25`,
  },
  tipsLabel: { ...TYPE.sm, ...TYPE.bold, color: COLORS.science, marginBottom: 6 },
  tipText: { ...TYPE.sm, color: COLORS.textPrimary, lineHeight: 18, marginBottom: 4 },
  analyzeBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  analyzeBtnLoading: { flexDirection: 'row', alignItems: 'center' },
  analyzeBtnText: { ...TYPE.md, ...TYPE.bold, color: COLORS.white },
  refreshBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 8,
  },
  refreshBtnText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.textMuted },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  calDay: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayActive: {
    backgroundColor: `${COLORS.wrong}30`,
    borderWidth: 1.5,
    borderColor: COLORS.wrong,
  },
  calDayText: {
    ...TYPE.xs,
    ...TYPE.semibold,
    color: COLORS.textMuted,
  },
  calDayTextActive: {
    color: COLORS.wrong,
  },
  streakNote: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 10,
    textAlign: 'center',
  },
});
