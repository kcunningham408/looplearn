import { Platform } from 'react-native';

// System font stack — clean, modern, consistent across platforms
const FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

const TYPE = {
  // Sizes (bumped for kid-friendly readability)
  xs: { fontSize: 11, fontFamily: FONT_FAMILY },
  sm: { fontSize: 13, fontFamily: FONT_FAMILY },
  md: { fontSize: 16, fontFamily: FONT_FAMILY },
  lg: { fontSize: 18, fontFamily: FONT_FAMILY },
  xl: { fontSize: 20, fontFamily: FONT_FAMILY },
  xxl: { fontSize: 24, fontFamily: FONT_FAMILY },
  h3: { fontSize: 26, fontFamily: FONT_FAMILY },
  h2: { fontSize: 30, fontFamily: FONT_FAMILY },
  h1: { fontSize: 34, fontFamily: FONT_FAMILY },
  hero: { fontSize: 46, fontFamily: FONT_FAMILY },
  mega: { fontSize: 56, fontFamily: FONT_FAMILY },

  // Weights
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semibold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extrabold: { fontWeight: '800' },
  black: { fontWeight: '900' },

  // Semantic presets for consistent branding
  screenTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  cardTitle: { fontSize: 18, fontWeight: '700' },
  cardBody: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
  brandName: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  caption: { fontSize: 12, fontWeight: '500' },
};

export default TYPE;
