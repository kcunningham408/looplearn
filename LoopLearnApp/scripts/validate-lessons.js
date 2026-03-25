const data = require('../src/data/lessons.json');
let issues = [];
let total = 0;
Object.keys(data).forEach(subj => {
  const loops = data[subj];
  loops.forEach(l => {
    total++;
    const linkCount = l.links ? l.links.length : 0;
    if (linkCount !== 5) issues.push(subj + ' G' + l.grade + ' ' + (l.title || l.loop) + ': ' + linkCount + ' links');
    if (l.links) {
      l.links.forEach((lk, i) => {
        const qLen = lk.quiz ? lk.quiz.length : 0;
        if (qLen !== 5) issues.push(subj + ' G' + l.grade + ' ' + (l.title || l.loop) + ' link ' + i + ': ' + qLen + ' quiz Qs');
        if (!lk.lesson || !lk.lesson.sections) issues.push(subj + ' G' + l.grade + ' ' + (l.title || l.loop) + ' link ' + i + ': missing lesson/sections');
      });
    }
  });
});
console.log('Total loops:', total);
console.log('Total links:', total * 5);
console.log('Issues:', issues.length === 0 ? 'NONE ✅' : '\n' + issues.join('\n'));
