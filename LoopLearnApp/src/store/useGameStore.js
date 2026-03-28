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

// Normalize legacy completedLinks/completedLoops entries to objects
const normalizeLink = (c) => typeof c === 'string' ? { id: c, score: 0, total: 0, ts: 0 } : c;
const normalizeLoop = (l) => typeof l === 'string' ? { id: l, subject: 'unknown', ts: 0 } : l;

const initialState = {
  grade: 1,
  xp: 0,
  level: 1,
  // Quiz streak — consecutive quizzes completed (not reset on single wrong answer)
  quizStreak: 0,
  bestQuizStreak: 0,
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
  // Cached AI explanations for wrong answers (avoid re-fetch)
  cachedExplanations: {},
  // Hydration flag
  hydrated: false,
  // Onboarding
  hasOnboarded: false,
  // Parent PIN — must be set by parent on first access
  parentPin: null,
  // AI practice session count
  aiPracticeCount: 0,
  // Total quizzes completed (for badges)
  totalQuizzesCompleted: 0,
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

  setParentPin: (pin) => {
    set({ parentPin: pin });
    get().persistStore();
  },

  addXp: amount => {
    const { xp } = get();
    const totalXp = xp + amount;
    const nextLevel = getLevelFromXp(totalXp);
    const prevLevel = getLevelFromXp(xp);
    set({ xp: totalXp, level: nextLevel });
    get().trackDailyActivity();
    get().checkBadges();
    get().persistStore();
    return nextLevel > prevLevel ? nextLevel : null;
  },

  // Quiz streak: incremented when a quiz is completed (any score)
  // Only reset when a quiz scores below 50%
  addQuizStreak: () => {
    const current = get().quizStreak + 1;
    const best = Math.max(current, get().bestQuizStreak);
    set({ quizStreak: current, bestQuizStreak: best });
    get().checkBadges();
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
    const links = completedLinks.map(normalizeLink);
    const existing = links.find(c => c.id === linkId);
    if (existing) {
      if (score > existing.score) {
        set({ completedLinks: links.map(c =>
          c.id === linkId ? { ...c, score, total, ts: Date.now() } : c
        )});
        get().checkBadges();
        get().persistStore();
      }
      return;
    }
    set({ completedLinks: [...links, { id: linkId, score, total, ts: Date.now() }] });
    get().checkBadges();
    get().persistStore();
  },

  isLinkCompleted: (linkId) => {
    const { completedLinks } = get();
    return completedLinks.some(c => normalizeLink(c).id === linkId);
  },

  getLinkScore: (linkId) => {
    const { completedLinks } = get();
    const link = completedLinks.find(c => normalizeLink(c).id === linkId);
    return link ? normalizeLink(link) : null;
  },

  completeLoop: (loopId, subject) => {
    const { completedLoops } = get();
    const loops = completedLoops.map(normalizeLoop);
    if (loops.some(l => l.id === loopId)) return;
    set({ completedLoops: [...loops, { id: loopId, subject, ts: Date.now() }] });
    get().checkBadges();
    get().persistStore();
  },

  addQuizRecord: record => {
    set(state => ({
      quizHistory: [...state.quizHistory, { ...record, ts: Date.now() }].slice(-500),
      totalQuizzesCompleted: (state.totalQuizzesCompleted || 0) + 1,
    }));
    get().persistStore();
  },

  incrementAiPractice: () => {
    set(state => ({ aiPracticeCount: (state.aiPracticeCount || 0) + 1 }));
    get().checkBadges();
    get().persistStore();
  },

  // Cache an AI explanation to avoid refetching
  cacheExplanation: (key, text) => {
    set(state => ({
      cachedExplanations: { ...state.cachedExplanations, [key]: { text, ts: Date.now() } },
    }));
    get().persistStore();
  },

  getCachedExplanation: (key) => {
    const cached = get().cachedExplanations?.[key];
    if (!cached) return null;
    // Expire after 24 hours
    if (Date.now() - cached.ts > 86400000) return null;
    return cached.text;
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
    const { xp, quizStreak, bestQuizStreak, level, completedLoops, completedLinks, badges, dailyStreak, aiPracticeCount, totalQuizzesCompleted } = state;
    const earned = [...badges];

    const award = id => {
      if (!earned.includes(id)) earned.push(id);
    };

    // First quiz / link
    if (completedLinks.length > 0) award('first_quiz');

    // Quiz streak (use best streak for permanent badges)
    const best = Math.max(quizStreak, bestQuizStreak || 0);
    if (best >= 3) award('streak_3');
    if (best >= 5) award('streak_5');
    if (best >= 10) award('streak_10');

    // Daily streak
    if (dailyStreak >= 3) award('daily_3');
    if (dailyStreak >= 7) award('daily_7');
    if (dailyStreak >= 14) award('daily_14');
    if (dailyStreak >= 30) award('daily_30');

    // Level
    if (level >= 5) award('level_5');
    if (level >= 10) award('level_10');
    if (level >= 20) award('level_20');

    // XP
    if (xp >= 100) award('xp_100');
    if (xp >= 500) award('xp_500');
    if (xp >= 1000) award('xp_1000');
    if (xp >= 5000) award('xp_5000');

    // Loop completion
    const loops = completedLoops.map(normalizeLoop);
    if (loops.length > 0) award('loop_complete');
    if (loops.length >= 5) award('loop_5');
    if (loops.length >= 10) award('loop_10');

    // Subject-specific
    const mathCount = loops.filter(l => l.subject === 'math').length;
    const scienceCount = loops.filter(l => l.subject === 'science').length;
    if (mathCount >= 3) award('math_explorer');
    if (mathCount >= 6) award('math_master');
    if (scienceCount >= 3) award('science_explorer');
    if (scienceCount >= 6) award('science_master');

    // Perfect quiz
    const perfectQuizzes = state.quizHistory.filter(r => r.score === r.total);
    if (perfectQuizzes.length > 0) award('perfect_quiz');
    if (perfectQuizzes.length >= 5) award('perfect_five');
    if (perfectQuizzes.length >= 20) award('perfect_twenty');

    // Total quizzes
    const totalQ = totalQuizzesCompleted || state.quizHistory.length;
    if (totalQ >= 10) award('quiz_10');
    if (totalQ >= 50) award('quiz_50');
    if (totalQ >= 100) award('quiz_100');

    // AI practice
    if ((aiPracticeCount || 0) >= 5) award('ai_master');
    if ((aiPracticeCount || 0) >= 20) award('ai_expert');

    // Lessons completed
    if (completedLinks.length >= 10) award('lessons_10');
    if (completedLinks.length >= 50) award('lessons_50');

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
        // Extract only serializable state (exclude functions and flags)
        const stateKeys = Object.keys(initialState).filter(k => k !== 'hydrated');
        const state = {};
        for (const key of stateKeys) {
          if (full[key] !== undefined) state[key] = full[key];
        }
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
        
        // Validate and sanitize data
        const validatedData = {
          grade: Math.min(6, Math.max(1, Number(data.grade) || 1)),
          xp: Math.max(0, Number(data.xp) || 0),
          level: Math.max(1, Number(data.level) || 1),
          quizStreak: Math.max(0, Number(data.quizStreak) || 0),
          bestQuizStreak: Math.max(0, Number(data.bestQuizStreak) || 0),
          dailyStreak: Math.max(0, Number(data.dailyStreak) || 0),
          lastActiveDate: typeof data.lastActiveDate === 'string' ? data.lastActiveDate : null,
          streakDates: Array.isArray(data.streakDates) ? data.streakDates.filter(d => typeof d === 'string') : [],
          badges: Array.isArray(data.badges) ? data.badges.filter(b => typeof b === 'string') : [],
          // Normalize all entries to objects on hydration
          completedLoops: Array.isArray(data.completedLoops) ? data.completedLoops.map(normalizeLoop) : [],
          completedLinks: Array.isArray(data.completedLinks) ? data.completedLinks.map(normalizeLink) : [],
          quizHistory: Array.isArray(data.quizHistory) ? data.quizHistory.filter(q => q && q.score != null && q.total != null).slice(-500) : [],
          wrongAnswerLog: Array.isArray(data.wrongAnswerLog) ? data.wrongAnswerLog.slice(-300) : [],
          learningInsights: data.learningInsights && typeof data.learningInsights === 'object' ? data.learningInsights : { summary: null, patterns: [], ts: null },
          dailyChallenge: data.dailyChallenge && typeof data.dailyChallenge === 'object' ? {
            date: typeof data.dailyChallenge.date === 'string' ? data.dailyChallenge.date : null,
            target: Math.max(1, Math.min(20, Number(data.dailyChallenge.target) || 5)),
            progress: Math.max(0, Number(data.dailyChallenge.progress) || 0),
          } : { date: null, target: 5, progress: 0 },
          cachedQuestions: [], // always start fresh — purge stale LLM-generated questions
          cachedExplanations: data.cachedExplanations && typeof data.cachedExplanations === 'object' ? data.cachedExplanations : {},
          hasOnboarded: Boolean(data.hasOnboarded),
          parentPin: typeof data.parentPin === 'string' ? data.parentPin : null,
          aiPracticeCount: Math.max(0, Number(data.aiPracticeCount) || 0),
          totalQuizzesCompleted: Math.max(0, Number(data.totalQuizzesCompleted) || 0),
        };
        
        set({
          ...validatedData,
          level: validatedData.xp > 0 ? getLevelFromXp(validatedData.xp) : 1,
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
