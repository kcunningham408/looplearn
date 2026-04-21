// ── Deterministic Math Question Generator ──
// Generates grade-appropriate math questions with 100% correct answers.
// All answers are computed programmatically — no LLM involved.

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate plausible wrong answers near the correct one
function distractors(correct, count = 3, { min = 0, forceInt = true, spread } = {}) {
  const s = spread || Math.max(3, Math.ceil(Math.abs(correct) * 0.4));
  const wrong = new Set();
  let attempts = 0;
  while (wrong.size < count && attempts < 50) {
    let d = correct + rand(-s, s);
    if (d === correct) d = correct + (rand(0, 1) ? 1 : -1) * rand(1, s);
    if (forceInt) d = Math.round(d);
    if (d !== correct && d >= min && !wrong.has(d)) wrong.add(d);
    attempts++;
  }
  // Fallback: sequential offsets
  let offset = 1;
  while (wrong.size < count) {
    const d = correct + offset;
    if (d !== correct && d >= min && !wrong.has(d)) wrong.add(d);
    offset = offset > 0 ? -offset : -offset + 1;
  }
  return [...wrong];
}

function buildQuestion(q, correctAnswer, wrongAnswers, explanation) {
  const options = [String(correctAnswer), ...wrongAnswers.map(String)];
  const shuffled = shuffle(options);
  const correctIndex = shuffled.indexOf(String(correctAnswer));
  return {
    q,
    a: shuffled,
    correct: correctIndex,
    type: 'mcq',
    explanation,
  };
}

// ══════════════════════════════════════════════════════════
// TOPIC GENERATORS — each returns { q, correct, wrong[], explanation }
// ══════════════════════════════════════════════════════════

const NAMES = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Mia', 'Lucas', 'Isabella', 'Jack', 'Lily', 'Ben', 'Zoe', 'Sam', 'Chloe', 'Tom', 'Ella', 'Max'];
const ITEMS = ['apples', 'pencils', 'stickers', 'marbles', 'crayons', 'books', 'cookies', 'toy cars', 'balls', 'blocks', 'cupcakes', 'shells', 'flowers', 'stars', 'coins'];

// ── ADDITION ──
function additionQ(grade, difficulty) {
  const ranges = {
    easy:   { 1: [1,9],   2: [1,15],  3: [10,50],  4: [50,200],  5: [100,500],  6: [100,999] },
    medium: { 1: [2,12],  2: [5,20],  3: [20,100], 4: [100,500], 5: [200,999],  6: [500,2000] },
    hard:   { 1: [5,15],  2: [10,30], 3: [50,200], 4: [200,999], 5: [500,2000], 6: [1000,5000] },
  };
  const [lo, hi] = (ranges[difficulty] || ranges.medium)[grade] || [1, 20];
  const a = rand(lo, hi), b = rand(lo, hi);
  const answer = a + b;
  const name = pick(NAMES), item = pick(ITEMS);

  const templates = [
    { q: `${name} has ${a} ${item}. If ${name} gets ${b} more, how many ${item} does ${name} have now?`, expl: `${a} + ${b} = ${answer}` },
    { q: `What is ${a} + ${b}?`, expl: `${a} + ${b} = ${answer}` },
    { q: `There are ${a} ${item} on a table. ${b} more are added. How many ${item} are there now?`, expl: `${a} + ${b} = ${answer}` },
  ];
  const t = pick(templates);
  return buildQuestion(t.q, answer, distractors(answer, 3, { min: 0 }), t.expl);
}

// ── SUBTRACTION ──
function subtractionQ(grade, difficulty) {
  const ranges = {
    easy:   { 1: [3,10],  2: [5,18],  3: [15,50],  4: [50,200],  5: [100,500],  6: [200,999] },
    medium: { 1: [5,15],  2: [8,25],  3: [25,100], 4: [100,500], 5: [200,999],  6: [500,2000] },
    hard:   { 1: [8,18],  2: [12,35], 3: [50,200], 4: [200,999], 5: [500,2000], 6: [1000,5000] },
  };
  const [lo, hi] = (ranges[difficulty] || ranges.medium)[grade] || [5, 20];
  const total = rand(lo, hi), taken = rand(1, total - 1);
  const answer = total - taken;
  const name = pick(NAMES), item = pick(ITEMS);

  const templates = [
    { q: `${name} has ${total} ${item}. ${name} gives away ${taken}. How many ${item} are left?`, expl: `${total} - ${taken} = ${answer}` },
    { q: `What is ${total} - ${taken}?`, expl: `${total} - ${taken} = ${answer}` },
    { q: `There are ${total} ${item} in a box. ${taken} are taken out. How many are left?`, expl: `${total} - ${taken} = ${answer}` },
  ];
  const t = pick(templates);
  return buildQuestion(t.q, answer, distractors(answer, 3, { min: 0 }), t.expl);
}

