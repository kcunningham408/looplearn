import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import COLORS from '../config/colors';

export const GlassCard = ({ children, style, accent, glow, noPad }) => {
  const borderColor = accent ? `${accent}35` : COLORS.glassBorder;
  const glowStyle =
    glow && accent
      ? {
          shadowColor: accent,
          shadowOpacity: 0.30,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 12,
        }
      : {};

  return (
    <View style={[st.card, { borderColor }, glowStyle, noPad && { padding: 0 }, style]}>
      {/* Subtle gradient fill */}
      <LinearGradient
        colors={accent ? [`${accent}12`, `${accent}04`, 'transparent'] : [COLORS.glassShimmer, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* Top shine highlight */}
      <View
        style={[
          st.shine,
          { backgroundColor: accent ? `${accent}25` : COLORS.glassShine },
        ]}
      />
      {/* Inner border light effect */}
      <View style={st.innerBorder} />
      {children}
    </View>
  );
};

const st = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
});
