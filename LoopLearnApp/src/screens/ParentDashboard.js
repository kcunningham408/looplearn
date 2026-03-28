import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo, VibeCMDBadge } from '../components/AppLogo';
import { GlassCard } from '../components/GlassCard';
import { ProgressRing } from '../components/ProgressRing';
import { ScreenHeader } from '../components/ScreenHeader';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import { useGameStore, xpProgressInLevel } from '../store/useGameStore';

export const ParentDashboard = () => {
  const insets = useSafeAreaInsets();
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const parentPin = useGameStore(s => s.parentPin);

  // If no PIN set, show setup. If locked, show PIN gate. Otherwise show content.
  if (!unlocked) {
    if (!parentPin) {
      return <PinSetup insets={insets} onComplete={() => setUnlocked(true)} />;
    }
    return <PinGate pinInput={pinInput} setPinInput={setPinInput} onUnlock={() => setUnlocked(true)} insets={insets} />;
  }

  return <ParentContent insets={insets} onLock={() => { setUnlocked(false); setPinInput(''); }} />;
};

// First-time PIN setup
const PinSetup = ({ insets, onComplete }) => {
  const setParentPin = useGameStore(s => s.setParentPin);
  const [step, setStep] = useState('create'); // 'create' | 'confirm'
  const [firstPin, setFirstPin] = useState('');
  const [pinInput, setPinInput] = useState('');

  const handleKeyPress = (key) => {
    if (key === 'del') {
      setPinInput(p => p.slice(0, -1));
      return;
    }
    if (pinInput.length >= 4) return;
    const next = pinInput + String(key);
    setPinInput(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (step === 'create') {
          setFirstPin(next);
          setPinInput('');
          setStep('confirm');
        } else {
          if (next === firstPin) {
            setParentPin(next);
            onComplete();
          } else {
            Alert.alert('PINs Don\'t Match', 'Please try again.');
            setPinInput('');
            setStep('create');
            setFirstPin('');
          }
        }
      }, 200);
    }
  };

  return (
    <View style={[st.pinContainer, { paddingTop: insets.top + 40 }]}>
      <AppLogo size="md" style={{ marginBottom: 24 }} />
      <Text style={st.pinEmoji}>🔐</Text>
      <Text style={st.pinTitle}>Set Up Parent PIN</Text>
      <Text style={st.pinSubtitle}>
        {step === 'create' ? 'Create a 4-digit PIN' : 'Confirm your PIN'}
      </Text>

      <View style={st.pinDots}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[st.pinDot, pinInput.length > i && st.pinDotFilled]} />
        ))}
      </View>

      <View style={st.pinPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => {
          if (key === null) return <View key={i} style={st.pinKey} />;
          return (
            <Pressable
              key={i}
              style={({ pressed }) => [st.pinKey, pressed && st.pinKeyPressed]}
              onPress={() => handleKeyPress(key)}
              accessibilityRole="button"
              accessibilityLabel={key === 'del' ? 'Delete' : `${key}`}
            >
              <Text style={st.pinKeyText}>{key === 'del' ? '⌫' : key}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// PIN entry screen — kids can't get past this
const PinGate = ({ pinInput, setPinInput, onUnlock, insets }) => {
  const parentPin = useGameStore(s => s.parentPin);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  
  const isLocked = Date.now() < lockedUntil;

  return (
    <View style={[st.pinContainer, { paddingTop: insets.top + 40 }]}>
      <AppLogo size="md" style={{ marginBottom: 24 }} />
      <Text style={st.pinEmoji}>🔒</Text>
      <Text style={st.pinTitle}>Parent Area</Text>
      <Text style={st.pinSubtitle}>
        {isLocked ? `Too many attempts. Try again soon.` : 'Enter PIN to continue'}
      </Text>

      <View style={st.pinDots}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[st.pinDot, pinInput.length > i && st.pinDotFilled]}
          />
        ))}
      </View>

      <View style={st.pinPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'].map((key, i) => {
          if (key === null) return <View key={i} style={st.pinKey} />;
          return (
            <Pressable
              key={i}
              style={({ pressed }) => [st.pinKey, pressed && st.pinKeyPressed]}
              disabled={isLocked}
              onPress={() => {
                if (key === 'del') {
                  setPinInput(p => p.slice(0, -1));
                } else if (pinInput.length < 4) {
                  const next = pinInput + String(key);
                  setPinInput(next);
                  if (next.length === 4) {
                    setTimeout(() => {
                      if (next === parentPin) {
                        setAttempts(0);
                        onUnlock();
                      } else {
                        const newAttempts = attempts + 1;
                        setAttempts(newAttempts);
                        if (newAttempts >= 5) {
                          setLockedUntil(Date.now() + 60000);
                          Alert.alert('Too Many Attempts', 'Please wait 1 minute before trying again.');
                        } else {
                          Alert.alert('Wrong PIN', 'Ask a parent for the PIN code.');
                        }
                        setPinInput('');
                      }
                    }, 200);
                  }
                }
              }}
              accessibilityRole="button"
              accessibilityLabel={key === 'del' ? 'Delete' : `${key}`}
            >
              <Text style={st.pinKeyText}>
                {key === 'del' ? '⌫' : key}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// Actual parent content
const ParentContent = ({ insets, onLock }) => {
  const grade = useGameStore(s => s.grade);
  const xp = useGameStore(s => s.xp);
  const level = useGameStore(s => s.level);
  const dailyStreak = useGameStore(s => s.dailyStreak);
  const quizStreak = useGameStore(s => s.quizStreak);
  const badges = useGameStore(s => s.badges);
  const completedLoops = useGameStore(s => s.completedLoops);
  const completedLinks = useGameStore(s => s.completedLinks);
  const quizHistory = useGameStore(s => s.quizHistory);
  const wrongAnswerLog = useGameStore(s => s.wrongAnswerLog);
  const { currentLevelXp, xpNeeded } = xpProgressInLevel(xp);
  const levelProgress = xpNeeded > 0 ? Math.round((currentLevelXp / xpNeeded) * 100) : 0;

  // Calculate stats
  const totalQuizzes = quizHistory.length;
  const avgScore = totalQuizzes > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / totalQuizzes)
    : 0;
  const perfectQuizzes = quizHistory.filter(r => r.score === r.total).length;
  const totalWrong = (wrongAnswerLog || []).length;

  // Strength/weakness analysis
  const subjectBreakdown = {};
  quizHistory.forEach(q => {
    const key = q.subject || 'unknown';
    if (!subjectBreakdown[key]) subjectBreakdown[key] = { correct: 0, total: 0 };
    subjectBreakdown[key].correct += q.score;
    subjectBreakdown[key].total += q.total;
  });

  // Time analysis — group by date
  const activityByDate = {};
  quizHistory.forEach(q => {
    const d = new Date(q.ts);
    const key = `${d.getMonth() + 1}/${d.getDate()}`;
    activityByDate[key] = (activityByDate[key] || 0) + 1;
  });
  const recentDays = Object.entries(activityByDate).slice(-7);

  return (
    <ScrollView style={[st.content, { paddingTop: insets.top }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Parent Dashboard" subtitle="Progress Report" emoji="👨‍👩‍👧" gradient={['#6366F1', '#8B5CF6']} />

      <View style={st.pad}>
        {/* Overview */}
        <GlassCard accent={COLORS.primary}>
          <Text style={st.secLabel}>📊 OVERVIEW</Text>
          <View style={st.overviewRow}>
            <View style={st.overviewStat}>
              <Text style={st.overviewValue}>{level}</Text>
              <Text style={st.overviewLabel}>Level</Text>
            </View>
            <ProgressRing value={levelProgress} size={70} color={COLORS.gold} />
            <View style={st.overviewStat}>
              <Text style={st.overviewValue}>{xp}</Text>
              <Text style={st.overviewLabel}>Total XP</Text>
            </View>
          </View>
          <View style={st.infoRow}>
            <InfoPill label="Grade" value={grade} color={GRADE_COLORS[grade]} />
            <InfoPill label="Streak" value={`${dailyStreak}d`} color={COLORS.wrong} />
            <InfoPill label="Badges" value={`${badges.length}/16`} color={COLORS.gold} />
          </View>
        </GlassCard>

        {/* Performance */}
        <GlassCard accent={COLORS.science}>
          <Text style={st.secLabel}>📈 PERFORMANCE</Text>
          <View style={st.perfGrid}>
            <PerfCard label="Total Quizzes" value={totalQuizzes} />
            <PerfCard label="Avg Score" value={`${avgScore}%`} />
            <PerfCard label="Perfect Scores" value={perfectQuizzes} />
            <PerfCard label="Lessons Done" value={(completedLinks || []).length} />
            <PerfCard label="Loops Done" value={(completedLoops || []).length} />
            <PerfCard label="Wrong Answers" value={totalWrong} />
          </View>
        </GlassCard>

        {/* Subject Breakdown */}
        {Object.keys(subjectBreakdown).length > 0 && (
          <GlassCard accent={COLORS.math}>
            <Text style={st.secLabel}>📐 SUBJECT BREAKDOWN</Text>
            {Object.entries(subjectBreakdown).map(([subj, data]) => {
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              return (
                <View key={subj} style={st.subjectRow}>
                  <Text style={st.subjectName}>{subj === 'math' ? '🔢 Math' : '🔬 Science'}</Text>
                  <View style={st.subjectBar}>
                    <View style={[st.subjectFill, { width: `${pct}%`, backgroundColor: subj === 'math' ? COLORS.math : COLORS.science }]} />
                  </View>
                  <Text style={st.subjectPct}>{pct}%</Text>
                </View>
              );
            })}
          </GlassCard>
        )}

        {/* Activity Log */}
        {recentDays.length > 0 && (
          <GlassCard accent={COLORS.gold}>
            <Text style={st.secLabel}>📅 RECENT ACTIVITY</Text>
            <View style={st.activityRow}>
              {recentDays.map(([date, count]) => (
                <View key={date} style={st.activityDay}>
                  <View style={[st.activityBar, { height: Math.min(count * 12, 60) }]} />
                  <Text style={st.activityLabel}>{date}</Text>
                  <Text style={st.activityCount}>{count}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        )}

        {/* Lock button */}
        <Pressable style={st.lockBtn} onPress={onLock}>
          <Text style={st.lockBtnText}>🔒 Lock Parent Area</Text>
        </Pressable>
        <VibeCMDBadge style={{ marginTop: 10 }} />
      </View>
    </ScrollView>
  );
};

const InfoPill = ({ label, value, color }) => (
  <View style={[st.pill, { borderColor: `${color}40`, backgroundColor: `${color}10` }]}>
    <Text style={[st.pillValue, { color }]}>{value}</Text>
    <Text style={st.pillLabel}>{label}</Text>
  </View>
);

const PerfCard = ({ label, value }) => (
  <View style={st.perfCard}>
    <Text style={st.perfValue}>{value}</Text>
    <Text style={st.perfLabel}>{label}</Text>
  </View>
);

const st = StyleSheet.create({
  pinContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  pinEmoji: { fontSize: 60, marginBottom: 16 },
  pinTitle: { ...TYPE.h2, ...TYPE.extrabold, color: COLORS.textPrimary, marginBottom: 6 },
  pinSubtitle: { ...TYPE.md, color: COLORS.textSecondary, marginBottom: 30 },
  pinDots: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pinPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    justifyContent: 'center',
    gap: 12,
  },
  pinKey: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pinKeyPressed: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    transform: [{ scale: 0.92 }],
  },
  pinKeyText: {
    ...TYPE.h3,
    ...TYPE.bold,
    color: COLORS.textPrimary,
  },
  content: { flex: 1, backgroundColor: COLORS.bg },
  pad: { padding: 20 },
  secLabel: {
    ...TYPE.xs,
    ...TYPE.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overviewStat: { alignItems: 'center' },
  overviewValue: { ...TYPE.h2, ...TYPE.black, color: COLORS.textPrimary },
  overviewLabel: { ...TYPE.xs, color: COLORS.textMuted, marginTop: 2 },
  infoRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  pill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  pillValue: { ...TYPE.lg, ...TYPE.extrabold },
  pillLabel: { ...TYPE.xs, color: COLORS.textMuted, marginTop: 2 },
  perfGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  perfCard: {
    width: '30%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  perfValue: { ...TYPE.xl, ...TYPE.extrabold, color: COLORS.textPrimary, marginBottom: 2 },
  perfLabel: { ...TYPE.xs, color: COLORS.textMuted, textAlign: 'center' },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectName: { ...TYPE.sm, ...TYPE.bold, color: COLORS.textPrimary, width: 90 },
  subjectBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  subjectFill: { height: 10, borderRadius: 5 },
  subjectPct: { ...TYPE.sm, ...TYPE.bold, color: COLORS.textSecondary, width: 40, textAlign: 'right' },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 80,
  },
  activityDay: { alignItems: 'center' },
  activityBar: {
    width: 20,
    backgroundColor: COLORS.gold,
    borderRadius: 4,
    marginBottom: 4,
    minHeight: 4,
  },
  activityLabel: { ...TYPE.xs, color: COLORS.textMuted },
  activityCount: { ...TYPE.xs, ...TYPE.bold, color: COLORS.textSecondary },
  lockBtn: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
  },
  lockBtnText: { ...TYPE.md, ...TYPE.bold, color: COLORS.textSecondary },
});
