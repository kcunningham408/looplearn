import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

export const LinkCard = ({ link, completed, scoreData, onPress, index }) => {
  const scoreStars = completed && scoreData
    ? scoreData.score === scoreData.total ? '⭐⭐⭐'
    : scoreData.score >= scoreData.total * 0.7 ? '⭐⭐'
    : '⭐'
    : null;

  return (
    <Pressable
      style={({ pressed }) => [st.card, completed && st.cardCompleted, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
      onPress={onPress}>
      <View style={st.row}>
        <View style={[st.iconWrap, completed && st.iconCompleted]}>
          <Text style={st.emoji}>{completed ? '✅' : '📖'}</Text>
        </View>
        <View style={st.textWrap}>
          <Text style={st.title}>{link.title}</Text>
          <Text style={st.subtitle}>
            {completed && scoreData
              ? `${scoreStars} ${scoreData.score}/${scoreData.total} correct`
              : `${link.quiz?.length || 0} question${link.quiz?.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      </View>
    </Pressable>
  );
};

const st = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 16,
    marginBottom: 10,
  },
  cardCompleted: {
    borderColor: `${COLORS.correct}30`,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconCompleted: {
    backgroundColor: `${COLORS.correct}18`,
  },
  emoji: { fontSize: 20 },
  textWrap: { flex: 1 },
  title: {
    ...TYPE.lg,
    ...TYPE.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
