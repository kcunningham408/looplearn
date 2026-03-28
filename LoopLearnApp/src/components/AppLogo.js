import { Image, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

const logoSource = require('../../assets/icon.png');

/**
 * AppLogo — Brand mark used throughout the app.
 * Renders the LoopLearn app icon with optional text and tagline.
 *
 * Props:
 *  - size: 'xs' (24) | 'sm' (36) | 'md' (56) | 'lg' (80) | 'xl' (110)
 *  - showText: show "LoopLearn" text beside/below the icon
 *  - showTagline: show tagline text (only if showText is true)
 *  - layout: 'horizontal' | 'vertical'
 *  - light: use lighter text for dark backgrounds (default true)
 */
const SIZES = { xs: 24, sm: 36, md: 56, lg: 80, xl: 110 };
const RADII = { xs: 6, sm: 10, md: 16, lg: 22, xl: 28 };

export const AppLogo = ({
  size = 'md',
  showText = false,
  showTagline = false,
  layout = 'horizontal',
  style,
}) => {
  const dim = SIZES[size] || SIZES.md;
  const radius = RADII[size] || RADII.md;
  const isVert = layout === 'vertical';

  return (
    <View style={[st.wrapper, isVert ? st.vertical : st.horizontal, style]}>
      <View style={[st.logoContainer, { width: dim, height: dim, borderRadius: radius }]}>
        <Image
          source={logoSource}
          style={[st.logoImage, { width: dim, height: dim, borderRadius: radius }]}
          resizeMode="cover"
        />
        <View style={[st.logoShine, { borderRadius: radius }]} />
      </View>
      {showText && (
        <View style={[st.textBlock, isVert ? st.textVert : st.textHoriz]}>
          <Text style={[st.brandText, size === 'lg' || size === 'xl' ? st.brandLarge : null]}>
            LoopLearn
          </Text>
          {showTagline && (
            <Text style={st.tagline}>Learning is an adventure!</Text>
          )}
        </View>
      )}
    </View>
  );
};

/**
 * VibeCMDBadge — "Powered by VibeCMD" footer badge.
 */
export const VibeCMDBadge = ({ style }) => (
  <View style={[badgeSt.container, style]}>
    <View style={badgeSt.line} />
    <Text style={badgeSt.text}>
      Powered by <Text style={badgeSt.brand}>VibeCMD</Text>
    </Text>
    <View style={badgeSt.line} />
  </View>
);

const st = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  logoContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  logoBg: {
    ...StyleSheet.absoluteFillObject,
  },
  logoImage: {
    zIndex: 1,
  },
  logoShine: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  textBlock: {
    justifyContent: 'center',
  },
  textHoriz: {
    marginLeft: 12,
  },
  textVert: {
    alignItems: 'center',
    marginTop: 14,
  },
  brandText: {
    ...TYPE.h3,
    ...TYPE.black,
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandLarge: {
    ...TYPE.h1,
    letterSpacing: -1,
  },
  tagline: {
    ...TYPE.sm,
    color: COLORS.primaryLight,
    marginTop: 4,
  },
});

const badgeSt = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  line: {
    height: 1,
    flex: 1,
    maxWidth: 60,
    backgroundColor: COLORS.divider,
  },
  text: {
    ...TYPE.xs,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  brand: {
    ...TYPE.bold,
    color: COLORS.vibecmd,
  },
});