// ── COUNTING ──
function countingQ(_grade, _difficulty) {
  const start = rand(1, 15);
  const step = pick([1, 2, 5, 10]);
  const count = rand(3, 5);
  const sequence = Array.from({ length: count }, (_, i) => start + step * i);
  const answer = start + step * count;
  const seqStr = sequence.join(', ');

  return buildQuestion(
    `What comes next in this pattern? ${seqStr}, ...`,
    answer,
    distractors(answer, 3, { min: 0 }),
    `The pattern counts by ${step}s. ${sequence[sequence.length - 1]} + ${step} = ${answer}`
  );
}

// ── SHAPES ──
function shapesQ() {
  const shapes = [
    { name: 'triangle', sides: 3, corners: 3 },
    { name: 'square', sides: 4, corners: 4 },
    { name: 'rectangle', sides: 4, corners: 4 },
    { name: 'pentagon', sides: 5, corners: 5 },
    { name: 'hexagon', sides: 6, corners: 6 },
    { name: 'octagon', sides: 8, corners: 8 },
    { name: 'circle', sides: 0, corners: 0 },
  ];
  const s = pick(shapes.filter(s => s.sides > 0));
  const askSides = rand(0, 1) === 0;

  if (askSides) {
    return buildQuestion(
      `How many sides does a ${s.name} have?`,
      s.sides,
      distractors(s.sides, 3, { min: 1, spread: 3 }),
      `A ${s.name} has ${s.sides} sides.`
    );
  }
  return buildQuestion(
    `How many corners does a ${s.name} have?`,
    s.corners,
    distractors(s.corners, 3, { min: 1, spread: 3 }),
    `A ${s.name} has ${s.corners} corners.`
  );
}

// ── MULTIPLICATION ──
function multiplicationQ(grade, difficulty) {
  const ranges = {
    easy:   { 3: [2,6],  4: [2,8],   5: [3,10],  6: [4,12] },
    medium: { 3: [3,9],  4: [4,12],  5: [5,12],  6: [6,15] },
    hard:   { 3: [5,12], 4: [6,15],  5: [8,20],  6: [10,25] },
  };
  const [lo, hi] = (ranges[difficulty] || ranges.medium)[grade] || [2, 10];
  const a = rand(lo, hi), b = rand(2, Math.min(hi, 12));
  const answer = a * b;
  const name = pick(NAMES), item = pick(ITEMS);

  const templates = [
    { q: `${name} has ${a} bags with ${b} ${item} in each bag. How many ${item} in total?`, expl: `${a} × ${b} = ${answer}` },
    { q: `What is ${a} × ${b}?`, expl: `${a} × ${b} = ${answer}` },
    { q: `There are ${a} rows with ${b} ${item} in each row. How many ${item} are there altogether?`, expl: `${a} × ${b} = ${answer}` },
  ];
  const t = pick(templates);
  return buildQuestion(t.q, answer, distractors(answer, 3, { min: 1 }), t.expl);
}

