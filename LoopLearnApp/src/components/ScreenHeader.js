import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';
import { AppLogo } from './AppLogo';

export const ScreenHeader = ({ title, subtitle, gradient = COLORS.primaryGradient, emoji, showLogo }) => (
  <View style={st.container}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={st.gradientBg}
    />
    <View style={st.topRow}>
      {showLogo && <AppLogo size="xs" style={st.logo} />}
    </View>
    <View style={st.content}>
      {emoji && <Text style={st.emoji}>{emoji}</Text>}
      <View style={{ flex: 1 }}>
        <Text style={st.title}>{title}</Text>
        {subtitle ? <Text style={st.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  </View>
);

const st = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 4,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  logo: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  emoji: { fontSize: 32, marginRight: 14 },
  title: {
    ...TYPE.screenTitle,
    color: COLORS.textPrimary,
  },
  subtitle: {
    ...TYPE.sm,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
});
