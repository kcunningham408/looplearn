import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'looplearn-game-state';

// Debounce persist to avoid write storms
let persistTimer = null;
const debouncedPersist = (fn) => {
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(fn, 500);
};

// Exponential leveling: each level takes more XP
// Level 1: 0 XP, Level 2: 50 XP, Level 3: 125 XP, etc.
const xpForLevel = (lvl) => Math.floor(50 * Math.pow(lvl - 1, 1.5));
const getLevelFromXp = (totalXp) => {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= totalXp) lvl++;
  return lvl;
};
const xpProgressInLevel = (totalXp) => {
  const lvl = getLevelFromXp(totalXp);
  const current = xpForLevel(lvl);
  const next = xpForLevel(lvl + 1);
  return { level: lvl, currentLevelXp: totalXp - current, xpNeeded: next - current };
};

// Daily streak helpers
const getDateKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysBetween = (a, b) => Math.round(Math.abs(new Date(a) - new Date(b)) / 86400000);

const initialState = {
  grade: 1,
  xp: 0,
  level: 1,
  // Quiz streak (within a session)
  quizStreak: 0,
  // Daily streak
  dailyStreak: 0,
  lastActiveDate: null,
  streakDates: [],
  badges: [],
  completedLoops: [],
  completedLinks: [],
  quizHistory: [],
  // Detailed wrong answer log for adaptive learning
  wrongAnswerLog: [],
  // Cached AI learning insights
  learningInsights: { summary: null, patterns: [], ts: null },
  // Daily challenge
  dailyChallenge: { date: null, target: 5, progress: 0 },
  // Cached AI-generated questions for offline play
  cachedQuestions: [],
  // Hydration flag
  hydrated: false,
  // Onboarding
  hasOnboarded: false,
};

export { getLevelFromXp, xpProgressInLevel };

