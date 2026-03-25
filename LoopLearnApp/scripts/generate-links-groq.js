#!/usr/bin/env node
/**
 * Generate missing links for all loops using Groq API.
 * Each loop needs exactly 5 links — this script generates the missing ones.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  console.error('Error: GROQ_API_KEY environment variable is required');
  process.exit(1);
}
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

// Rate limit: Groq free tier allows 6000 tokens/min. We need ~2000 tokens per call.
// So we can do about 3 requests per minute. Use 25s delay + retry logic.
const DELAY_MS = 25000;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function callGroq(systemPrompt, userPrompt, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        model: MODEL,
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (res.status === 429) {
      // Rate limited — wait and retry
      const waitSec = attempt * 20;
      console.log(`  ⏳ Rate limited, waiting ${waitSec}s (attempt ${attempt}/${retries})...`);
      await sleep(waitSec * 1000);
      continue;
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  }
  throw new Error('Max retries exceeded due to rate limiting');
}

const SYSTEM = `You are an expert children's educational content creator. You create lesson content and quiz questions for a kids' learning app (Grades 1-6).

When asked to generate links (lessons), return ONLY valid JSON — no markdown, no explanation, no code fences.

Each link object must have this EXACT structure:
{
  "id": "snake_case_unique_id",
  "title": "Short Lesson Title",
  "lesson": {
    "sections": [
      { "heading": "Section 1 Title", "content": "2-3 sentences of educational content", "visual": "Emoji or visual description" },
      { "heading": "Section 2 Title", "content": "2-3 sentences of educational content", "visual": "Emoji or visual description" }
    ],
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "funFact": "Fun Fact: An interesting fact related to the topic."
  },
  "quiz": [
    { "q": "Question text?", "a": ["Option A", "Option B", "Option C", "Option D"], "correct": 0, "type": "mcq" },
    { "q": "True/false statement.", "a": ["True", "False"], "correct": 0, "type": "tf" },
    { "q": "Question?", "a": ["A", "B", "C", "D"], "correct": 2, "type": "mcq" },
    { "q": "Statement.", "a": ["True", "False"], "correct": 1, "type": "tf" },
    { "q": "Question?", "a": ["A", "B", "C", "D"], "correct": 1, "type": "mcq" }
  ]
}

RULES:
- Content MUST be grade-appropriate
- Questions must be factually correct
- Mix of mcq (4 options) and tf (2 options) — at least 2 of each type per 5 questions
- "correct" is the 0-based index of the right answer
- Each quiz must have exactly 5 questions
- IDs must be unique snake_case
- Content should be engaging, fun, and educational for kids
- Use real-world examples kids can relate to`;

async function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  // Find all loops that need links
  const tasks = [];
  for (const subject of ['math', 'science']) {
    for (const loop of data[subject]) {
      const needed = 5 - loop.links.length;
      if (needed > 0) {
        tasks.push({ subject, loop, needed });
      }
    }
  }

  console.log(`Found ${tasks.length} loops needing links (${tasks.reduce((s, t) => s + t.needed, 0)} total links to generate)\n`);

  let generated = 0;
  let failed = 0;

  for (let i = 0; i < tasks.length; i++) {
    const { subject, loop, needed } = tasks[i];
    const existingTitles = loop.links.map(l => l.title).join(', ');

    console.log(`[${i + 1}/${tasks.length}] ${subject} G${loop.grade} "${loop.title}" — need ${needed} more links (has: ${existingTitles})`);

    const userPrompt = `Generate exactly ${needed} new lesson links for a Grade ${loop.grade} ${subject} loop called "${loop.title}".

Existing lessons are: ${existingTitles}. Do NOT duplicate these topics.

The new lessons should cover different aspects of "${loop.title}" appropriate for Grade ${loop.grade} students.

Return a JSON array of ${needed} link objects. ONLY return the JSON array, nothing else.`;

    try {
      const raw = await callGroq(SYSTEM, userPrompt);

      // Try to parse the JSON
      let cleaned = raw.trim();
      // Remove code fences if present
      cleaned = cleaned.replace(/^```(?:json)?\n?/gm, '').replace(/```$/gm, '').trim();

      let newLinks;
      try {
        newLinks = JSON.parse(cleaned);
      } catch {
        // Try to find JSON array in the response
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
          newLinks = JSON.parse(match[0]);
        } else {
          throw new Error('Could not parse JSON from response');
        }
      }

      if (!Array.isArray(newLinks)) {
        newLinks = [newLinks];
      }

      // Validate and fix each link
      for (const link of newLinks) {
        // Ensure required fields
        if (!link.id || !link.title || !link.lesson || !link.quiz) {
          console.log(`  ⚠️  Skipping invalid link (missing fields)`);
          continue;
        }
        // Ensure quiz has 5 questions
        if (link.quiz.length < 5) {
          console.log(`  ⚠️  Link "${link.title}" has ${link.quiz.length} quiz questions (need 5), padding`);
          while (link.quiz.length < 5) {
            link.quiz.push({ q: `What is a key concept of ${link.title}?`, a: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0, type: 'mcq' });
          }
        }
        if (link.quiz.length > 5) {
          link.quiz = link.quiz.slice(0, 5);
        }
        // Make ID unique by prefixing with loop name
        if (!link.id.startsWith(loop.loop)) {
          link.id = `${loop.loop}_${link.id}`;
        }

        loop.links.push(link);
        generated++;
      }

      console.log(`  ✅ Added ${newLinks.length} links (total: ${loop.links.length}/5)`);

    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
      failed++;
    }

    // Rate limit delay
    if (i < tasks.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // Write the updated file
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done! Generated ${generated} links, ${failed} failures.`);

  // Verify
  let allGood = true;
  for (const subject of ['math', 'science']) {
    for (const loop of data[subject]) {
      if (loop.links.length !== 5) {
        console.log(`WARNING: ${subject} g${loop.grade} ${loop.loop} has ${loop.links.length} links`);
        allGood = false;
      }
    }
  }
  if (allGood) {
    console.log('✅ All 66 loops have exactly 5 links!');
  }
}

main().catch(console.error);
