import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import COLORS from '../config/colors';

export const GlassCard = ({ children, style, accent, glow }) => {
  const borderColor = accent ? `${accent}40` : COLORS.glassBorder;
  const glowStyle =
    glow && accent
      ? {
          shadowColor: accent,
          shadowOpacity: 0.35,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        }
      : {};

  return (
    <View style={[st.card, { borderColor }, glowStyle, style]}>
      {accent && (
        <LinearGradient
          colors={[`${accent}18`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View
        style={[
          st.shine,
          { backgroundColor: accent ? `${accent}30` : COLORS.glassShine },
        ]}
      />
      {children}
    </View>
  );
};

const st = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
});