// ── DIVISION ──
function divisionQ(grade, difficulty) {
  const ranges = {
    easy:   { 3: [2,5],  4: [2,8],  5: [3,10], 6: [4,12] },
    medium: { 3: [3,8],  4: [4,10], 5: [5,12], 6: [6,15] },
    hard:   { 3: [4,10], 4: [5,12], 5: [6,15], 6: [8,20] },
  };
  const [lo, hi] = (ranges[difficulty] || ranges.medium)[grade] || [2, 10];
  const divisor = rand(lo, hi);
  const quotient = rand(2, hi);
  const total = divisor * quotient;
  const name = pick(NAMES), item = pick(ITEMS);

  const templates = [
    { q: `${name} has ${total} ${item} to share equally among ${divisor} friends. How many does each friend get?`, expl: `${total} ÷ ${divisor} = ${quotient}` },
    { q: `What is ${total} ÷ ${divisor}?`, expl: `${total} ÷ ${divisor} = ${quotient}` },
    { q: `There are ${total} ${item} packed equally into ${divisor} boxes. How many ${item} are in each box?`, expl: `${total} ÷ ${divisor} = ${quotient}` },
  ];
  const t = pick(templates);
  return buildQuestion(t.q, quotient, distractors(quotient, 3, { min: 1 }), t.expl);
}

// ── FRACTIONS ──
function fractionsQ(grade, difficulty) {
  // For younger grades: simple visual fractions. For older: operations.
  if (grade <= 4) {
    const denom = pick([2, 3, 4, 5, 6, 8]);
    const numer = rand(1, denom - 1);
    const total = denom * rand(2, 5);
    const answer = (numer / denom) * total;
    const item = pick(ITEMS);

    return buildQuestion(
      `There are ${total} ${item}. What is ${numer}/${denom} of ${total}?`,
      answer,
      distractors(answer, 3, { min: 1 }),
      `${numer}/${denom} of ${total} = ${total} × ${numer} ÷ ${denom} = ${answer}`
    );
  }

  // Grades 5-6: fraction addition (use denom >= 4 to ensure enough wrong options)
  const denom = pick([4, 5, 6, 8, 10]);
  const n1 = rand(1, denom - 1);
  let n2 = rand(1, denom - 1);
  while (n1 + n2 > denom) n2 = rand(1, denom - n1);
  const sumN = n1 + n2;
  const answerStr = sumN === denom ? '1' : `${sumN}/${denom}`;

  const wrongOptions = [];
  const candidates = [
    `${Math.max(1, sumN - 1)}/${denom}`,
    `${Math.min(denom, sumN + 1)}/${denom}`,
    `${n1}/${denom}`,
    `${n2}/${denom}`,
    `${Math.min(denom, sumN + 2)}/${denom}`,
  ];
  for (const c of candidates) {
    if (c !== answerStr && !wrongOptions.includes(c)) wrongOptions.push(c);
    if (wrongOptions.length >= 3) break;
  }
  let attempts = 0;
  while (wrongOptions.length < 3 && attempts < 30) {
    const fake = `${rand(1, denom)}/${denom}`;
    if (fake !== answerStr && !wrongOptions.includes(fake)) wrongOptions.push(fake);
    attempts++;
  }
  // Final fallback with whole numbers
  let fallback = 1;
  while (wrongOptions.length < 3) {
    const s = String(fallback);
    if (s !== answerStr && !wrongOptions.includes(s)) wrongOptions.push(s);
    fallback++;
  }

  return buildQuestion(
    `What is ${n1}/${denom} + ${n2}/${denom}?`,
    answerStr,
    wrongOptions,
    `${n1}/${denom} + ${n2}/${denom} = ${sumN}/${denom}${sumN === denom ? ' = 1' : ''}`
  );
}

// ── DECIMALS ──
function decimalsQ(grade, difficulty) {
  const places = difficulty === 'easy' ? 1 : 2;
  const factor = Math.pow(10, places);
  const a = rand(1, 50 * factor) / factor;
  const b = rand(1, 30 * factor) / factor;
  const op = pick(['+', '-']);
  const answer = op === '+' ? +(a + b).toFixed(places) : +(Math.max(a, b) - Math.min(a, b)).toFixed(places);
  const bigger = Math.max(a, b), smaller = Math.min(a, b);
  const qA = op === '+' ? a : bigger;
  const qB = op === '+' ? b : smaller;
  const opWord = op === '+' ? '+' : '-';

  const wrong = distractors(answer * factor, 3, { min: 0 }).map(w => (w / factor).toFixed(places));

  return buildQuestion(
    `What is ${qA.toFixed(places)} ${opWord} ${qB.toFixed(places)}?`,
    answer.toFixed(places),
    wrong,
    `${qA.toFixed(places)} ${opWord} ${qB.toFixed(places)} = ${answer.toFixed(places)}`
  );
}

