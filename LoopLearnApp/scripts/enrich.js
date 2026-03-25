const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/lessons.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let enriched = 0;
let quizTagged = 0;

for (const subject of ['math', 'science']) {
  for (const loop of data[subject]) {
    for (const link of loop.links) {
      const lesson = link.lesson || {};

      if (!lesson.sections) {
        enriched++;
        const title = lesson.title || link.title;
        const examples = Array.isArray(lesson.examples) ? lesson.examples : [];
        link.lesson = {
          sections: [
            {
              heading: title,
              content: examples.length
                ? examples.join(' ')
                : 'Read this lesson carefully, then answer the quiz questions.',
              visual: 'Sketch the idea or say it aloud to help it stick.'
            }
          ],
          keyPoints: examples.length
            ? examples.slice(0, 3)
            : ['Start slow', 'Practice one step at a time', 'Check each answer'],
          funFact: 'Fun Fact: Doing a little studying each day creates lasting memory.'
        };
      }

      for (const q of link.quiz) {
        if (!q || typeof q !== 'object') continue;
        if (!Array.isArray(q.a)) continue;

        if (q.a.length === 2) {
          q.type = 'tf';
        } else {
          q.type = 'mcq';
          if (q.a.length === 3 && !q.a.includes('None of the above')) {
            q.a = [...q.a, 'None of the above'];
          }
        }
        quizTagged++;
      }
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`Done. Enriched ${enriched} lessons, tagged ${quizTagged} quiz items.`);
