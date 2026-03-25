import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import COLORS from '../config/colors';

/**
 * Subtle ambient glow background — sits behind main content.
 * Gives depth without being distracting.
 */
export const BackgroundGlow = ({ subject, children, style }) => {
  const glowColor = subject === 'math'
    ? 'rgba(59, 130, 246, 0.06)'
    : subject === 'science'
      ? 'rgba(16, 185, 129, 0.06)'
      : 'rgba(139, 92, 246, 0.06)';

  return (
    <View style={[st.container, style]}>
      <LinearGradient
        colors={[glowColor, 'transparent', 'transparent']}
        style={st.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(139, 92, 246, 0.03)']}
        style={st.bottomGlow}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {children}
    </View>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 300 },
  bottomGlow: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200 },
});
