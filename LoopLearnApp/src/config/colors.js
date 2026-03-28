// LoopLearn — Theme matched to app icon (cyan→blue→purple→pink gradient)
const COLORS = {
  // Deep layered backgrounds with rich depth
  bg: '#080A1A',
  bgElevated: '#0F1230',
  bgCard: 'rgba(15, 18, 48, 0.90)',
  bgSurface: '#131640',
  bgModal: 'rgba(8, 10, 26, 0.96)',

  // Fun card surfaces
  cardMath: '#0E2550',
  cardScience: '#0A3540',
  cardGold: '#2D2510',

  // Glass effects (premium frosted)
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderLight: 'rgba(255, 255, 255, 0.20)',
  glassShine: 'rgba(255, 255, 255, 0.08)',
  glassShimmer: 'rgba(255, 255, 255, 0.04)',

  // Primary brand — matches icon center (purple-blue)
  primary: '#7B6CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6366F1',
  primaryGlow: 'rgba(123, 108, 246, 0.35)',
  primaryGradient: ['#06B6D4', '#6366F1', '#EC4899'],
  primarySoft: 'rgba(123, 108, 246, 0.12)',

  // Subject colors — matched to icon dots
  math: '#3B82F6',
  mathGlow: 'rgba(59, 130, 246, 0.3)',
  mathGradient: ['#06B6D4', '#6366F1'],
  mathCardBg: ['#0E2550', '#151A55'],

  science: '#10B981',
  scienceGlow: 'rgba(16, 185, 129, 0.3)',
  scienceGradient: ['#10B981', '#06B6D4'],
  scienceCardBg: ['#0A3540', '#0E2A45'],

  // XP / Rewards — warm orange from icon dot
  gold: '#FCD34D',
  goldGlow: 'rgba(252, 211, 77, 0.3)',
  goldGradient: ['#FCD34D', '#FB923C'],
  goldSoft: 'rgba(252, 211, 77, 0.10)',

  // Feedback (brighter with richer glows)
  correct: '#34D399',
  correctGlow: 'rgba(52, 211, 153, 0.25)',
  correctSoft: 'rgba(52, 211, 153, 0.10)',
  wrong: '#F87171',
  wrongGlow: 'rgba(248, 113, 113, 0.25)',
  wrongSoft: 'rgba(248, 113, 113, 0.10)',

  // Text (crisp with better hierarchy)
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.72)',
  textMuted: 'rgba(255, 255, 255, 0.42)',
  textGhost: 'rgba(255, 255, 255, 0.14)',

  // Grade Colors (SUPER vibrant for kids — icon palette inspired)
  grade1: '#F472B6',   // Pink (icon bottom)
  grade2: '#FB923C',   // Orange (icon dot)
  grade3: '#FCD34D',   // Gold
  grade4: '#10B981',   // Green (icon dot)
  grade5: '#06B6D4',   // Cyan (icon top)
  grade6: '#8B5CF6',   // Purple (icon dot)

  // Fun accent palette — icon-derived
  pink: '#EC4899',
  orange: '#FB923C',
  cyan: '#06B6D4',
  lime: '#84CC16',
  rose: '#FB7185',
  amber: '#F59E0B',
  indigo: '#6366F1',

  // Brand gradient — matches icon background exactly: cyan→blue→purple→pink
  brandGradient: ['#06B6D4', '#6366F1', '#EC4899'],
  brandGradientVert: ['#06B6D4', '#6366F1', '#8B5CF6', '#EC4899'],
  splashBg: '#080A1A',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  divider: 'rgba(255, 255, 255, 0.08)',
  overlay: 'rgba(8, 10, 26, 0.94)',
  
  // VibeCMD branding
  vibecmd: '#A78BFA',
  vibecmdGradient: ['#6366F1', '#8B5CF6'],
};

