import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeIn } from '../components/FadeIn';
import { ScreenHeader } from '../components/ScreenHeader';
import { Sparkle } from '../components/Sparkle';
import COLORS, { BADGE_DEFS } from '../config/colors';
import TYPE from '../config/typography';
import { useGameStore } from '../store/useGameStore';

const allBadgeKeys = Object.keys(BADGE_DEFS);

// Returns { current, target } for progress toward each badge
const getBadgeProgress = (key, state) => {
  const { xp, quizStreak, level, completedLoops, completedLinks, dailyStreak, quizHistory } = state;
  const perfectCount = quizHistory.filter(r => r.score === r.total).length;
  const mathLoops = completedLoops.filter(l => (typeof l === 'object' ? l.subject : null) === 'math').length;
  const sciLoops = completedLoops.filter(l => (typeof l === 'object' ? l.subject : null) === 'science').length;
  switch (key) {
    case 'first_quiz': return { current: Math.min(completedLinks.length, 1), target: 1 };
    case 'streak_3': return { current: Math.min(quizStreak, 3), target: 3 };
    case 'streak_5': return { current: Math.min(quizStreak, 5), target: 5 };
    case 'streak_10': return { current: Math.min(quizStreak, 10), target: 10 };
    case 'daily_3': return { current: Math.min(dailyStreak, 3), target: 3 };
    case 'daily_7': return { current: Math.min(dailyStreak, 7), target: 7 };
    case 'perfect_quiz': return { current: Math.min(perfectCount, 1), target: 1 };
    case 'perfect_five': return { current: Math.min(perfectCount, 5), target: 5 };
    case 'loop_complete': return { current: Math.min(completedLoops.length, 1), target: 1 };
    case 'level_5': return { current: Math.min(level, 5), target: 5 };
    case 'level_10': return { current: Math.min(level, 10), target: 10 };
    case 'math_explorer': return { current: Math.min(mathLoops, 3), target: 3 };
    case 'science_explorer': return { current: Math.min(sciLoops, 3), target: 3 };
    case 'xp_100': return { current: Math.min(xp, 100), target: 100 };
    case 'xp_500': return { current: Math.min(xp, 500), target: 500 };
    default: return { current: 0, target: 1 };
  }
};

export const RewardsScreen = () => {
  const insets = useSafeAreaInsets();
  const badges = useGameStore(state => state.badges);
  const xp = useGameStore(s => s.xp);
  const quizStreak = useGameStore(s => s.quizStreak);
  const level = useGameStore(s => s.level);
  const completedLoops = useGameStore(s => s.completedLoops);
  const completedLinks = useGameStore(s => s.completedLinks);
  const dailyStreak = useGameStore(s => s.dailyStreak);
  const quizHistory = useGameStore(s => s.quizHistory);
  const storeState = { badges, xp, quizStreak, level, completedLoops, completedLinks, dailyStreak, quizHistory };

  return (
    <View style={[st.container, { paddingTop: insets.top }]}>
      <ScreenHeader
        title="Rewards"
        subtitle={`${badges.length} of ${allBadgeKeys.length} badges earned`}
        gradient={COLORS.goldGradient}
        emoji="🏆"
      />
      <FlatList
        data={allBadgeKeys}
        keyExtractor={item => item}
        numColumns={2}
        columnWrapperStyle={st.row}
        contentContainerStyle={st.list}
        renderItem={({ item, index }) => {
          const def = BADGE_DEFS[item];
          const earned = badges.includes(item);
          const { current, target } = getBadgeProgress(item, storeState);
          const pct = earned ? 1 : Math.min(current / target, 1);
          return (
            <FadeIn delay={index * 80}>
              <View style={[st.badge, earned && st.badgeEarned]}>
                <View>
                  <Text style={[st.badgeEmoji, !earned && st.locked]}>
                    {earned ? def.emoji : '🔒'}
                  </Text>
                  <Sparkle active={earned} color={COLORS.gold} size={24} />
                </View>
                <Text style={[st.badgeName, !earned && st.lockedText]}>
                  {def.name}
                </Text>
                <Text style={st.badgeDesc}>{def.description}</Text>
                {!earned && (
                  <View style={st.progressWrap}>
                    <View style={st.progressTrack}>
                      <View style={[st.progressFill, { width: `${pct * 100}%` }]} />
                    </View>
                    <Text style={st.progressLabel}>{current}/{target}</Text>
                  </View>
                )}
              </View>
            </FadeIn>
          );
        }}
      />
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 20, paddingBottom: 40 },
  row: { gap: 12, marginBottom: 12 },
  badge: {
    flex: 1,
    backgroundColor: COLORS.bgElevated,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 18,
    alignItems: 'center',
  },
  badgeEarned: {
    borderColor: `${COLORS.gold}50`,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  badgeEmoji: { fontSize: 44, marginBottom: 8 },
  locked: { opacity: 0.3 },
  badgeName: {
    ...TYPE.md,
    ...TYPE.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedText: { color: COLORS.textMuted },
  badgeDesc: {
    ...TYPE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  progressWrap: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    ...TYPE.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
