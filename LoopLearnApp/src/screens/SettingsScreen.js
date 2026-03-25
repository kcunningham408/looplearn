import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FadeIn } from '../components/FadeIn';
import { GlassCard } from '../components/GlassCard';
import { ScreenHeader } from '../components/ScreenHeader';
import COLORS, { GRADE_COLORS } from '../config/colors';
import TYPE from '../config/typography';
import { SoundService } from '../services/SoundService';
import { useGameStore } from '../store/useGameStore';

const grades = [1, 2, 3, 4, 5, 6];
const GRADE_EMOJIS = { 1: '🌟', 2: '🔥', 3: '⚡', 4: '🚀', 5: '💎', 6: '👑' };

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const grade = useGameStore(state => state.grade);
  const setGrade = useGameStore(state => state.setGrade);
  const resetAllProgress = useGameStore(state => state.resetAllProgress);
  const clearLearningInsights = useGameStore(state => state.clearLearningInsights);
  const [soundOn, setSoundOn] = useState(SoundService.isEnabled());

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress',
      'This will erase all XP, badges, streaks, and quiz history. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset Everything', style: 'destructive', onPress: () => resetAllProgress() },
      ]
    );
  };

  const handleClearLearningData = () => {
    Alert.alert(
      'Clear Learning Data',
      'This will clear your wrong answer history and AI learning insights.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearLearningInsights() },
      ]
    );
  };

  return (
    <ScrollView style={[st.container, { paddingTop: insets.top }]} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title="Settings" subtitle="Customize your learning" emoji="⚙️" />
      <View style={st.content}>
        <FadeIn>
          <GlassCard>
            <Text style={st.label}>SELECT YOUR GRADE</Text>
            <View style={st.gradeRow}>
              {grades.map(g => {
                const color = GRADE_COLORS[g];
                const selected = grade === g;
                return (
                  <Pressable
                    key={g}
                    style={[
                      st.gradeBtn,
                      { borderColor: `${color}40` },
                      selected && { backgroundColor: `${color}25`, borderColor: color },
                    ]}
                    onPress={() => {
                      setGrade(g);
                    }}>
                    <Text style={{ fontSize: 16, marginBottom: 2 }}>{GRADE_EMOJIS[g]}</Text>
                    <Text style={[st.gradeText, selected && { color }]}>{g}</Text>
                  </Pressable>
                );
              })}
            </View>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={100}>
          <GlassCard>
            <Text style={st.label}>SOUND & HAPTICS</Text>
            <Pressable
              style={st.settingBtn}
              onPress={() => {
                const next = !soundOn;
                setSoundOn(next);
                SoundService.setEnabled(next);
                if (next) SoundService.play('tap');
              }}>
              <Text style={st.settingBtnText}>{soundOn ? '🔊 Sounds On' : '🔇 Sounds Off'}</Text>
              <Text style={st.settingBtnSub}>Tap to {soundOn ? 'mute' : 'unmute'} sound effects</Text>
            </Pressable>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={150}>
          <GlassCard accent={COLORS.primary}>
            <Text style={st.label}>PARENT AREA</Text>
            <Pressable
              style={st.settingBtn}
              onPress={() => navigation.navigate('ParentDashboard')}>
              <Text style={st.settingBtnText}>🔒 Parent Dashboard</Text>
              <Text style={st.settingBtnSub}>View progress reports & stats (PIN required)</Text>
            </Pressable>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={200}>
          <GlassCard>
            <Text style={st.label}>DATA & PRIVACY</Text>
            <Pressable style={st.settingBtn} onPress={handleClearLearningData}>
              <Text style={st.settingBtnText}>🧹 Clear Learning Data</Text>
              <Text style={st.settingBtnSub}>Resets wrong answer log & AI insights</Text>
            </Pressable>
            <Pressable style={[st.settingBtn, st.dangerBtn]} onPress={handleResetProgress}>
              <Text style={[st.settingBtnText, { color: COLORS.wrong }]}>🗑️ Reset All Progress</Text>
              <Text style={st.settingBtnSub}>Erase XP, badges, streaks, history</Text>
            </Pressable>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={300}>
          <GlassCard>
            <Text style={st.label}>ABOUT</Text>
            <Text style={st.about}>
              LoopLearn helps kids in Grades 1–6 learn Math and Science through
              bite-sized lessons and fun quizzes. Earn XP, unlock badges, and
              track your progress!
            </Text>
            <Text style={st.version}>Version 1.1.0 · Free</Text>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={400}>
          <Text style={st.note}>
            Progress is saved automatically on this device.
          </Text>
        </FadeIn>
      </View>
    </ScrollView>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20 },
  label: {
    ...TYPE.xs,
    ...TYPE.bold,
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  gradeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  gradeText: {
    ...TYPE.xl,
    ...TYPE.extrabold,
    color: COLORS.textSecondary,
  },
  about: {
    ...TYPE.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  version: {
    ...TYPE.sm,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  note: {
    ...TYPE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
  settingBtn: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  dangerBtn: {
    borderBottomWidth: 0,
  },
  settingBtnText: {
    ...TYPE.md,
    ...TYPE.bold,
    color: COLORS.textPrimary,
  },
  settingBtnSub: {
    ...TYPE.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
