import { Platform } from 'react-native';

// In dev, iOS simulator uses localhost, Android emulator uses 10.0.2.2, web uses localhost
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BASE_URL = __DEV__
  ? `http://${DEV_HOST}:4000`
  : 'https://looplearn-oe8f.onrender.com';

const TIMEOUT_MS = 20000;
const MAX_RETRIES = 2;

const fetchWithTimeout = (url, options) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
};

// Retry wrapper with exponential backoff
const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);
      if (response.ok || attempt === retries) return response;
      // Retry on 5xx errors only
      if (response.status < 500) return response;
    } catch (error) {
      if (attempt === retries) throw error;
      if (error.name === 'AbortError' && attempt === retries) throw error;
    }
    // Exponential backoff: 500ms, 1500ms
    await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt)));
  }
};

export const askAiTeacher = async ({ message, grade, subject, context }) => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/api/ai-teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, grade, subject, context }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Something went wrong.' };
    }

    return { reply: data.reply };
  } catch (error) {
    if (error.name === 'AbortError') return { error: 'Request timed out. Try again!' };
    return { error: 'Cannot reach AI Teacher. Check your connection!' };
  }
};

export const explainMistake = async ({ question, yourAnswer, correctAnswer, grade, subject, linkTitle }) => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/api/explain-mistake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, yourAnswer, correctAnswer, grade, subject, linkTitle }),
    });

    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Could not explain.' };
    return { explanation: data.explanation };
  } catch (error) {
    if (error.name === 'AbortError') return { error: 'Request timed out. Try again!' };
    return { error: 'Cannot reach AI. Check your connection!' };
  }
};

export const fetchLearningInsights = async ({ wrongAnswerLog, grade, subject }) => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/api/learning-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wrongAnswerLog, grade, subject }),
    });

    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Could not analyze.' };
    return data; // { summary, patterns, tips }
  } catch (error) {
    if (error.name === 'AbortError') return { error: 'Request timed out. Try again!' };
    return { error: 'Cannot reach AI. Check your connection!' };
  }
};

export const generateQuestions = async ({ grade, subject, topics, count = 5, difficulty = 'medium' }) => {
  try {
    const response = await fetchWithRetry(`${BASE_URL}/api/generate-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grade, subject, topics, count, difficulty }),
    });

    const data = await response.json();
    if (!response.ok) return { error: data.error || 'Could not generate questions.' };
    return data; // { questions, grade, subject, difficulty }
  } catch (error) {
    if (error.name === 'AbortError') return { error: 'Request timed out. Try again!' };
    return { error: 'Cannot reach AI. Check your connection!' };
  }
};
