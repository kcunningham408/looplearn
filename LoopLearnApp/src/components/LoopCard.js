import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

// Fun emoji per loop index so each card feels unique
const LOOP_EMOJIS = ['🚀', '⭐', '🎯', '🧩', '🌈', '🎨', '💡', '🔮', '🎪', '🏆', '🎸', '🦄'];

export const LoopCard = memo(function LoopCard({ loop, progress = 0, accent, onPress, index = 0 }) {
  const color = accent || COLORS.primary;
  const pct = Math.min(100, Math.max(0, progress));
  const emoji = LOOP_EMOJIS[index % LOOP_EMOJIS.length];
  const isMath = color === COLORS.math;
  const gradient = isMath ? COLORS.mathCardBg : COLORS.scienceCardBg;

  return (
    <Pressable
      style={({ pressed }) => [st.card, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${loop.title}, ${pct === 100 ? 'completed' : `${pct}% complete`}, ${loop.links?.length || 0} lessons`}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={st.gradient}
      />
      <View style={[st.accentStripe, { backgroundColor: color }]} />
      <View style={st.topRow}>
        <View style={[st.emojiCircle, { backgroundColor: `${color}25` }]}>
          <Text style={st.emoji}>{pct === 100 ? '✅' : emoji}</Text>
        </View>
        <View style={st.titleWrap}>
          <Text style={st.title}>{loop.title}</Text>
          <Text style={st.links}>
            {loop.links?.length || 0} lesson{loop.links?.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      {/* Progress bar */}
      <View style={st.barTrack}>
        <View style={[st.barFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[st.pct, { color }]}>
        {pct === 100 ? '🎉 Complete!' : `${pct}% complete`}
      </Text>
    </Pressable>
  );
});

const st = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  accentStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: { fontSize: 24 },
  titleWrap: { flex: 1 },
  title: {
    ...TYPE.lg,
    ...TYPE.bold,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  links: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    borderRadius: 4,
  },
  pct: {
    ...TYPE.sm,
    ...TYPE.semibold,
    marginTop: 8,
    textAlign: 'right',
  },
});