// ── PLACE VALUE ──
function placeValueQ(grade) {
  if (grade <= 2) {
    const num = rand(10, 99);
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    const askTens = rand(0, 1) === 0;
    const answer = askTens ? tens : ones;
    return buildQuestion(
      `What is the ${askTens ? 'tens' : 'ones'} digit in the number ${num}?`,
      answer,
      distractors(answer, 3, { min: 0, spread: 5 }),
      `In ${num}, the tens digit is ${tens} and the ones digit is ${ones}.`
    );
  }
  const num = rand(100, 9999);
  const digits = { thousands: Math.floor(num / 1000), hundreds: Math.floor((num % 1000) / 100), tens: Math.floor((num % 100) / 10), ones: num % 10 };
  const place = pick(Object.keys(digits));
  return buildQuestion(
    `What is the ${place} digit in the number ${num.toLocaleString()}?`,
    digits[place],
    distractors(digits[place], 3, { min: 0, spread: 5 }),
    `In ${num.toLocaleString()}, the ${place} digit is ${digits[place]}.`
  );
}

// ── TIME ──
function timeQ() {
  const hour = rand(1, 12);
  const min = pick([0, 15, 30, 45]);
  const addMin = pick([15, 30, 45, 60]);
  const totalMin = hour * 60 + min + addMin;
  const newHour = Math.floor(totalMin / 60) % 12 || 12;
  const newMin = totalMin % 60;
  const answer = `${newHour}:${String(newMin).padStart(2, '0')}`;
  const timeStr = `${hour}:${String(min).padStart(2, '0')}`;

  const wrongOpts = [];
  [[newHour, (newMin + 15) % 60], [newHour + 1 > 12 ? 1 : newHour + 1, newMin], [newHour, (newMin + 30) % 60]].forEach(([h, m]) => {
    const s = `${h}:${String(m).padStart(2, '0')}`;
    if (s !== answer && !wrongOpts.includes(s)) wrongOpts.push(s);
  });
  let fallbackAttempts = 0;
  while (wrongOpts.length < 3 && fallbackAttempts < 20) {
    const s = `${rand(1, 12)}:${String(pick([0, 15, 30, 45])).padStart(2, '0')}`;
    if (s !== answer && !wrongOpts.includes(s)) wrongOpts.push(s);
    fallbackAttempts++;
  }

  return buildQuestion(
    `If the time is ${timeStr} and ${addMin} minutes pass, what time will it be?`,
    answer,
    wrongOpts.slice(0, 3),
    `${timeStr} + ${addMin} minutes = ${answer}`
  );
}