export const GRADE_COLORS = {
  1: COLORS.grade1,
  2: COLORS.grade2,
  3: COLORS.grade3,
  4: COLORS.grade4,
  5: COLORS.grade5,
  6: COLORS.grade6,
};

export const SUBJECT_ICONS = {
  math: '🔢',
  science: '🔬',
};

export const BADGE_DEFS = {
  first_quiz: { name: 'First Quiz', emoji: '🌟', description: 'Complete your first quiz' },
  streak_3: { name: 'On Fire', emoji: '🔥', description: '3 correct in a row' },
  streak_5: { name: 'Unstoppable', emoji: '⚡', description: '5 correct in a row' },
  streak_10: { name: 'Legendary', emoji: '👑', description: '10 correct in a row' },
  daily_3: { name: '3-Day Streak', emoji: '📅', description: 'Learn 3 days in a row' },
  daily_7: { name: 'Week Warrior', emoji: '🗓️', description: 'Learn 7 days in a row' },
  daily_14: { name: 'Two-Week Hero', emoji: '🏅', description: 'Learn 14 days in a row' },
  daily_30: { name: 'Monthly Master', emoji: '🎖️', description: 'Learn 30 days in a row' },
  perfect_quiz: { name: 'Perfect Score', emoji: '💎', description: 'Get 100% on a quiz' },
  perfect_five: { name: 'Flawless Five', emoji: '✨', description: 'Get 5 perfect quizzes' },
  perfect_twenty: { name: 'Perfection Pro', emoji: '🌈', description: 'Get 20 perfect quizzes' },
  loop_complete: { name: 'Loop Master', emoji: '🔁', description: 'Complete a full loop' },
  loop_5: { name: 'Loop Legend', emoji: '🔄', description: 'Complete 5 loops' },
  loop_10: { name: 'Loop Champion', emoji: '🏆', description: 'Complete 10 loops' },
  level_5: { name: 'Rising Star', emoji: '⭐', description: 'Reach Level 5' },
  level_10: { name: 'Super Learner', emoji: '🚀', description: 'Reach Level 10' },
  level_20: { name: 'Knowledge King', emoji: '🎓', description: 'Reach Level 20' },
  math_explorer: { name: 'Math Explorer', emoji: '🧮', description: 'Complete 3 math loops' },
  math_master: { name: 'Math Master', emoji: '📐', description: 'Complete 6 math loops' },
  science_explorer: { name: 'Science Explorer', emoji: '🧬', description: 'Complete 3 science loops' },
  science_master: { name: 'Science Whiz', emoji: '🔭', description: 'Complete 6 science loops' },
  xp_100: { name: 'Century Club', emoji: '💯', description: 'Earn 100 XP' },
  xp_500: { name: 'XP Machine', emoji: '🏆', description: 'Earn 500 XP' },
  xp_1000: { name: 'XP Champion', emoji: '🥇', description: 'Earn 1,000 XP' },
  xp_5000: { name: 'XP Legend', emoji: '💰', description: 'Earn 5,000 XP' },
  quiz_10: { name: 'Quiz Starter', emoji: '📋', description: 'Complete 10 quizzes' },
  quiz_50: { name: 'Quiz Pro', emoji: '📝', description: 'Complete 50 quizzes' },
  quiz_100: { name: 'Quiz Master', emoji: '🎯', description: 'Complete 100 quizzes' },
  ai_master: { name: 'AI Explorer', emoji: '🤖', description: 'Complete 5 AI practice sessions' },
  ai_expert: { name: 'AI Expert', emoji: '🧠', description: 'Complete 20 AI practice sessions' },
  lessons_10: { name: 'Bookworm', emoji: '📚', description: 'Complete 10 lessons' },
  lessons_50: { name: 'Scholar', emoji: '🎒', description: 'Complete 50 lessons' },
};

// App metadata
export const APP_VERSION = '2.0.0';
export const APP_NAME = 'LoopLearn';
export const BRAND_NAME = 'VibeCMD';

export default COLORS;