export const useGameStore = create((set, get) => ({
  ...initialState,

  setGrade: grade => {
    set({ grade, learningInsights: { summary: null, patterns: [], ts: null } });
    get().persistStore();
  },
  setOnboarded: () => {
    set({ hasOnboarded: true });
    get().persistStore();
  },

  addXp: amount => {
    const { xp } = get();
    const totalXp = xp + amount;
    const nextLevel = getLevelFromXp(totalXp);
    const prevLevel = getLevelFromXp(xp);
    set({ xp: totalXp, level: nextLevel });
    get().trackDailyActivity();
    get().persistStore();
    return nextLevel > prevLevel ? nextLevel : null; // returns new level if leveled up
  },

  addQuizStreak: () => {
    set(state => ({ quizStreak: state.quizStreak + 1 }));
    get().persistStore();
  },
  resetQuizStreak: () => {
    set({ quizStreak: 0 });
    get().persistStore();
  },

  trackDailyActivity: () => {
    const { lastActiveDate, dailyStreak, streakDates } = get();
    const today = getDateKey();
    if (lastActiveDate === today) return; // already tracked today

    let newStreak = 1;
    if (lastActiveDate) {
      const gap = daysBetween(lastActiveDate, today);
      if (gap === 1) newStreak = dailyStreak + 1;
      // gap > 1 means streak broken, reset to 1
    }

    const newDates = [...streakDates];
    if (!newDates.includes(today)) newDates.push(today);
    // Keep last 60 days only
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 60);
    const cutoffStr = getDateKey(cutoff);
    const trimmed = newDates.filter(d => d >= cutoffStr);

    set({ dailyStreak: newStreak, lastActiveDate: today, streakDates: trimmed });
    get().persistStore();
  },

  addBadge: badge => {
    set(state => ({ badges: [...new Set([...state.badges, badge])] }));
    get().persistStore();
  },

  completeLink: (linkId, score, total) => {
    const { completedLinks } = get();
    const existing = completedLinks.find(c => (typeof c === 'string' ? c : c.id) === linkId);
    if (existing) {
      // Update high score on retake
      if (typeof existing === 'object' && score > existing.score) {
        set({ completedLinks: completedLinks.map(c =>
          (typeof c === 'string' ? c : c.id) === linkId ? { ...c, score, total, ts: Date.now() } : c
        )});
        get().persistStore();
      }
      return;
    }
    set({ completedLinks: [...completedLinks, { id: linkId, score, total, ts: Date.now() }] });
    get().persistStore();
  },

  isLinkCompleted: (linkId) => {
    const { completedLinks } = get();
    return completedLinks.some(c => (typeof c === 'string' ? c : c.id) === linkId);
  },

  completeLoop: (loopId, subject) => {
    const { completedLoops } = get();
    const already = completedLoops.some(
      l => (typeof l === 'string' ? l : l.id) === loopId,
    );
    if (already) return;
    set({ completedLoops: [...completedLoops, { id: loopId, subject, ts: Date.now() }] });
    get().persistStore();
  },

  addQuizRecord: record => {
    set(state => ({
      quizHistory: [...state.quizHistory, { ...record, ts: Date.now() }].slice(-200),
    }));
    get().persistStore();
  },

  // Log a wrong answer with full context for adaptive learning
  logWrongAnswer: ({ question, yourAnswer, correctAnswer, subject, loop, linkId, linkTitle }) => {
    set(state => {
      const entry = { question, yourAnswer, correctAnswer, subject, loop, linkId, linkTitle, ts: Date.now() };
      // Keep last 200 entries to avoid unbounded growth
      const log = [...state.wrongAnswerLog, entry].slice(-200);
      return { wrongAnswerLog: log };
    });
    get().persistStore();
  },

  // Cache AI-generated learning insights
  setLearningInsights: (insights) => {
    set({ learningInsights: { ...insights, ts: Date.now() } });
    get().persistStore();
  },

  clearLearningInsights: () => {
    set({ learningInsights: { summary: null, patterns: [], ts: null }, wrongAnswerLog: [] });
    get().persistStore();
  },

  resetAllProgress: async () => {
    set({ ...initialState, hydrated: true, hasOnboarded: true });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  // Daily challenge
  updateDailyChallenge: () => {
    const { dailyChallenge } = get();
    const today = getDateKey();
    if (dailyChallenge.date !== today) {
      // New day — reset and count this as the first activity
      set({ dailyChallenge: { date: today, target: 5, progress: 1 } });
      get().persistStore();
      return;
    }
    set({ dailyChallenge: { ...dailyChallenge, progress: dailyChallenge.progress + 1 } });
    get().persistStore();
  },

  // Cache AI-generated questions for offline play (keep last 5 sets)
  cacheQuestions: (entry) => {
    const { cachedQuestions } = get();
    const updated = [...cachedQuestions, { ...entry, ts: Date.now() }].slice(-5);
    set({ cachedQuestions: updated });
    get().persistStore();
  },

  getCachedQuestions: (grade, subject) => {
    const { cachedQuestions } = get();
    return cachedQuestions.find(c => c.grade === grade && c.subject === subject);
  },

  // Check and award any new badges — returns array of newly earned badge IDs
  checkBadges: () => {
    const state = get();
    const { xp, quizStreak, level, completedLoops, completedLinks, badges, dailyStreak } = state;
    const earned = [...badges];

    const award = id => {
      if (!earned.includes(id)) earned.push(id);
    };

    // First quiz / link
    if (completedLinks.length > 0) award('first_quiz');

    // Quiz streak
    if (quizStreak >= 3) award('streak_3');
    if (quizStreak >= 5) award('streak_5');
    if (quizStreak >= 10) award('streak_10');

    // Daily streak
    if (dailyStreak >= 3) award('daily_3');
    if (dailyStreak >= 7) award('daily_7');

    // Level
    if (level >= 5) award('level_5');
    if (level >= 10) award('level_10');

    // XP
    if (xp >= 100) award('xp_100');
    if (xp >= 500) award('xp_500');

    // Loop completion
    if (completedLoops.length > 0) award('loop_complete');

    // Subject-specific (count completed loops by subject)
    const mathCount = completedLoops.filter(
      l => (typeof l === 'object' ? l.subject : null) === 'math',
    ).length;
    const scienceCount = completedLoops.filter(
      l => (typeof l === 'object' ? l.subject : null) === 'science',
    ).length;
    if (mathCount >= 3) award('math_explorer');
    if (scienceCount >= 3) award('science_explorer');

    // Perfect quiz
    const perfectQuizzes = state.quizHistory.filter(r => r.score === r.total);
    if (perfectQuizzes.length > 0) award('perfect_quiz');
    if (perfectQuizzes.length >= 5) award('perfect_five');

    const newlyEarned = earned.filter(b => !badges.includes(b));
    if (newlyEarned.length > 0) {
      set({ badges: earned });
      get().persistStore();
    }
    return newlyEarned;
  },

  persistStore: async () => {
    debouncedPersist(async () => {
      try {
        const full = get();
        // Exclude all action functions + hydrated flag — keep only data
        const { setGrade, setOnboarded, addXp, addQuizStreak,
          resetQuizStreak, trackDailyActivity, addBadge, completeLink,
          isLinkCompleted, completeLoop, addQuizRecord, logWrongAnswer,
          setLearningInsights, clearLearningInsights, resetAllProgress, updateDailyChallenge,
          cacheQuestions, getCachedQuestions,
          checkBadges, persistStore, hydrateStore, hydrated, ...state } = full;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.warn('Persist fail', error);
      }
    });
  },

  hydrateStore: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          ...data,
          completedLinks: data.completedLinks || [],
          completedLoops: data.completedLoops || [],
          quizHistory: data.quizHistory || [],
          wrongAnswerLog: data.wrongAnswerLog || [],
          learningInsights: data.learningInsights || { summary: null, patterns: [], ts: null },
          streakDates: data.streakDates || [],
          dailyChallenge: data.dailyChallenge || { date: null, target: 5, progress: 0 },
          cachedQuestions: data.cachedQuestions || [],
          hasOnboarded: data.hasOnboarded || false,
          level: data.xp != null ? getLevelFromXp(data.xp) : 1,
          hydrated: true,
        });
      } else {
        set({ hydrated: true });
      }
    } catch (error) {
      console.warn('Hydrate fail', error);
      set({ hydrated: true });
    }
  },
}));