// ── PERCENTAGES ──
function percentagesQ(grade, difficulty) {
  const pct = pick([10, 15, 20, 25, 30, 40, 50, 75]);
  // Ensure clean answer: base must be divisible to give integer
  const factor = 100 / gcd(pct, 100);
  const multiplier = rand(1, difficulty === 'hard' ? 5 : 3);
  const base = factor * multiplier;
  const answer = (pct / 100) * base;

  return buildQuestion(
    `What is ${pct}% of ${base}?`,
    answer,
    distractors(answer, 3, { min: 0 }),
    `${pct}% of ${base} = ${pct}/100 × ${base} = ${answer}`
  );
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

// ── ORDER OF OPERATIONS ──
function orderOfOpsQ(grade, difficulty) {
  // Generate expressions where order of operations matters
  const templates = [
    () => {
      const a = rand(2, 10), b = rand(2, 8), c = rand(1, 5);
      return { q: `What is ${a} + ${b} × ${c}?`, answer: a + b * c, expl: `First multiply: ${b} × ${c} = ${b * c}. Then add: ${a} + ${b * c} = ${a + b * c}` };
    },
    () => {
      const a = rand(10, 30), b = rand(2, 6), c = rand(2, 5);
      return { q: `What is ${a} - ${b} × ${c}?`, answer: a - b * c, expl: `First multiply: ${b} × ${c} = ${b * c}. Then subtract: ${a} - ${b * c} = ${a - b * c}` };
    },
    () => {
      const a = rand(2, 8), b = rand(1, 5), c = rand(2, 6);
      const inner = a + b;
      return { q: `What is (${a} + ${b}) × ${c}?`, answer: inner * c, expl: `First solve parentheses: ${a} + ${b} = ${inner}. Then multiply: ${inner} × ${c} = ${inner * c}` };
    },
    () => {
      const a = rand(2, 6), b = rand(2, 6);
      const c = a * b;
      const d = rand(1, 10);
      return { q: `What is ${c} ÷ ${a} + ${d}?`, answer: b + d, expl: `First divide: ${c} ÷ ${a} = ${b}. Then add: ${b} + ${d} = ${b + d}` };
    },
  ];
  const t = pick(templates)();
  return buildQuestion(t.q, t.answer, distractors(t.answer, 3), t.expl);
}

// ── RATIOS ──
const RECIPE_ITEMS = ['cups of sugar', 'cups of flour', 'cups of milk', 'eggs', 'tablespoons of butter', 'cups of water', 'teaspoons of salt', 'cups of rice', 'cups of oats'];

function ratiosQ(grade, difficulty) {
  const a = rand(2, 8), b = rand(2, 8);
  const g = gcd(a, b);
  const simplified = `${a / g}:${b / g}`;
  const total = (a + b) * rand(2, 5);
  const partA = (a / (a + b)) * total;

  const templates = [
    // Simplify
    () => {
      const sn = a / g, sd = b / g;
      return {
        q: `Simplify the ratio ${a}:${b}.`,
        answer: simplified,
        wrong: [
          `${a}:${b}`,          // unsimplified
          `${sd}:${sn}`,        // reversed
          `${sn + 1}:${sd}`,    // off by 1 numerator
          `${sn}:${sd + 1}`,    // off by 1 denominator
          `${sn + 1}:${sd + 1}`,
        ].filter(x => x !== simplified).slice(0, 3),
        expl: `GCD of ${a} and ${b} is ${g}. ${a}/${g} : ${b}/${g} = ${simplified}`,
      };
    },
    // Find part from total
    () => {
      return {
        q: `In a ratio of ${a}:${b}, if the total is ${total}, what is the first part?`,
        answer: partA,
        wrong: distractors(partA, 3, { min: 1 }),
        expl: `Total parts = ${a} + ${b} = ${a + b}. First part = ${a}/${a + b} × ${total} = ${partA}`,
      };
    },
    // Recipe scaling (double, triple, etc.)
    () => {
      const item1 = pick(RECIPE_ITEMS);
      let item2 = pick(RECIPE_ITEMS);
      while (item2 === item1) item2 = pick(RECIPE_ITEMS);
      const base = rand(2, 6);
      const multiplier = pick([2, 3, 4]);
      const multWord = multiplier === 2 ? 'double' : multiplier === 3 ? 'triple' : 'quadruple';
      const answer = base * multiplier;
      const name = pick(NAMES);
      return {
        q: `${name} is making a recipe that uses ${base} ${item1} for every ${rand(3, 8)} ${item2}. If ${name} wants to ${multWord} the recipe, how many ${item1} will ${name} need?`,
        answer,
        wrong: distractors(answer, 3, { min: 1 }),
        expl: `To ${multWord} the recipe, multiply by ${multiplier}: ${base} × ${multiplier} = ${answer} ${item1}`,
      };
    },
    // Unit rate
    () => {
      const items = rand(6, 30);
      const groups = pick([2, 3, 4, 5, 6]);
      const total = items * groups;
      const name = pick(NAMES);
      const item = pick(ITEMS);
      return {
        q: `${name} has ${total} ${item} split equally into ${groups} groups. How many ${item} are in each group?`,
        answer: items,
        wrong: distractors(items, 3, { min: 1 }),
        expl: `${total} ÷ ${groups} = ${items} ${item} per group`,
      };
    },
  ];
  const t = pick(templates)();
  const wrongArr = Array.isArray(t.wrong) && t.wrong.length >= 3
    ? t.wrong.slice(0, 3)
    : typeof t.answer === 'number'
      ? distractors(t.answer, 3, { min: 0 })
      : [`${String(t.answer).split(':')[0]}:${(parseInt(String(t.answer).split(':')[1]) || 1) + 1}`,
         `${(parseInt(String(t.answer).split(':')[0]) || 1) + 1}:${String(t.answer).split(':')[1]}`,
         `${String(t.answer).split(':').reverse().join(':')}`
        ].filter(x => x !== String(t.answer));
  return buildQuestion(t.q, t.answer, wrongArr, t.expl);
}

// ── INTEGERS ──
function integersQ(grade, difficulty) {
  const a = rand(-15, 15), b = rand(-15, 15);
  const op = pick(['+', '-']);
  const answer = op === '+' ? a + b : a - b;

  return buildQuestion(
    `What is ${a < 0 ? `(${a})` : a} ${op} ${b < 0 ? `(${b})` : b}?`,
    answer,
    distractors(answer, 3, { spread: 6 }),
    `${a} ${op} ${b} = ${answer}`
  );
}

// ── EXPRESSIONS (simplify / evaluate) ──
function expressionsQ(grade, difficulty) {
  const a = rand(2, 6), b = rand(1, 8), c = rand(1, 5);
  const xVal = rand(1, 8);
  const answer = a * xVal + b;

  return buildQuestion(
    `If x = ${xVal}, what is the value of ${a}x + ${b}?`,
    answer,
    distractors(answer, 3, { min: 0 }),
    `Substitute x = ${xVal}: ${a}(${xVal}) + ${b} = ${a * xVal} + ${b} = ${answer}`
  );
}

// ── EQUATIONS ──
function equationsQ(grade, difficulty) {
  const templates = [
    // ax + b = c
    () => {
      const x = rand(1, 12);
      const a = rand(2, 6);
      const b = rand(1, 15);
      const c = a * x + b;
      return { q: `Solve for x: ${a}x + ${b} = ${c}`, answer: x, expl: `${a}x + ${b} = ${c} → ${a}x = ${c - b} → x = ${(c - b)} ÷ ${a} = ${x}` };
    },
    // a(x + b) = c
    () => {
      const x = rand(1, 10);
      const a = rand(2, 5);
      const b = rand(1, 8);
      const c = a * (x + b);
      return { q: `Solve for x: ${a}(x + ${b}) = ${c}`, answer: x, expl: `${a}(x + ${b}) = ${c} → x + ${b} = ${c / a} → x = ${c / a} - ${b} = ${x}` };
    },
    // x / a + b = c
    () => {
      const a = rand(2, 6);
      const result = rand(2, 10);
      const b = rand(1, 8);
      const x = result * a;
      const c = result + b;
      return { q: `Solve for x: x ÷ ${a} + ${b} = ${c}`, answer: x, expl: `x ÷ ${a} + ${b} = ${c} → x ÷ ${a} = ${result} → x = ${result} × ${a} = ${x}` };
    },
    // x - b = c
    () => {
      const x = rand(5, 25);
      const b = rand(1, x - 1);
      const c = x - b;
      return { q: `Solve for x: x - ${b} = ${c}`, answer: x, expl: `x - ${b} = ${c} → x = ${c} + ${b} = ${x}` };
    },
  ];
  const t = pick(templates)();
  return buildQuestion(t.q, t.answer, distractors(t.answer, 3, { min: 0 }), t.expl);
}

// ── WORD PROBLEMS ──
function wordProblemsQ(grade, difficulty) {
  const name1 = pick(NAMES);
  let name2 = pick(NAMES);
  while (name2 === name1) name2 = pick(NAMES);
  const item = pick(ITEMS);

  const templates = [
    () => {
      const a = rand(5, 30), b = rand(5, 30);
      return { q: `${name1} has ${a} ${item} and ${name2} has ${b} ${item}. How many ${item} do they have together?`, answer: a + b, expl: `${a} + ${b} = ${a + b}` };
    },
    () => {
      const total = rand(20, 60), given = rand(5, total - 5);
      return { q: `${name1} had ${total} ${item} and gave ${given} to ${name2}. How many does ${name1} have left?`, answer: total - given, expl: `${total} - ${given} = ${total - given}` };
    },
    () => {
      const groups = rand(3, 8), perGroup = rand(3, 10);
      return { q: `${name1} bought ${groups} packs of ${item} with ${perGroup} in each pack. How many ${item} did ${name1} buy?`, answer: groups * perGroup, expl: `${groups} × ${perGroup} = ${groups * perGroup}` };
    },
    () => {
      const divisor = rand(2, 8), quotient = rand(3, 10);
      const total = divisor * quotient;
      return { q: `${name1} wants to split ${total} ${item} equally among ${divisor} friends. How many does each friend get?`, answer: quotient, expl: `${total} ÷ ${divisor} = ${quotient}` };
    },
  ];
  const t = pick(templates)();
  return buildQuestion(t.q, t.answer, distractors(t.answer, 3, { min: 0 }), t.expl);
}

// ── GEOMETRY ──
function geometryQ(grade, difficulty) {
  const templates = [
    // Perimeter of rectangle
    () => {
      const l = rand(3, 15), w = rand(2, 12);
      const p = 2 * (l + w);
      return { q: `What is the perimeter of a rectangle with length ${l} and width ${w}?`, answer: p, expl: `Perimeter = 2 × (${l} + ${w}) = 2 × ${l + w} = ${p}` };
    },
    // Area of rectangle
    () => {
      const l = rand(3, 12), w = rand(2, 10);
      const a = l * w;
      return { q: `What is the area of a rectangle with length ${l} and width ${w}?`, answer: a, expl: `Area = ${l} × ${w} = ${a}` };
    },
    // Perimeter of square
    () => {
      const s = rand(2, 15);
      const p = 4 * s;
      return { q: `What is the perimeter of a square with side length ${s}?`, answer: p, expl: `Perimeter = 4 × ${s} = ${p}` };
    },
    // Area of triangle
    () => {
      const b = rand(4, 16), h = rand(2, 12);
      const a = (b * h) / 2;
      return { q: `What is the area of a triangle with base ${b} and height ${h}?`, answer: a, expl: `Area = (${b} × ${h}) ÷ 2 = ${b * h} ÷ 2 = ${a}` };
    },
  ];
  const t = pick(templates)();
  return buildQuestion(t.q, t.answer, distractors(t.answer, 3, { min: 1 }), t.expl);
}

// ══════════════════════════════════════════════════════════
// TOPIC ROUTER
// ══════════════════════════════════════════════════════════

const TOPIC_MAP = {
  'addition':            additionQ,
  'subtraction':         subtractionQ,
  'counting':            countingQ,
  'shapes':              shapesQ,
  'multiplication':      multiplicationQ,
  'division':            divisionQ,
  'fractions':           fractionsQ,
  'decimals':            decimalsQ,
  'place value':         placeValueQ,
  'time':                timeQ,
  'percentages':         percentagesQ,
  'order of operations': orderOfOpsQ,
  'ratios':              ratiosQ,
  'integers':            integersQ,
  'expressions':         expressionsQ,
  'equations':           equationsQ,
  'word problems':       wordProblemsQ,
  'geometry':            geometryQ,
};

const GRADE_DEFAULTS = {
  1: ['addition', 'subtraction', 'counting', 'shapes'],
  2: ['addition', 'subtraction', 'place value', 'time'],
  3: ['multiplication', 'division', 'fractions', 'word problems'],
  4: ['multiplication', 'fractions', 'decimals', 'geometry'],
  5: ['fractions', 'decimals', 'percentages', 'order of operations'],
  6: ['ratios', 'integers', 'expressions', 'equations'],
};

function generateMathQuestions({ grade, topics, count = 5, difficulty = 'medium' }) {
  const topicNames = (Array.isArray(topics) && topics.length > 0)
    ? topics.map(t => t.toLowerCase())
    : GRADE_DEFAULTS[grade] || GRADE_DEFAULTS[3];

  // Filter to only topics we have generators for
  const validTopics = topicNames.filter(t => TOPIC_MAP[t]);
  if (validTopics.length === 0) {
    // Fallback to grade defaults
    const fallback = GRADE_DEFAULTS[grade] || GRADE_DEFAULTS[3];
    validTopics.push(...fallback);
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    const topic = validTopics[i % validTopics.length];
    const generator = TOPIC_MAP[topic];
    questions.push(generator(grade, difficulty));
  }

  return shuffle(questions);
}

module.exports = { generateMathQuestions };
