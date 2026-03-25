import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

export const ScreenHeader = ({ title, subtitle, gradient = COLORS.primaryGradient, emoji }) => (
  <View style={st.container}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={st.gradientBg}
    />
    <View style={st.content}>
      {emoji && <Text style={st.emoji}>{emoji}</Text>}
      <View>
        <Text style={st.title}>{title}</Text>
        {subtitle ? <Text style={st.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  </View>
);

const st = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 4,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 18,
  },
  emoji: { fontSize: 32, marginRight: 14 },
  title: {
    ...TYPE.h2,
    ...TYPE.extrabold,
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
});
