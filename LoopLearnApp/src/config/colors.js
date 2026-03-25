// LoopLearn — Bright & Fun Learning Theme for Kids
const COLORS = {
  // Rich dark backgrounds with depth
  bg: '#0F1029',
  bgElevated: '#1A1D42',
  bgCard: 'rgba(26, 29, 66, 0.85)',

  // Fun card surfaces
  cardMath: '#1E3A5F',
  cardScience: '#1E4D40',
  cardGold: '#3D3520',

  // Glass effects (brighter)
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassShine: 'rgba(255, 255, 255, 0.10)',

  // Primary brand (Bright Purple-Pink)
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  primaryGlow: 'rgba(139, 92, 246, 0.35)',
  primaryGradient: ['#8B5CF6', '#EC4899'],

  // Subject colors (VIVID)
  math: '#3B82F6',
  mathGlow: 'rgba(59, 130, 246, 0.3)',
  mathGradient: ['#3B82F6', '#6366F1'],
  mathCardBg: ['#1E3A5F', '#2D2B55'],

  science: '#10B981',
  scienceGlow: 'rgba(16, 185, 129, 0.3)',
  scienceGradient: ['#10B981', '#06B6D4'],
  scienceCardBg: ['#1A3D35', '#1E3545'],

  // XP / Rewards (warm gold)
  gold: '#FCD34D',
  goldGlow: 'rgba(252, 211, 77, 0.3)',
  goldGradient: ['#FCD34D', '#F59E0B'],

  // Feedback (brighter)
  correct: '#34D399',
  correctGlow: 'rgba(52, 211, 153, 0.25)',
  wrong: '#F87171',
  wrongGlow: 'rgba(248, 113, 113, 0.25)',

  // Text (brighter, crisper)
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.70)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textGhost: 'rgba(255, 255, 255, 0.15)',

  // Grade Colors (SUPER vibrant for kids)
  grade1: '#F472B6',   // Pink
  grade2: '#FB923C',   // Orange
  grade3: '#FACC15',   // Yellow
  grade4: '#34D399',   // Green
  grade5: '#60A5FA',   // Blue
  grade6: '#C084FC',   // Purple

  // Fun accent palette
  pink: '#EC4899',
  orange: '#F97316',
  cyan: '#06B6D4',
  lime: '#84CC16',
  rose: '#FB7185',
  amber: '#F59E0B',

  // Brand gradient (app icon / splash feel)
  brandGradient: ['#6366F1', '#8B5CF6', '#EC4899'],
  splashBg: '#0F1029',

  // Utility
  white: '#FFFFFF',
  divider: 'rgba(255, 255, 255, 0.10)',
  overlay: 'rgba(15, 16, 41, 0.92)',
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
  perfect_quiz: { name: 'Perfect Score', emoji: '💎', description: 'Get 100% on a quiz' },
  perfect_five: { name: 'Flawless Five', emoji: '✨', description: 'Get 5 perfect quizzes' },
  loop_complete: { name: 'Loop Master', emoji: '🔁', description: 'Complete a full loop' },
  level_5: { name: 'Rising Star', emoji: '⭐', description: 'Reach Level 5' },
  level_10: { name: 'Super Learner', emoji: '🚀', description: 'Reach Level 10' },
  math_explorer: { name: 'Math Explorer', emoji: '🧮', description: 'Complete 3 math loops' },
  science_explorer: { name: 'Science Explorer', emoji: '🧬', description: 'Complete 3 science loops' },
  xp_100: { name: 'Century Club', emoji: '💯', description: 'Earn 100 XP' },
  xp_500: { name: 'XP Machine', emoji: '🏆', description: 'Earn 500 XP' },
};

export default COLORS;
