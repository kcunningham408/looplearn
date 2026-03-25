#!/usr/bin/env node
/**
 * Generate a massive lessons database for LoopLearn.
 * Preserves existing content and adds new loops/links for all grades.
 * Target: 8-10 loops per grade per subject, 3-4 links per loop.
 */
const fs = require('fs');
const existing = JSON.parse(fs.readFileSync(__dirname + '/lessons.old.json', 'utf8'));

// Collect existing loop keys to avoid duplicates
const existingMathLoops = new Set(existing.math.map(l => `${l.grade}_${l.loop}`));
const existingSciLoops = new Set(existing.science.map(l => `${l.grade}_${l.loop}`));
const existingIds = new Set();
function collectIds(subject) {
  subject.forEach(loop => loop.links.forEach(link => existingIds.add(link.id)));
}
collectIds(existing.math);
collectIds(existing.science);

function makeId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '').replace(/^_+/, '');
}

function mcq(q, options, correctIdx) {
  return { q, a: options, correct: correctIdx, type: 'mcq' };
}

function tf(q, isTrue) {
  return { q, a: ['True', 'False'], correct: isTrue ? 0 : 1, type: 'tf' };
}

function link(id, title, sections, keyPoints, funFact, quiz) {
  if (existingIds.has(id)) id = id + '_v2';
  existingIds.add(id);
  return { id, title, lesson: { sections, keyPoints, funFact }, quiz };
}

// ═══════════════════════════════════════════════════════════════════
// NEW MATH CONTENT
// ═══════════════════════════════════════════════════════════════════
const newMath = [];

// ── GRADE 1 ──────────────────────────────────────────────────────
newMath.push({
  grade: 1, loop: 'number_patterns', title: 'Number Patterns',
  links: [
    link('skip_count_2s', 'Skip Counting by 2s',
      [{ heading: 'Hop, Hop, Hop!', content: 'Skip counting by 2s means we hop over every other number. Start at 2 and keep adding 2 each time: 2, 4, 6, 8, 10.', visual: 'Imagine a frog hopping on lily pads labeled 2, 4, 6, 8, 10!' },
       { heading: 'Even Numbers', content: 'When you skip count by 2s, every number you land on is called an EVEN number. Even numbers always end in 0, 2, 4, 6, or 8.', visual: 'Circle the even numbers on a number line from 1 to 20.' }],
      ['Skip counting by 2s: 2, 4, 6, 8, 10...', 'Even numbers end in 0, 2, 4, 6, or 8', 'Skip counting helps us count faster'],
      'Fun Fact: Bees have 6 legs — that\'s an even number!',
      [mcq('What comes next: 2, 4, 6, __?', ['7', '8', '10', 'None of the above'], 1),
       mcq('Which is an even number?', ['3', '7', '4', 'None of the above'], 2),
       tf('10 is an even number.', true),
       mcq('Skip count by 2: 6, 8, __?', ['9', '10', '12', 'None of the above'], 1),
       mcq('How many 2s make 10?', ['4', '5', '6', 'None of the above'], 1)]
    ),
    link('skip_count_5s', 'Skip Counting by 5s',
      [{ heading: 'High Fives!', content: 'Skip counting by 5s is like giving high fives! Start at 5 and add 5 each time: 5, 10, 15, 20, 25, 30.', visual: 'Hold up your hand — each hand has 5 fingers. Two hands = 10!' },
       { heading: 'Clock Connection', content: 'The minute marks on a clock go by 5s! That\'s why 1 means 5 minutes, 2 means 10 minutes.', visual: 'Look at a clock face and count the 5s: 5, 10, 15, 20...' }],
      ['Skip counting by 5s: 5, 10, 15, 20...', 'Numbers in the 5s pattern end in 0 or 5', 'Clocks use skip counting by 5s'],
      'Fun Fact: A starfish has 5 arms — nature loves the number 5!',
      [mcq('What comes next: 5, 10, 15, __?', ['16', '20', '25', 'None of the above'], 1),
       mcq('Skip count by 5: 25, 30, __?', ['31', '35', '40', 'None of the above'], 1),
       tf('All numbers that end in 5 or 0 are in the skip count by 5s pattern.', true),
       mcq('How many 5s make 20?', ['3', '4', '5', 'None of the above'], 1),
       mcq('Which is NOT in the 5s pattern?', ['10', '15', '12', 'None of the above'], 2)]
    ),
    link('skip_count_10s', 'Skip Counting by 10s',
      [{ heading: 'Big Jumps!', content: 'Skip counting by 10s is the easiest! Just add a 0 each time: 10, 20, 30, 40, 50... all the way to 100.', visual: 'Stack 10 blocks, then another 10, then another 10. Each stack is a group of 10!' },
       { heading: 'Tens Everywhere', content: 'We use groups of 10 all the time. There are 10 pennies in a dime, 10 years in a decade, and 10 toes on your feet.', visual: 'Count your toes — you have 10! That\'s one group of 10.' }],
      ['Skip counting by 10s: 10, 20, 30, 40...', 'Numbers in the 10s pattern always end in 0', '10 groups of 10 equals 100'],
      'Fun Fact: Our number system is called "base 10" because we have 10 fingers!',
      [mcq('What comes next: 30, 40, 50, __?', ['55', '60', '70', 'None of the above'], 1),
       mcq('How many 10s make 100?', ['5', '10', '20', 'None of the above'], 1),
       tf('70 is in the skip count by 10s pattern.', true),
       mcq('Skip count by 10: 80, __, 100?', ['85', '90', '95', 'None of the above'], 1),
       tf('25 is in the skip count by 10s pattern.', false)]
    )
  ]
});

newMath.push({
  grade: 1, loop: 'addition_intro', title: 'Adding Numbers',
  links: [
    link('add_within_5', 'Adding Within 5',
      [{ heading: 'Putting Together', content: 'Adding means putting things together to find the total. If you have 2 apples and get 1 more, you have 3 apples total! We write it as 2 + 1 = 3.', visual: '🍎🍎 + 🍎 = 🍎🍎🍎' },
       { heading: 'Using Your Fingers', content: 'You can use your fingers to add! Hold up 2 fingers, then hold up 1 more. Count all the fingers up — that\'s your answer!', visual: 'Hold up fingers to show 3 + 2 = 5.' }],
      ['Adding means combining groups', '2 + 3 = 5', 'You can use fingers to help add'],
      'Fun Fact: The plus sign (+) was first used over 500 years ago in a math book!',
      [mcq('What is 2 + 1?', ['2', '3', '4', 'None of the above'], 1),
       mcq('What is 3 + 2?', ['4', '5', '6', 'None of the above'], 1),
       mcq('What is 1 + 4?', ['3', '4', '5', 'None of the above'], 2),
       tf('2 + 2 = 4', true),
       mcq('What is 0 + 5?', ['0', '4', '5', 'None of the above'], 2)]
    ),
    link('add_within_10', 'Adding Within 10',
      [{ heading: 'Getting Bigger!', content: 'Now let\'s add bigger numbers! 4 + 3 = 7. Start at 4 and count up 3 more: 5, 6, 7. You can also count objects to help.', visual: '🔵🔵🔵🔵 + 🔵🔵🔵 = 7 blue dots' },
       { heading: 'Making 10', content: 'Some special pairs add up to 10: 5+5, 6+4, 7+3, 8+2, 9+1. These are called "number bonds to 10" and they\'re super useful!', visual: 'Draw 10 circles. Color some red and some blue. 6 red + 4 blue = 10!' }],
      ['Count up from the bigger number', 'Number bonds to 10: 5+5, 6+4, 7+3, 8+2, 9+1', 'Adding 0 doesn\'t change the number'],
      'Fun Fact: An abacus is a counting tool with beads that\'s been used for over 2,000 years!',
      [mcq('What is 4 + 3?', ['6', '7', '8', 'None of the above'], 1),
       mcq('What is 6 + 4?', ['9', '10', '11', 'None of the above'], 1),
       mcq('Which pair makes 10?', ['3 + 6', '5 + 5', '4 + 4', 'None of the above'], 1),
       tf('7 + 3 = 10', true),
       mcq('What is 8 + 2?', ['9', '10', '11', 'None of the above'], 1)]
    ),
    link('add_doubles', 'Doubles Facts',
      [{ heading: 'Double Trouble!', content: 'Doubles are when you add a number to itself: 1+1=2, 2+2=4, 3+3=6, 4+4=8, 5+5=10. These are easy to remember!', visual: '🦶🦶 You have 2 feet — double 1! 👀 You have 2 eyes — double 1!' },
       { heading: 'Near Doubles', content: 'Once you know doubles, you can figure out "near doubles" easily! 3+4 is like 3+3+1 = 7. Just add 1 more to the double!', visual: '3+3=6, so 3+4=7 (just 1 more!)' }],
      ['Doubles: 1+1, 2+2, 3+3, 4+4, 5+5', 'Near doubles: 3+4 = 3+3+1 = 7', 'Knowing doubles makes adding faster'],
      'Fun Fact: Twins are "doubles" in real life — two people who look alike!',
      [mcq('What is 3 + 3?', ['5', '6', '7', 'None of the above'], 1),
       mcq('What is 4 + 4?', ['7', '8', '9', 'None of the above'], 1),
       mcq('What is 5 + 5?', ['9', '10', '11', 'None of the above'], 1),
       tf('2 + 2 = 5', false),
       mcq('If 4+4=8, what is 4+5?', ['8', '9', '10', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 1, loop: 'subtraction_intro', title: 'Taking Away',
  links: [
    link('subtract_within_5', 'Subtract Within 5',
      [{ heading: 'Taking Away', content: 'Subtraction means taking away. If you have 5 cookies and eat 2, how many are left? 5 - 2 = 3 cookies!', visual: '🍪🍪🍪🍪🍪 take away 🍪🍪 = 🍪🍪🍪 (3 left!)' },
       { heading: 'Count Back', content: 'To subtract, start at the bigger number and count backwards. For 4 - 1: start at 4, count back 1... that\'s 3!', visual: 'On a number line: start at 4, hop back 1 step to land on 3.' }],
      ['Subtraction means taking away', 'Count back from the bigger number', '5 - 0 = 5 (taking away nothing!)'],
      'Fun Fact: The minus sign (-) was invented by a German mathematician named Johannes Widmann in 1489!',
      [mcq('What is 5 - 2?', ['2', '3', '4', 'None of the above'], 1),
       mcq('What is 4 - 1?', ['2', '3', '4', 'None of the above'], 1),
       tf('3 - 3 = 0', true),
       mcq('What is 5 - 0?', ['0', '4', '5', 'None of the above'], 2),
       mcq('What is 3 - 2?', ['0', '1', '2', 'None of the above'], 1)]
    ),
    link('subtract_within_10', 'Subtract Within 10',
      [{ heading: 'Bigger Subtractions', content: 'Now let\'s subtract from bigger numbers. 9 - 3 = 6. Start at 9 and count back 3: 8, 7, 6!', visual: 'Number line: 9 → 8 → 7 → 6. Three jumps back!' },
       { heading: 'Related Facts', content: 'Addition and subtraction are related! If 4 + 6 = 10, then 10 - 6 = 4 and 10 - 4 = 6. They\'re fact families!', visual: 'Fact family: 3 + 7 = 10, 7 + 3 = 10, 10 - 3 = 7, 10 - 7 = 3' }],
      ['Count back to subtract', 'Addition and subtraction are related', '10 - 5 = 5'],
      'Fun Fact: Subtraction is sometimes called "the inverse of addition" — it undoes adding!',
      [mcq('What is 8 - 3?', ['4', '5', '6', 'None of the above'], 1),
       mcq('What is 10 - 4?', ['5', '6', '7', 'None of the above'], 1),
       mcq('If 3 + 7 = 10, what is 10 - 7?', ['3', '4', '7', 'None of the above'], 0),
       tf('9 - 9 = 0', true),
       mcq('What is 7 - 5?', ['1', '2', '3', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 1, loop: 'measurement_basics', title: 'Measuring Things',
  links: [
    link('comparing_lengths', 'Longer and Shorter',
      [{ heading: 'Which Is Longer?', content: 'We compare lengths by putting things side by side. A pencil is longer than a crayon. A bus is longer than a car!', visual: 'Line up a pencil and a crayon — which one sticks out further? That one is LONGER!' },
       { heading: 'Tall and Short', content: 'For things that go up and down, we say tall and short. A giraffe is tall. A mouse is short. A building is taller than a house.', visual: '🦒 (tall) vs 🐭 (short)' }],
      ['Longer means more length', 'Shorter means less length', 'Line things up to compare'],
      'Fun Fact: The blue whale is the longest animal — it can be 100 feet long!',
      [mcq('Which is longer?', ['Pencil or crayon', 'Bus or bicycle', 'Ant or worm', 'None of the above'], 1),
       tf('A giraffe is taller than a cat.', true),
       mcq('Which word means LESS length?', ['Longer', 'Shorter', 'Wider', 'None of the above'], 1),
       tf('A school bus is shorter than a skateboard.', false),
       mcq('How do you compare lengths?', ['Weigh them', 'Line them up side by side', 'Stack them', 'None of the above'], 1)]
    ),
    link('comparing_weights', 'Heavier and Lighter',
      [{ heading: 'Heavy vs Light', content: 'Some things are heavy and hard to lift, like a bowling ball. Some things are light, like a feather. We compare using the words heavier and lighter.', visual: 'Hold a book in one hand and a pencil in the other — which feels heavier?' },
       { heading: 'Using a Balance', content: 'A balance scale helps us compare weights. Put one thing on each side. The heavier one goes DOWN and the lighter one goes UP!', visual: '⚖️ A balance scale with an apple going down and a feather going up.' }],
      ['Heavier objects are harder to lift', 'Lighter objects are easier to lift', 'A balance scale shows which is heavier'],
      'Fun Fact: A hummingbird weighs less than a nickel!',
      [mcq('Which is heavier?', ['Feather', 'Book', 'Paper', 'None of the above'], 1),
       tf('A bowling ball is lighter than a tennis ball.', false),
       mcq('On a balance scale, the heavier side goes...', ['Up', 'Down', 'Sideways', 'None of the above'], 1),
       mcq('Which is lightest?', ['Watermelon', 'Grape', 'Pumpkin', 'None of the above'], 1),
       tf('An elephant is heavier than a dog.', true)]
    )
  ]
});

// ── GRADE 2 ──────────────────────────────────────────────────────
newMath.push({
  grade: 2, loop: 'place_value', title: 'Place Value',
  links: [
    link('tens_and_ones', 'Tens and Ones',
      [{ heading: 'Breaking Numbers Apart', content: 'Every two-digit number has TENS and ONES. In the number 34, the 3 means 3 tens (30) and the 4 means 4 ones. So 34 = 30 + 4.', visual: '34 = 🟦🟦🟦 (3 tens) + 🟢🟢🟢🟢 (4 ones)' },
       { heading: 'Value Changes by Position', content: 'The same digit means different things depending on its position! In 52, the 5 is worth 50. In 25, the 5 is worth just 5.', visual: '52: five TENS (50) + two ONES (2) | 25: two TENS (20) + five ONES (5)' }],
      ['Tens place is on the left', 'Ones place is on the right', '34 = 3 tens + 4 ones = 30 + 4'],
      'Fun Fact: The number 10 is special because our whole number system is built around groups of 10!',
      [mcq('In the number 47, what digit is in the tens place?', ['7', '4', '47', 'None of the above'], 1),
       mcq('What is 5 tens and 3 ones?', ['35', '53', '503', 'None of the above'], 1),
       tf('In 82, the 8 means 80.', true),
       mcq('Which number has 6 in the ones place?', ['60', '16', '61', 'None of the above'], 1),
       mcq('30 + 7 = ?', ['307', '37', '73', 'None of the above'], 1)]
    ),
    link('hundreds_place', 'Hundreds',
      [{ heading: 'Three Digits!', content: 'Numbers can have hundreds too! In 245, the 2 means 2 hundreds (200), the 4 means 4 tens (40), and the 5 means 5 ones.', visual: '245 = 🟥🟥 (2 hundreds) + 🟦🟦🟦🟦 (4 tens) + 🟢🟢🟢🟢🟢 (5 ones)' },
       { heading: 'Building Big Numbers', content: '100 is 10 groups of 10. 200 is 20 groups of 10. The hundreds place tells us how many groups of 100 we have.', visual: 'Stack 10 rows of 10 blocks = 100 blocks!' }],
      ['Hundreds place is the third digit from the right', '100 = 10 tens', '245 = 200 + 40 + 5'],
      'Fun Fact: The first person to use the number zero was an ancient Indian mathematician named Brahmagupta!',
      [mcq('In 365, what digit is in the hundreds place?', ['5', '6', '3', 'None of the above'], 2),
       mcq('What is 4 hundreds, 2 tens, 1 one?', ['421', '412', '241', 'None of the above'], 0),
       tf('In 709, the 0 means there are no tens.', true),
       mcq('200 + 50 + 8 = ?', ['258', '2508', '285', 'None of the above'], 0),
       mcq('How many tens in 100?', ['1', '10', '100', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 2, loop: 'money_basics', title: 'Money Math',
  links: [
    link('coins_value', 'Coin Values',
      [{ heading: 'Know Your Coins', content: 'A penny is worth 1 cent. A nickel is 5 cents. A dime is 10 cents. A quarter is 25 cents. Even though a dime is smaller than a nickel, it\'s worth MORE!', visual: '🪙 Penny = 1¢ | Nickel = 5¢ | Dime = 10¢ | Quarter = 25¢' },
       { heading: 'Counting Coins', content: 'To count mixed coins, start with the biggest coins first! Count quarters, then dimes, then nickels, then pennies.', visual: 'Quarter (25¢) + dime (35¢) + nickel (40¢) + penny (41¢) = 41 cents!' }],
      ['Penny = 1¢, Nickel = 5¢, Dime = 10¢, Quarter = 25¢', 'Count from biggest to smallest coin', 'A dime is worth more than a nickel even though it\'s smaller'],
      'Fun Fact: The ridges on quarters and dimes were originally added so people couldn\'t shave off the edges!',
      [mcq('How much is a quarter worth?', ['5 cents', '10 cents', '25 cents', 'None of the above'], 2),
       mcq('How many nickels make a quarter?', ['3', '4', '5', 'None of the above'], 2),
       tf('A dime is worth more than a nickel.', true),
       mcq('2 quarters = ?', ['25 cents', '50 cents', '75 cents', 'None of the above'], 1),
       mcq('Which coin is worth the least?', ['Nickel', 'Dime', 'Penny', 'None of the above'], 2)]
    ),
    link('making_change', 'Making Change',
      [{ heading: 'Getting Change Back', content: 'If something costs 30 cents and you pay with 2 quarters (50 cents), you get 20 cents back! Change = what you paid - the price.', visual: 'Pay 50¢ for a 30¢ item. Change = 50¢ - 30¢ = 20¢ back!' },
       { heading: 'Counting Up', content: 'You can count up from the price to what you paid. If the item is 35¢ and you paid 50¢: 35, 40, 45, 50 — that\'s 15¢ change!', visual: '35¢ → 40¢ (nickel) → 50¢ (dime) = 15¢ change' }],
      ['Change = amount paid - price', 'Count up from the price', 'Always check your change!'],
      'Fun Fact: Paper money in America isn\'t made from paper — it\'s made from a blend of cotton and linen!',
      [mcq('You pay 50¢ for a 35¢ item. What\'s your change?', ['10¢', '15¢', '20¢', 'None of the above'], 1),
       mcq('A toy costs 75¢. You pay $1.00. What change do you get?', ['15¢', '25¢', '50¢', 'None of the above'], 1),
       tf('If you pay exactly the right amount, you get no change.', true),
       mcq('Which coins make 25¢ change?', ['2 dimes and 1 nickel', '3 dimes', '5 pennies', 'None of the above'], 0),
       mcq('You buy a 60¢ candy with 3 quarters. Your change is...', ['10¢', '15¢', '25¢', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 2, loop: 'time_telling', title: 'Telling Time',
  links: [
    link('hours_oclock', 'O\'Clock Times',
      [{ heading: 'The Clock Face', content: 'A clock has 2 hands. The short hand shows the HOUR. The long hand shows MINUTES. When the long hand points to 12, it\'s "o\'clock."', visual: '🕐 When both hands point up, it\'s 12 o\'clock!' },
       { heading: 'Reading Hours', content: 'The short hand points to the hour number. If it points to 3 and the long hand points to 12, it\'s 3 o\'clock.', visual: '🕒 Short hand on 3, long hand on 12 = 3:00' }],
      ['Short hand = hours, Long hand = minutes', 'O\'clock means the minute hand is on 12', 'There are 12 hours on a clock face'],
      'Fun Fact: Before clocks were invented, people used sundials that told time using shadows from the sun!',
      [mcq('Which hand shows the hour?', ['Long hand', 'Short hand', 'Second hand', 'None of the above'], 1),
       mcq('If the short hand points to 5 and long hand to 12, what time is it?', ['12:05', '5:00', '5:12', 'None of the above'], 1),
       tf('3 o\'clock means the minute hand points to 12.', true),
       mcq('How many numbers are on a clock?', ['10', '12', '24', 'None of the above'], 1),
       tf('The long hand shows the hour.', false)]
    ),
    link('half_hour', 'Half Past',
      [{ heading: 'Half Past the Hour', content: 'When the long hand points to 6, it\'s "half past" the hour. The long hand has gone halfway around. Half past 2 is 2:30.', visual: '🕝 Long hand on 6, short hand between 2 and 3 = 2:30' },
       { heading: '30 Minutes', content: 'Half past means 30 minutes after the hour. There are 60 minutes in an hour, and half of 60 is 30!', visual: 'The minute hand travels from 12 all the way to 6 = 30 minutes' }],
      ['Half past means :30', 'The minute hand points to 6 at half past', '30 minutes = half an hour'],
      'Fun Fact: The phrase "o\'clock" is short for "of the clock" — people used to say "it is 3 of the clock!"',
      [mcq('What time is "half past 4"?', ['4:15', '4:30', '4:45', 'None of the above'], 1),
       mcq('When it\'s half past, the long hand points to...', ['3', '6', '12', 'None of the above'], 1),
       tf('Half past means 30 minutes after the hour.', true),
       mcq('How many minutes in a half hour?', ['15', '30', '45', 'None of the above'], 1),
       mcq('Half past 8 is the same as...', ['8:00', '8:15', '8:30', 'None of the above'], 2)]
    )
  ]
});

newMath.push({
  grade: 2, loop: 'word_problems', title: 'Story Problems',
  links: [
    link('add_word_problems', 'Addition Stories',
      [{ heading: 'Word Problem Clues', content: 'Word problems tell a story with numbers. Key words for addition: "in all," "total," "together," "combined," "both."', visual: 'Sam has 8 stickers. He gets 5 more. How many in all? 8 + 5 = 13' },
       { heading: 'Draw It Out', content: 'When you\'re stuck, draw a picture! Draw the objects in the problem, then count them all together.', visual: '🍎🍎🍎🍎🍎🍎🍎🍎 + 🍎🍎🍎🍎🍎 = 13 apples total' }],
      ['Look for clue words: total, in all, together', 'Draw pictures to help solve', 'Write the number sentence (equation) last'],
      'Fun Fact: The word "mathematics" comes from a Greek word meaning "learning"!',
      [mcq('Amy has 7 books. She buys 4 more. How many in all?', ['3', '10', '11', 'None of the above'], 2),
       mcq('Which word means you should ADD?', ['left over', 'total', 'fewer', 'None of the above'], 1),
       mcq('Tom has 6 red fish and 8 blue fish. How many fish total?', ['2', '14', '12', 'None of the above'], 1),
       tf('The word "together" is a clue for addition.', true),
       mcq('12 birds are in a tree. 5 more come. How many now?', ['7', '15', '17', 'None of the above'], 2)]
    ),
    link('sub_word_problems', 'Subtraction Stories',
      [{ heading: 'Taking Away in Stories', content: 'Subtraction word problems use words like: "left," "remaining," "fewer," "how many more," "difference."', visual: 'There are 15 balloons. 6 pop. How many are left? 15 - 6 = 9' },
       { heading: 'Comparison Problems', content: '"How many more" also means subtract! If Sara has 12 stickers and Tom has 8, how many more does Sara have? 12 - 8 = 4 more.', visual: 'Sara: 🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟 (12) | Tom: 🌟🌟🌟🌟🌟🌟🌟🌟 (8) | Difference: 4' }],
      ['Clue words: left, remaining, fewer, difference', '"How many more" means subtract', 'Comparison problems use subtraction too'],
      'Fun Fact: Ancient Egyptians wrote math problems on papyrus scrolls over 3,600 years ago!',
      [mcq('A baker had 20 cookies. She sold 8. How many left?', ['12', '28', '10', 'None of the above'], 0),
       mcq('Which is a subtraction clue word?', ['total', 'combined', 'remaining', 'None of the above'], 2),
       tf('"How many more" means you should add.', false),
       mcq('Ben has 15 marbles. Jake has 9. How many MORE does Ben have?', ['4', '6', '24', 'None of the above'], 1),
       mcq('There are 18 students. 7 go home. How many are left?', ['11', '12', '25', 'None of the above'], 0)]
    )
  ]
});

// ── GRADE 3 ──────────────────────────────────────────────────────
newMath.push({
  grade: 3, loop: 'mult_tables', title: 'Times Tables Mastery',
  links: [
    link('times_6_7', 'Times 6 and 7',
      [{ heading: 'The 6 Times Table', content: 'The 6 times table builds on the 3s! Just double each answer from the 3s table. 3×4=12, so 6×4=24. Pattern: 6, 12, 18, 24, 30, 36...', visual: '6×1=6 | 6×2=12 | 6×3=18 | 6×4=24 | 6×5=30' },
       { heading: 'The 7 Times Table', content: 'The 7s are trickier, but you can use a pattern. 7, 14, 21, 28, 35, 42, 49, 56, 63, 70. Notice: the ones digits go 7, 4, 1, 8, 5, 2, 9, 6, 3, 0!', visual: '7×1=7 | 7×2=14 | 7×3=21 | 7×4=28 | 7×5=35 | 7×6=42 | 7×7=49' }],
      ['6× table is double the 3× table', '7×7=49 — a key fact to memorize', 'Practice makes these automatic!'],
      'Fun Fact: There are 7 days in a week, so 7×4 tells you how many days in 4 weeks (28)!',
      [mcq('What is 6 × 5?', ['25', '30', '35', 'None of the above'], 1),
       mcq('What is 7 × 4?', ['21', '24', '28', 'None of the above'], 2),
       mcq('What is 6 × 8?', ['42', '48', '54', 'None of the above'], 1),
       tf('7 × 7 = 49', true),
       mcq('What is 7 × 9?', ['56', '63', '72', 'None of the above'], 1)]
    ),
    link('times_8_9', 'Times 8 and 9',
      [{ heading: 'The 8 Times Table', content: 'The 8s are double the 4s! 4×3=12, so 8×3=24. Pattern: 8, 16, 24, 32, 40, 48, 56, 64, 72, 80.', visual: '8×1=8 | 8×2=16 | 8×3=24 | 8×4=32 | 8×5=40' },
       { heading: 'The 9s Finger Trick', content: 'Here\'s a cool trick for 9s: Hold up 10 fingers. For 9×3, put down finger #3. You\'ll have 2 fingers before it and 7 after = 27!', visual: 'For 9×4: put down finger 4. Fingers before: 3, fingers after: 6. Answer: 36!' }],
      ['8× table is double the 4× table', '9s trick: digits always add to 9 (e.g., 2+7=9, 3+6=9)', '9×table: the tens digit goes up by 1 each time'],
      'Fun Fact: An octopus has 8 arms — so 3 octopuses have 8×3 = 24 arms!',
      [mcq('What is 8 × 7?', ['54', '56', '58', 'None of the above'], 1),
       mcq('What is 9 × 6?', ['45', '54', '63', 'None of the above'], 1),
       tf('In 9×5=45, the digits 4+5=9.', true),
       mcq('What is 8 × 8?', ['62', '64', '66', 'None of the above'], 1),
       mcq('What is 9 × 9?', ['72', '81', '89', 'None of the above'], 1)]
    ),
    link('times_mixed_drill', 'Mixed Multiplication',
      [{ heading: 'Mix It Up!', content: 'Now that you know all the tables from 1 to 9, let\'s practice mixing them up. Knowing multiplication facts quickly helps with division, fractions, and algebra later!', visual: 'Flash cards: 7×8=? 6×9=? 8×4=? Challenge yourself to answer in under 3 seconds!' },
       { heading: 'Commutative Property', content: 'Remember: the order doesn\'t matter! 7×8 = 8×7 = 56. This means you already know TWICE as many facts as you think!', visual: '3×4 = 4×3 = 12 — they give the same answer!' }],
      ['Multiplication is commutative: a×b = b×a', 'Practice facts until they\'re automatic', 'Knowing facts by heart saves time in harder math'],
      'Fun Fact: There are only 36 unique multiplication facts from 2×2 to 9×9 — you probably already know most of them!',
      [mcq('What is 7 × 8?', ['54', '56', '58', 'None of the above'], 1),
       mcq('What is 6 × 9?', ['45', '54', '63', 'None of the above'], 1),
       mcq('If 5 × 4 = 20, then 4 × 5 = ?', ['15', '20', '25', 'None of the above'], 1),
       tf('3 × 7 = 7 × 3', true),
       mcq('What is 8 × 9?', ['63', '72', '81', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 3, loop: 'division_basics', title: 'Division Basics',
  links: [
    link('sharing_equally', 'Sharing Equally',
      [{ heading: 'What Is Division?', content: 'Division means sharing equally. If you have 12 cookies and 4 friends, each friend gets 12 ÷ 4 = 3 cookies!', visual: '🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪🍪 shared among 4 friends = 3 each' },
       { heading: 'Division and Multiplication', content: 'Division is the opposite of multiplication. If 3 × 4 = 12, then 12 ÷ 4 = 3 and 12 ÷ 3 = 4.', visual: 'Fact family: 3×4=12, 4×3=12, 12÷3=4, 12÷4=3' }],
      ['Division means equal sharing', 'Division is the opposite of multiplication', '12 ÷ 4 = 3 because 3 × 4 = 12'],
      'Fun Fact: The division sign (÷) is called an "obelus" and was first used in a math book in 1659!',
      [mcq('15 ÷ 3 = ?', ['3', '5', '12', 'None of the above'], 1),
       mcq('If 4 × 6 = 24, then 24 ÷ 6 = ?', ['3', '4', '6', 'None of the above'], 1),
       tf('20 ÷ 5 = 4', true),
       mcq('18 candies shared by 3 kids. Each gets...', ['5', '6', '9', 'None of the above'], 1),
       mcq('Which is 36 ÷ 4?', ['8', '9', '10', 'None of the above'], 1)]
    ),
    link('remainders_intro', 'Remainders',
      [{ heading: 'Leftovers!', content: 'Sometimes things don\'t share equally. 13 ÷ 4 = 3 remainder 1 (written 3 R1). Each person gets 3, and there\'s 1 left over!', visual: '🍬13 candies ÷ 4 kids = 3 each with 1 remaining: 🍬' },
       { heading: 'Finding Remainders', content: 'To find the remainder: multiply the answer by the divisor, then subtract from the total. 13 ÷ 4: 4×3=12, 13-12=1 remainder.', visual: '17 ÷ 5: 5×3=15, 17-15=2. Answer: 3 R2' }],
      ['Remainder = what\'s left over', 'The remainder is always less than the divisor', 'R stands for "remainder"'],
      'Fun Fact: Remainders are used in secret codes! Computers use them constantly in encryption.',
      [mcq('What is 14 ÷ 3?', ['4 R1', '4 R2', '5 R1', 'None of the above'], 1),
       mcq('What is 23 ÷ 5?', ['4 R2', '4 R3', '5 R3', 'None of the above'], 1),
       tf('The remainder is always smaller than the number you divide by.', true),
       mcq('What is 19 ÷ 4?', ['4 R3', '5 R1', '4 R2', 'None of the above'], 0),
       mcq('10 ÷ 5 has a remainder of...', ['0', '1', '2', 'None of the above'], 0)]
    )
  ]
});

newMath.push({
  grade: 3, loop: 'measurement_g3', title: 'Measurement & Data',
  links: [
    link('length_units', 'Inches, Feet, Yards',
      [{ heading: 'Measuring Length', content: 'We measure length in inches, feet, and yards. 12 inches = 1 foot. 3 feet = 1 yard. A ruler is 1 foot long. A yardstick is 3 feet long.', visual: '📏 1 foot = 12 inches | 1 yard = 3 feet = 36 inches' },
       { heading: 'Choosing the Right Unit', content: 'Use inches for small things (pencils, bugs). Use feet for medium things (people, desks). Use yards for big things (football fields, rooms).', visual: 'Pencil → inches | Your height → feet | Football field → yards' }],
      ['12 inches = 1 foot', '3 feet = 1 yard', 'Choose the best unit for what you\'re measuring'],
      'Fun Fact: A football field is 100 yards long — that\'s 300 feet or 3,600 inches!',
      [mcq('How many inches in a foot?', ['10', '12', '24', 'None of the above'], 1),
       mcq('How many feet in a yard?', ['2', '3', '4', 'None of the above'], 1),
       tf('A yard is longer than a foot.', true),
       mcq('What unit would you use to measure a pencil?', ['Yards', 'Feet', 'Inches', 'None of the above'], 2),
       mcq('2 feet = how many inches?', ['20', '22', '24', 'None of the above'], 2)]
    ),
    link('reading_graphs', 'Bar Graphs & Pictographs',
      [{ heading: 'Bar Graphs', content: 'Bar graphs use bars of different heights to show data. The taller the bar, the bigger the number. Always read the scale on the side!', visual: 'Favorite Fruits: 🍎 Apple=8, 🍌 Banana=5, 🍊 Orange=3 — Apple has the tallest bar!' },
       { heading: 'Pictographs', content: 'Pictographs use pictures or symbols. Each picture might represent more than 1! Check the key. If 🌟 = 2, then 🌟🌟🌟 = 6.', visual: 'Books Read: Tom 🌟🌟🌟 (6 books), Sara 🌟🌟🌟🌟 (8 books) — Key: 🌟 = 2 books' }],
      ['Bar height shows the amount', 'Always read the scale or key', 'Pictograph symbols can represent more than 1'],
      'Fun Fact: The first bar graph was created by William Playfair in 1786 — he invented them to show trade data!',
      [mcq('In a bar graph, a taller bar means...', ['Less of something', 'More of something', 'The same', 'None of the above'], 1),
       mcq('If 🌟 = 3 and there are 4 stars, the total is...', ['4', '7', '12', 'None of the above'], 2),
       tf('A pictograph always uses one picture to mean one item.', false),
       mcq('What should you always check on a pictograph?', ['The title only', 'The key or legend', 'The colors', 'None of the above'], 1),
       mcq('Which graph uses pictures instead of bars?', ['Bar graph', 'Pictograph', 'Line graph', 'None of the above'], 1)]
    )
  ]
});

// ── GRADE 4 ──────────────────────────────────────────────────────
newMath.push({
  grade: 4, loop: 'multi_digit_mult', title: 'Multi-Digit Multiplication',
  links: [
    link('multiply_by_10_100', 'Multiplying by 10 and 100',
      [{ heading: 'The Zero Pattern', content: 'Multiplying by 10 just adds a zero! 34 × 10 = 340. Multiplying by 100 adds two zeros! 34 × 100 = 3,400.', visual: '5 × 10 = 50 | 5 × 100 = 500 | 5 × 1,000 = 5,000' },
       { heading: 'Why Zeros?', content: 'When you multiply by 10, every digit moves one place to the left. The ones become tens, tens become hundreds. A zero fills the empty ones place.', visual: '23 × 10: the 2 moves to hundreds, the 3 moves to tens → 230' }],
      ['Multiplying by 10 adds one zero', 'Multiplying by 100 adds two zeros', 'Digits shift left on the place value chart'],
      'Fun Fact: A googol is the number 1 followed by 100 zeros — that\'s 10 multiplied by itself 100 times!',
      [mcq('What is 45 × 10?', ['405', '450', '4,500', 'None of the above'], 1),
       mcq('What is 7 × 100?', ['70', '700', '7,000', 'None of the above'], 1),
       tf('30 × 10 = 300', true),
       mcq('What is 120 × 10?', ['1,200', '12,000', '1,020', 'None of the above'], 0),
       mcq('25 × 100 = ?', ['250', '2,500', '25,000', 'None of the above'], 1)]
    ),
    link('two_digit_mult', 'Two-Digit × One-Digit',
      [{ heading: 'Break It Apart', content: 'To multiply 23 × 4, break 23 into 20 + 3. Then: 20×4=80 and 3×4=12. Add them: 80+12=92!', visual: '23 × 4 = (20×4) + (3×4) = 80 + 12 = 92' },
       { heading: 'Standard Algorithm', content: 'You can also stack the numbers. Multiply ones first (3×4=12, write 2, carry 1). Then tens (2×4=8, plus the carried 1 = 9). Answer: 92.', visual: '  23\n×  4\n----\n  92' }],
      ['Break numbers into tens and ones', 'Multiply each part, then add', 'Don\'t forget to carry!'],
      'Fun Fact: The method of multiplying by breaking numbers apart is called the "distributive property"!',
      [mcq('What is 32 × 3?', ['93', '96', '99', 'None of the above'], 1),
       mcq('What is 15 × 4?', ['45', '55', '60', 'None of the above'], 2),
       mcq('24 × 5 = ?', ['100', '110', '120', 'None of the above'], 2),
       tf('In 46 × 2, you multiply 6×2 first, then 4×2.', true),
       mcq('What is 37 × 2?', ['64', '74', '77', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 4, loop: 'fractions_g4', title: 'Fractions Deep Dive',
  links: [
    link('equivalent_fractions', 'Equivalent Fractions',
      [{ heading: 'Same Amount, Different Look', content: '1/2 is the same as 2/4 is the same as 4/8. These are equivalent fractions — they represent the same part of a whole!', visual: 'Pizza cut into 2 slices: 1 slice = 1/2. Same pizza cut into 4 slices: 2 slices = 2/4. Same amount of pizza!' },
       { heading: 'Multiply Both Parts', content: 'To find equivalent fractions, multiply both the numerator and denominator by the same number. 1/3 = 2/6 = 3/9 = 4/12.', visual: '1/3 × 2/2 = 2/6 | 1/3 × 3/3 = 3/9 — same fraction, different names!' }],
      ['Equivalent fractions have the same value', 'Multiply top and bottom by the same number', '1/2 = 2/4 = 3/6 = 4/8 = 5/10'],
      'Fun Fact: The word "fraction" comes from the Latin word "fractio" meaning "to break" — fractions break wholes into parts!',
      [mcq('Which fraction equals 1/2?', ['1/3', '2/4', '3/5', 'None of the above'], 1),
       mcq('What is 2/3 equivalent to?', ['4/5', '4/6', '3/4', 'None of the above'], 1),
       tf('1/4 and 2/8 are equivalent fractions.', true),
       mcq('To make 3/5 equivalent, multiply by 2/2 to get...', ['5/7', '6/10', '6/7', 'None of the above'], 1),
       mcq('Which is NOT equivalent to 1/3?', ['2/6', '3/9', '2/5', 'None of the above'], 2)]
    ),
    link('comparing_fractions', 'Comparing Fractions',
      [{ heading: 'Same Denominator', content: 'When fractions have the same denominator, just compare the numerators! 3/8 > 2/8 because 3 > 2.', visual: '3/8 of a pie is MORE than 2/8 of a pie — more slices!' },
       { heading: 'Different Denominators', content: 'When denominators are different, find a common denominator first. Compare 1/3 and 1/4: Make them both over 12. 1/3 = 4/12, 1/4 = 3/12. So 1/3 > 1/4!', visual: '1/3 = 4/12 and 1/4 = 3/12. Since 4 > 3, we know 1/3 > 1/4.' }],
      ['Same denominator: compare numerators directly', 'Different denominators: find common denominator first', 'Bigger denominator = smaller pieces (1/8 < 1/4)'],
      'Fun Fact: Ancient Egyptians only used fractions with 1 on top (unit fractions) like 1/2, 1/3, 1/4!',
      [mcq('Which is bigger: 3/5 or 2/5?', ['2/5', '3/5', 'They\'re equal', 'None of the above'], 1),
       mcq('Which is bigger: 1/3 or 1/5?', ['1/5', '1/3', 'They\'re equal', 'None of the above'], 1),
       tf('1/2 > 1/4', true),
       mcq('Compare 2/3 and 3/4. Which is bigger?', ['2/3', '3/4', 'They\'re equal', 'None of the above'], 1),
       tf('5/8 < 3/8', false)]
    ),
    link('fraction_addition', 'Adding Fractions',
      [{ heading: 'Same Denominator', content: 'Adding fractions with the same denominator is easy — just add the numerators! 2/7 + 3/7 = 5/7. The denominator stays the same.', visual: '2/7 + 3/7 = 5/7 — add the tops, keep the bottom!' },
       { heading: 'Different Denominators', content: 'If denominators are different, find a common denominator first. 1/4 + 1/3: common denominator is 12. 3/12 + 4/12 = 7/12.', visual: '1/4 = 3/12 and 1/3 = 4/12, so 1/4 + 1/3 = 3/12 + 4/12 = 7/12' }],
      ['Same denominator: add numerators, keep denominator', 'Different denominators: find common denominator first', 'Always simplify your answer if possible'],
      'Fun Fact: The line between the numerator and denominator is called a "vinculum" — it\'s Latin for "bond"!',
      [mcq('What is 2/5 + 1/5?', ['3/10', '3/5', '1/5', 'None of the above'], 1),
       mcq('What is 1/4 + 2/4?', ['3/8', '3/4', '1/2', 'None of the above'], 1),
       tf('3/8 + 2/8 = 5/8', true),
       mcq('1/3 + 1/6 = ?', ['2/9', '1/2', '2/6', 'None of the above'], 1),
       mcq('3/10 + 4/10 = ?', ['7/20', '7/10', '1/10', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 4, loop: 'factors_multiples', title: 'Factors & Multiples',
  links: [
    link('finding_factors', 'Finding Factors',
      [{ heading: 'What Are Factors?', content: 'Factors are numbers that divide evenly into another number. The factors of 12 are: 1, 2, 3, 4, 6, and 12 because all of them divide into 12 with no remainder.', visual: 'Factors of 12: 1×12, 2×6, 3×4 → {1, 2, 3, 4, 6, 12}' },
       { heading: 'Factor Pairs', content: 'Factors come in pairs that multiply to make the number. For 20: 1×20, 2×10, 4×5. So the factors are {1, 2, 4, 5, 10, 20}.', visual: '20 = 1×20 = 2×10 = 4×5 → six factors total' }],
      ['Factors divide evenly (no remainder)', 'Factors come in pairs', '1 and the number itself are always factors'],
      'Fun Fact: The number 1 is a factor of EVERY number — it divides evenly into anything!',
      [mcq('Which is a factor of 15?', ['4', '5', '6', 'None of the above'], 1),
       mcq('How many factors does 10 have?', ['2', '3', '4', 'None of the above'], 2),
       tf('7 is a factor of 21.', true),
       mcq('Which number has the most factors: 8, 10, or 12?', ['8', '10', '12', 'None of the above'], 2),
       mcq('The factor pairs of 16 are 1×16, 2×8, and...', ['3×5', '4×4', '5×3', 'None of the above'], 1)]
    ),
    link('multiples_intro', 'Understanding Multiples',
      [{ heading: 'What Are Multiples?', content: 'Multiples are what you get when you multiply a number by 1, 2, 3, 4... Multiples of 3: 3, 6, 9, 12, 15, 18... They go on forever!', visual: 'Multiples of 5: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50...' },
       { heading: 'Common Multiples', content: 'A common multiple is shared by two numbers. Multiples of 4: 4, 8, 12, 16, 20... Multiples of 6: 6, 12, 18, 24... 12 is a common multiple!', visual: '4: 4, 8, [12], 16, 20, [24]... | 6: 6, [12], 18, [24]... | LCM = 12' }],
      ['Multiples = the number × 1, 2, 3, 4...', 'Multiples go on forever', 'The LCM is the smallest common multiple'],
      'Fun Fact: Every number is a multiple of 1 and a multiple of itself!',
      [mcq('Which is a multiple of 4?', ['10', '14', '16', 'None of the above'], 2),
       mcq('What is the 5th multiple of 3?', ['12', '15', '18', 'None of the above'], 1),
       tf('20 is a multiple of both 4 and 5.', true),
       mcq('What is the LCM of 3 and 4?', ['7', '12', '24', 'None of the above'], 1),
       mcq('Which is NOT a multiple of 6?', ['18', '24', '32', 'None of the above'], 2)]
    )
  ]
});

// ── GRADE 5 ──────────────────────────────────────────────────────
newMath.push({
  grade: 5, loop: 'decimal_operations', title: 'Decimal Operations',
  links: [
    link('multiplying_decimals', 'Multiplying Decimals',
      [{ heading: 'Multiply Like Whole Numbers', content: 'To multiply decimals, first ignore the decimal points and multiply as whole numbers. Then count the total decimal places in both numbers and put the decimal point that many places from the right.', visual: '2.3 × 1.4: Multiply 23 × 14 = 322. Two decimal places total → 3.22' },
       { heading: 'Estimate First', content: 'Always estimate before multiplying to check if your answer makes sense. 2.3 × 1.4 ≈ 2 × 1.5 = 3. Our answer 3.22 is close to 3 ✓', visual: '6.5 × 3 ≈ 7 × 3 = 21. Exact: 19.5. Close enough ✓' }],
      ['Ignore decimals, multiply, then place the decimal', 'Count total decimal places in both factors', 'Estimate first to check your answer'],
      'Fun Fact: Decimals were invented by a Flemish mathematician named Simon Stevin in 1585!',
      [mcq('What is 1.2 × 3?', ['3.6', '36', '0.36', 'None of the above'], 0),
       mcq('What is 0.5 × 0.4?', ['0.2', '2.0', '0.02', 'None of the above'], 0),
       tf('2.5 × 4 = 10.0', true),
       mcq('How many decimal places in the answer of 1.3 × 2.1?', ['1', '2', '3', 'None of the above'], 1),
       mcq('What is 3.2 × 5?', ['15.0', '16.0', '1.60', 'None of the above'], 1)]
    ),
    link('dividing_decimals', 'Dividing Decimals',
      [{ heading: 'Dividing by Whole Numbers', content: 'To divide a decimal by a whole number, just divide normally and bring the decimal point straight up! 4.8 ÷ 2 = 2.4', visual: '  2.4\n2)4.8\n  -4\n  --\n   08\n   -8\n   --\n    0' },
       { heading: 'Dividing by Decimals', content: 'To divide by a decimal, move both decimal points right until the divisor is a whole number. 6.3 ÷ 0.9 → 63 ÷ 9 = 7', visual: '6.3 ÷ 0.9 → move both one place → 63 ÷ 9 = 7' }],
      ['Bring the decimal straight up when dividing', 'Move decimal points to make the divisor a whole number', 'Always check: answer × divisor should = dividend'],
      'Fun Fact: The decimal point is called a "period" in some countries and a "comma" in others!',
      [mcq('What is 8.4 ÷ 2?', ['4.2', '42', '0.42', 'None of the above'], 0),
       mcq('What is 3.6 ÷ 0.6?', ['0.6', '6', '60', 'None of the above'], 1),
       tf('7.5 ÷ 5 = 1.5', true),
       mcq('What is 12.6 ÷ 3?', ['4.2', '42', '3.2', 'None of the above'], 0),
       mcq('To divide by 0.2, you can multiply by...', ['2', '5', '0.5', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 5, loop: 'geometry_g5', title: 'Geometry & Volume',
  links: [
    link('volume_intro', 'Volume of Rectangular Prisms',
      [{ heading: 'What Is Volume?', content: 'Volume is the amount of space inside a 3D shape. We measure it in cubic units (like cubic centimeters or cubic inches). Think of filling a box with unit cubes!', visual: 'A box 3 cubes long × 2 cubes wide × 4 cubes tall = 3 × 2 × 4 = 24 cubic units' },
       { heading: 'The Formula', content: 'Volume = Length × Width × Height (V = l × w × h). For a box that\'s 5 cm × 3 cm × 2 cm: V = 5 × 3 × 2 = 30 cubic cm.', visual: 'V = l × w × h = 5 × 3 × 2 = 30 cm³' }],
      ['Volume = Length × Width × Height', 'Volume is measured in cubic units (cm³, in³)', 'Volume tells us how much space is inside a 3D shape'],
      'Fun Fact: An Olympic swimming pool has a volume of about 2,500 cubic meters — that\'s 2.5 million liters of water!',
      [mcq('What is the volume of a box 4×3×2?', ['9', '24', '20', 'None of the above'], 1),
       mcq('Volume is measured in...', ['Square units', 'Cubic units', 'Linear units', 'None of the above'], 1),
       tf('V = l × w × h', true),
       mcq('A cube with sides of 3 cm has a volume of...', ['9 cm³', '12 cm³', '27 cm³', 'None of the above'], 2),
       mcq('A box is 10×5×2. Its volume is...', ['17', '70', '100', 'None of the above'], 2)]
    ),
    link('coordinate_plane', 'Coordinate Plane',
      [{ heading: 'X and Y Axes', content: 'A coordinate plane has two number lines that cross: the x-axis (horizontal) and y-axis (vertical). They meet at the origin (0, 0).', visual: 'Draw a + shape. The horizontal line is x, the vertical line is y. Where they cross is (0,0).' },
       { heading: 'Plotting Points', content: 'Every point is written as (x, y). Start at the origin, go RIGHT by x, then UP by y. The point (3, 5) means: go right 3, up 5!', visual: '(3, 5) = start at origin → right 3 → up 5 → put a dot there!' }],
      ['x-axis is horizontal, y-axis is vertical', 'Points are written (x, y) — x first, y second', 'The origin is (0, 0)'],
      'Fun Fact: The coordinate plane was invented by René Descartes while lying in bed watching a fly on the ceiling!',
      [mcq('In the point (4, 7), what is the x-coordinate?', ['7', '4', '11', 'None of the above'], 1),
       mcq('Which axis goes up and down?', ['x-axis', 'y-axis', 'z-axis', 'None of the above'], 1),
       tf('The origin is at (0, 0).', true),
       mcq('To plot (2, 5) you go right __ then up __', ['5 then 2', '2 then 5', '7 then 0', 'None of the above'], 1),
       mcq('Which point is at the origin?', ['(1, 1)', '(0, 1)', '(0, 0)', 'None of the above'], 2)]
    )
  ]
});

newMath.push({
  grade: 5, loop: 'expressions_patterns', title: 'Expressions & Patterns',
  links: [
    link('variables_intro', 'Introduction to Variables',
      [{ heading: 'Letters in Math?!', content: 'A variable is a letter that stands for a number we don\'t know yet. In "x + 3 = 7," x is the variable. We can figure out x = 4 because 4 + 3 = 7!', visual: 'Think of x as a mystery box: 📦 + 3 = 7, so 📦 = 4!' },
       { heading: 'Writing Expressions', content: 'An expression uses numbers, variables, and operations. "5 more than a number" = n + 5. "Twice a number" = 2 × n or 2n.', visual: '"3 less than x" → x - 3 | "x divided by 4" → x ÷ 4' }],
      ['Variables are letters representing unknown numbers', 'Expressions combine numbers and variables', '"2n" means "2 times n"'],
      'Fun Fact: The letter x became the standard variable because of a printing press limitation — the printer didn\'t have enough letter blocks for other letters!',
      [mcq('If x + 5 = 12, what is x?', ['5', '7', '17', 'None of the above'], 1),
       mcq('How do you write "6 more than n"?', ['6n', 'n + 6', 'n - 6', 'None of the above'], 1),
       tf('In 3n, the 3 and n are multiplied.', true),
       mcq('If n = 4, what is 2n + 1?', ['7', '9', '11', 'None of the above'], 1),
       mcq('"A number divided by 5" is written as...', ['5n', '5 ÷ n', 'n ÷ 5', 'None of the above'], 2)]
    ),
    link('number_patterns', 'Number Patterns & Rules',
      [{ heading: 'Finding the Rule', content: 'Every pattern has a rule. Look at: 2, 5, 8, 11, 14... The rule is "add 3." Each number is 3 more than the last.', visual: '2 (+3)→ 5 (+3)→ 8 (+3)→ 11 (+3)→ 14 (+3)→ ...' },
       { heading: 'Two Patterns Together', content: 'You can compare patterns. Pattern A: 0, 3, 6, 9, 12 (rule: add 3). Pattern B: 0, 6, 12, 18, 24 (rule: add 6). Notice: Pattern B is always double Pattern A!', visual: 'A: 0, 3, 6, 9, 12 | B: 0, 6, 12, 18, 24 | B = 2 × A' }],
      ['Look for what changes between consecutive numbers', 'The rule can be adding, subtracting, multiplying, or dividing', 'Comparing patterns helps find relationships'],
      'Fun Fact: The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13...) appears in sunflower spirals, pinecones, and seashells!',
      [mcq('What\'s the next number: 4, 8, 12, 16, __?', ['18', '20', '24', 'None of the above'], 1),
       mcq('What\'s the rule for: 1, 4, 7, 10, 13?', ['Add 2', 'Add 3', 'Add 4', 'None of the above'], 1),
       tf('In the pattern 5, 10, 20, 40, the rule is "multiply by 2."', true),
       mcq('What comes next: 100, 90, 80, 70, __?', ['65', '60', '50', 'None of the above'], 1),
       mcq('Pattern: 2, 6, 18, 54. The rule is...', ['Add 4', 'Multiply by 2', 'Multiply by 3', 'None of the above'], 2)]
    )
  ]
});

// ── GRADE 6 ──────────────────────────────────────────────────────
newMath.push({
  grade: 6, loop: 'algebra_intro', title: 'Intro to Algebra',
  links: [
    link('solving_equations', 'Solving One-Step Equations',
      [{ heading: 'Balance It Out', content: 'An equation is like a balance scale — both sides must be equal. To solve x + 5 = 12, subtract 5 from BOTH sides: x = 7.', visual: '⚖️ x + 5 = 12 → subtract 5 from both → x = 7' },
       { heading: 'Inverse Operations', content: 'Use the opposite operation to solve! Addition ↔ Subtraction. Multiplication ↔ Division. For 3x = 15: divide both sides by 3, so x = 5.', visual: 'x + 4 = 10 → subtract 4 → x = 6 | 2x = 14 → divide by 2 → x = 7' }],
      ['Do the same thing to both sides of the equation', 'Use inverse operations to isolate the variable', 'Always check your answer by plugging it back in'],
      'Fun Fact: The word "algebra" comes from the Arabic word "al-jabr" meaning "reunion of broken parts"!',
      [mcq('Solve: x + 8 = 15', ['5', '7', '23', 'None of the above'], 1),
       mcq('Solve: 4x = 28', ['6', '7', '8', 'None of the above'], 1),
       tf('To solve x - 3 = 10, you add 3 to both sides.', true),
       mcq('Solve: x ÷ 5 = 6', ['1', '11', '30', 'None of the above'], 2),
       mcq('Solve: x - 12 = 25', ['13', '37', '300', 'None of the above'], 1)]
    ),
    link('two_step_equations', 'Two-Step Equations',
      [{ heading: 'Two Steps to Solve', content: 'Some equations need two steps. For 2x + 3 = 11: Step 1: subtract 3 from both sides → 2x = 8. Step 2: divide both sides by 2 → x = 4.', visual: '2x + 3 = 11 → 2x = 8 → x = 4 ✓ Check: 2(4) + 3 = 8 + 3 = 11 ✓' },
       { heading: 'Order Matters', content: 'Always undo addition/subtraction FIRST, then undo multiplication/division. Think of reverse PEMDAS!', visual: '3x - 7 = 14 → add 7 → 3x = 21 → divide by 3 → x = 7' }],
      ['Undo addition/subtraction first', 'Then undo multiplication/division', 'Always check your solution'],
      'Fun Fact: The equals sign (=) was invented in 1557 by Robert Recorde, who said "nothing is more equal than parallel lines"!',
      [mcq('Solve: 3x + 2 = 14', ['3', '4', '6', 'None of the above'], 1),
       mcq('Solve: 5x - 10 = 25', ['3', '5', '7', 'None of the above'], 2),
       tf('To solve 4x + 1 = 17, first subtract 1 from both sides.', true),
       mcq('Solve: x/3 + 4 = 10', ['2', '14', '18', 'None of the above'], 2),
       mcq('Solve: 2x - 5 = 9', ['2', '7', '14', 'None of the above'], 1)]
    )
  ]
});

newMath.push({
  grade: 6, loop: 'statistics_g6', title: 'Statistics & Data',
  links: [
    link('mean_median_mode', 'Mean, Median, Mode',
      [{ heading: 'Mean (Average)', content: 'The mean is the average. Add all values and divide by how many there are. For 4, 6, 8, 10, 12: Sum = 40, Count = 5, Mean = 40 ÷ 5 = 8.', visual: 'Mean of {3, 5, 7} = (3+5+7) ÷ 3 = 15 ÷ 3 = 5' },
       { heading: 'Median and Mode', content: 'Median = the middle value when numbers are ordered. Mode = the most frequent value. For 2, 3, 3, 5, 9: Median = 3, Mode = 3.', visual: 'Data: 1, 3, 3, 5, 7 → Median: 3 (middle), Mode: 3 (most common)' }],
      ['Mean = sum ÷ count', 'Median = middle value (in order)', 'Mode = most frequent value'],
      'Fun Fact: The word "statistics" comes from the Latin "status" meaning "state" — it was first used to analyze state data!',
      [mcq('Mean of 2, 4, 6?', ['3', '4', '6', 'None of the above'], 1),
       mcq('Median of 1, 3, 5, 7, 9?', ['3', '5', '7', 'None of the above'], 1),
       mcq('Mode of 2, 3, 3, 4, 5?', ['2', '3', '4', 'None of the above'], 1),
       tf('A data set can have no mode.', true),
       mcq('Mean of 10, 20, 30, 40?', ['20', '25', '30', 'None of the above'], 1)]
    ),
    link('box_plots', 'Box Plots & Range',
      [{ heading: 'Range', content: 'The range is the spread of data: highest value minus lowest value. For 3, 7, 8, 12, 15: Range = 15 - 3 = 12.', visual: 'Data: {2, 5, 8, 11, 14} → Range = 14 - 2 = 12' },
       { heading: 'Box Plots', content: 'A box plot shows data spread using 5 numbers: minimum, Q1, median, Q3, maximum. The "box" goes from Q1 to Q3, with a line at the median.', visual: 'Min---|---Q1====Median====Q3---|---Max' }],
      ['Range = maximum - minimum', 'Box plots show the spread of data', 'The box contains the middle 50% of data'],
      'Fun Fact: Box plots were invented by John Tukey in 1977 — they\'re also called "box and whisker plots"!',
      [mcq('Range of {3, 7, 10, 15, 20}?', ['13', '17', '20', 'None of the above'], 1),
       mcq('In a box plot, the line inside the box shows the...', ['Mean', 'Median', 'Mode', 'None of the above'], 1),
       tf('The range tells you the spread of data.', true),
       mcq('If the minimum is 5 and maximum is 25, the range is...', ['5', '15', '20', 'None of the above'], 2),
       mcq('The "whiskers" on a box plot extend to the...', ['Mean and mode', 'Q1 and Q3', 'Minimum and maximum', 'None of the above'], 2)]
    )
  ]
});

newMath.push({
  grade: 6, loop: 'geometry_g6', title: 'Geometry: Area & Surface Area',
  links: [
    link('area_triangles', 'Area of Triangles',
      [{ heading: 'Half a Rectangle', content: 'A triangle is half of a rectangle! The area formula is A = ½ × base × height. A triangle with base 6 and height 4: A = ½ × 6 × 4 = 12 square units.', visual: 'Draw a rectangle, draw a diagonal — each triangle is half the rectangle!' },
       { heading: 'Finding the Height', content: 'The height must be perpendicular (at a right angle) to the base. It might be inside or outside the triangle.', visual: 'Triangle: base = 10, height = 6 → A = ½ × 10 × 6 = 30 sq units' }],
      ['A = ½ × base × height', 'Height is perpendicular to the base', 'A triangle is half of a rectangle with the same base and height'],
      'Fun Fact: The ancient Egyptians used triangle geometry to build the pyramids over 4,500 years ago!',
      [mcq('Area of a triangle with base 8 and height 6?', ['14', '24', '48', 'None of the above'], 1),
       mcq('The formula for triangle area is...', ['b × h', '½ × b × h', '2 × b × h', 'None of the above'], 1),
       tf('A triangle with base 10 and height 4 has area 20.', true),
       mcq('A triangle has base 12 and height 5. Its area is...', ['17', '30', '60', 'None of the above'], 1),
       mcq('Why is triangle area ½ × b × h?', ['Triangles have 3 sides', 'A triangle is half a rectangle', 'Triangles are smaller', 'None of the above'], 1)]
    ),
    link('surface_area_prisms', 'Surface Area of Prisms',
      [{ heading: 'What Is Surface Area?', content: 'Surface area is the total area of ALL faces of a 3D shape. Imagine wrapping the shape in paper — the amount of paper needed is the surface area.', visual: 'A box has 6 faces. Add up the area of each face to get the total surface area.' },
       { heading: 'Rectangular Prism Formula', content: 'SA = 2lw + 2lh + 2wh. For a box 5×3×2: SA = 2(15) + 2(10) + 2(6) = 30 + 20 + 12 = 62 square units.', visual: 'SA = 2(5×3) + 2(5×2) + 2(3×2) = 30 + 20 + 12 = 62' }],
      ['Surface area = total area of all faces', 'SA = 2lw + 2lh + 2wh for rectangular prisms', 'Surface area is measured in square units'],
      'Fun Fact: If you unwrap a cereal box and lay it flat, you can see all 6 faces — that\'s called a "net"!',
      [mcq('A cube with side 4. Surface area?', ['16', '64', '96', 'None of the above'], 2),
       mcq('How many faces does a rectangular prism have?', ['4', '5', '6', 'None of the above'], 2),
       tf('Surface area is measured in cubic units.', false),
       mcq('SA of a box 2×3×4?', ['24', '52', '26', 'None of the above'], 1),
       mcq('Surface area measures...', ['Space inside', 'Total outer area', 'Weight', 'None of the above'], 1)]
    )
  ]
});

// ═══════════════════════════════════════════════════════════════════
// NEW SCIENCE CONTENT
// ═══════════════════════════════════════════════════════════════════
const newScience = [];

// ── GRADE 1 ──────────────────────────────────────────────────────
newScience.push({
  grade: 1, loop: 'seasons', title: 'The Four Seasons',
  links: [
    link('spring_summer', 'Spring & Summer',
      [{ heading: 'Spring Time!', content: 'In spring, the weather gets warmer. Flowers bloom, birds build nests, and baby animals are born. Trees grow new green leaves!', visual: '🌸🌷🐣 Spring: flowers blooming, birds chirping, rain showers' },
       { heading: 'Summer Sun', content: 'Summer is the warmest season. Days are long and sunny. Plants are green and full. Many fruits ripen in summer. It\'s great for swimming and playing outside!', visual: '☀️🏖️🍉 Summer: sunshine, beaches, watermelon, long days' }],
      ['Spring = flowers bloom, baby animals born', 'Summer = warmest season, longest days', 'Seasons change because Earth tilts as it orbits the Sun'],
      'Fun Fact: In Australia, summer starts in December and winter starts in June — opposite of the USA!',
      [mcq('In which season do flowers bloom?', ['Winter', 'Spring', 'Fall', 'None of the above'], 1),
       mcq('Which season is the warmest?', ['Spring', 'Summer', 'Fall', 'None of the above'], 1),
       tf('Days are longer in summer than in winter.', true),
       mcq('What happens to trees in spring?', ['Leaves fall off', 'New leaves grow', 'They freeze', 'None of the above'], 1),
       tf('It snows a lot in summer.', false)]
    ),
    link('fall_winter', 'Fall & Winter',
      [{ heading: 'Falling Leaves', content: 'In fall (autumn), leaves change colors — red, orange, yellow — and fall off trees. Animals gather food to prepare for winter. The temperature gets cooler.', visual: '🍂🍁🎃 Fall: colorful leaves, pumpkins, cooler weather' },
       { heading: 'Winter Wonderland', content: 'Winter is the coldest season. Days are short and dark. In many places, snow falls and lakes freeze. Some animals hibernate (sleep through winter)!', visual: '❄️⛄🧤 Winter: snow, cold, short days, warm coats' }],
      ['Fall = leaves change color and fall off', 'Winter = coldest season, shortest days', 'Some animals hibernate in winter'],
      'Fun Fact: Bears can sleep for up to 7 months during winter hibernation without eating or drinking!',
      [mcq('What happens to leaves in fall?', ['They grow bigger', 'They change color and fall', 'They turn blue', 'None of the above'], 1),
       mcq('Which season is the coldest?', ['Fall', 'Spring', 'Winter', 'None of the above'], 2),
       tf('Hibernation means animals sleep through winter.', true),
       mcq('In winter, days are...', ['Longer', 'Shorter', 'The same', 'None of the above'], 1),
       mcq('How many seasons are there?', ['2', '3', '4', 'None of the above'], 2)]
    )
  ]
});

newScience.push({
  grade: 1, loop: 'living_nonliving', title: 'Living vs Non-Living',
  links: [
    link('what_is_living', 'What Makes Something Alive?',
      [{ heading: 'Signs of Life', content: 'Living things grow, eat, breathe, move, and make babies (reproduce). A cat is living — it grows, eats, and has kittens. A rock is NOT living.', visual: '🐱 Living: grows, eats, breathes, moves, has kittens | 🪨 Not living: doesn\'t grow or eat' },
       { heading: 'Plants Are Living Too!', content: 'Plants are alive even though they don\'t walk around! They grow, need water and sunlight, make seeds, and respond to light by leaning toward it.', visual: '🌱 Plants grow toward light, drink water through roots, and make seeds!' }],
      ['Living things: grow, eat, breathe, reproduce', 'Plants are living things', 'Non-living things don\'t grow or need food'],
      'Fun Fact: The oldest living tree is over 5,000 years old — it\'s a bristlecone pine named Methuselah!',
      [mcq('Which is a living thing?', ['Rock', 'Chair', 'Flower', 'None of the above'], 2),
       tf('A teddy bear is a living thing.', false),
       mcq('Living things need...', ['TV and toys', 'Food, water, and air', 'Nothing', 'None of the above'], 1),
       mcq('Which is NOT true about living things?', ['They grow', 'They eat', 'They never change', 'None of the above'], 2),
       tf('Plants are living things.', true)]
    ),
    link('needs_of_living', 'What Living Things Need',
      [{ heading: 'Food and Water', content: 'All living things need food for energy and water to survive. Animals eat plants or other animals. Plants make their own food using sunlight!', visual: '🐕 Dog needs: food, water, air, shelter | 🌻 Sunflower needs: sunlight, water, soil, air' },
       { heading: 'Air and Shelter', content: 'Animals need air to breathe — oxygen goes into their lungs. They also need shelter (a safe home) to stay warm, dry, and protected from danger.', visual: '🏠 Birds build nests | 🐻 Bears live in caves | 🐟 Fish live in water' }],
      ['All living things need food, water, and air', 'Animals need shelter for protection', 'Plants need sunlight, water, and soil'],
      'Fun Fact: A camel can go up to 2 weeks without water — but even camels need water eventually!',
      [mcq('What do plants use to make food?', ['Soil only', 'Sunlight', 'Other plants', 'None of the above'], 1),
       mcq('Which is NOT a basic need of animals?', ['Food', 'Water', 'Television', 'None of the above'], 2),
       tf('Fish need water to survive.', true),
       mcq('What is shelter?', ['A type of food', 'A safe place to live', 'A kind of plant', 'None of the above'], 1),
       tf('Plants don\'t need air.', false)]
    )
  ]
});

// ── GRADE 2 ──────────────────────────────────────────────────────
newScience.push({
  grade: 2, loop: 'habitats', title: 'Animal Habitats',
  links: [
    link('forest_habitat', 'Forest Habitats',
      [{ heading: 'Life in the Forest', content: 'A forest is a habitat with many trees. Animals like deer, squirrels, owls, bears, and foxes live in forests. The trees provide food, shelter, and shade.', visual: '🌲🦌🦉🐿️ Forest animals: deer, owls, squirrels, bears, foxes' },
       { heading: 'Forest Layers', content: 'Forests have layers! The canopy (treetops) has birds and monkeys. The understory has smaller trees. The forest floor has insects, mushrooms, and fallen leaves.', visual: 'Top: canopy (birds) | Middle: understory (smaller trees) | Bottom: forest floor (bugs, mushrooms)' }],
      ['Forests provide food, shelter, and shade', 'Different animals live in different forest layers', 'Forests have a canopy, understory, and floor'],
      'Fun Fact: The Amazon Rainforest is so thick that it takes 10 minutes for rain to reach the ground after hitting the canopy!',
      [mcq('Which animal lives in a forest?', ['Camel', 'Penguin', 'Deer', 'None of the above'], 2),
       mcq('The top layer of a forest is called the...', ['Floor', 'Canopy', 'Basement', 'None of the above'], 1),
       tf('Trees provide shelter for forest animals.', true),
       mcq('Which animal might live in the forest canopy?', ['Worm', 'Bird', 'Frog', 'None of the above'], 1),
       tf('Deserts have more trees than forests.', false)]
    ),
    link('ocean_habitat', 'Ocean Habitats',
      [{ heading: 'Under the Sea', content: 'The ocean is the largest habitat on Earth! It\'s home to fish, whales, dolphins, sharks, sea turtles, and millions of tiny creatures called plankton.', visual: '🐙🐠🐋🦈 Ocean life: octopus, tropical fish, whales, sharks' },
       { heading: 'Saltwater World', content: 'Ocean water is salty — you can\'t drink it! The ocean has different zones: shallow water near shore (coral reefs), open water, and the deep, dark bottom.', visual: 'Shallow: coral reefs 🪸 | Open water: dolphins 🐬 | Deep: anglerfish 🐟' }],
      ['The ocean is the biggest habitat on Earth', 'Ocean water is salty', 'Different creatures live at different depths'],
      'Fun Fact: We\'ve explored more of the Moon\'s surface than the deep ocean floor!',
      [mcq('The ocean is mostly...', ['Fresh water', 'Salt water', 'Frozen water', 'None of the above'], 1),
       mcq('Which animal lives in the ocean?', ['Eagle', 'Tiger', 'Dolphin', 'None of the above'], 2),
       tf('Coral reefs are found in shallow ocean water.', true),
       mcq('What are plankton?', ['Big fish', 'Tiny sea creatures', 'Rocks', 'None of the above'], 1),
       mcq('The ocean is the __ habitat on Earth.', ['Smallest', 'Driest', 'Largest', 'None of the above'], 2)]
    ),
    link('desert_habitat', 'Desert Habitats',
      [{ heading: 'Hot and Dry', content: 'Deserts get very little rain. It\'s hot during the day but can be cold at night! Plants like cacti store water inside their thick stems. Animals hide in burrows during the hot day.', visual: '🌵🦎🐪 Desert life: cacti, lizards, camels, scorpions, snakes' },
       { heading: 'Desert Survivors', content: 'Desert animals have special adaptations. Camels store fat in their humps. Kangaroo rats never need to drink water — they get it from seeds! Lizards can change color to cool down.', visual: '🐪 Camel humps store fat (not water!) | 🦎 Lizards bask in the sun for warmth' }],
      ['Deserts are dry with very little rain', 'Cacti store water in their stems', 'Desert animals are active at night to avoid heat'],
      'Fun Fact: The Sahara Desert is almost as big as the entire United States!',
      [mcq('What do cacti store in their stems?', ['Sand', 'Water', 'Food', 'None of the above'], 1),
       tf('Deserts get a lot of rain.', false),
       mcq('When are many desert animals most active?', ['Morning', 'Afternoon', 'Night', 'None of the above'], 2),
       mcq('Which animal lives in the desert?', ['Penguin', 'Polar bear', 'Camel', 'None of the above'], 2),
       tf('Camels store water in their humps.', false)]
    )
  ]
});

newScience.push({
  grade: 2, loop: 'simple_machines', title: 'Simple Machines',
  links: [
    link('levers_ramps', 'Levers & Ramps',
      [{ heading: 'What Is a Lever?', content: 'A lever is a bar that rests on a pivot point (called a fulcrum). When you push one end down, the other end goes up — like a seesaw! Levers make lifting easier.', visual: '⬇️ Push down here → fulcrum in middle → ⬆️ heavy thing goes up!' },
       { heading: 'Ramps (Inclined Planes)', content: 'A ramp makes it easier to move things up. Instead of lifting a heavy box straight up, you can slide it up a ramp using LESS force (but over a LONGER distance).', visual: '📦 Heavy box → push up a ramp → easier than lifting straight up!' }],
      ['A lever has a bar and a fulcrum (pivot)', 'A seesaw is a lever', 'Ramps make lifting easier by spreading the work over a longer distance'],
      'Fun Fact: The ancient Egyptians used ramps to build the pyramids — some ramps were over a mile long!',
      [mcq('A seesaw is an example of a...', ['Wheel', 'Lever', 'Screw', 'None of the above'], 1),
       mcq('What is the pivot point of a lever called?', ['Handle', 'Fulcrum', 'Ramp', 'None of the above'], 1),
       tf('A ramp makes it harder to move things up.', false),
       mcq('A ramp is also called an...', ['Inclined plane', 'Invisible lever', 'Arch', 'None of the above'], 0),
       tf('Simple machines make work easier.', true)]
    ),
    link('wheels_pulleys', 'Wheels & Pulleys',
      [{ heading: 'Wheels', content: 'Wheels make it easier to move things. Without wheels, you\'d have to drag everything! A wheel and axle work together — the axle is the rod through the center.', visual: '🛒 Shopping cart wheels, 🚗 car wheels, 🛞 bicycle wheels — all use wheel and axle!' },
       { heading: 'Pulleys', content: 'A pulley is a wheel with a rope around it. Pulling the rope DOWN makes the object go UP. It changes the direction of your force!', visual: '🏗️ Flag poles use pulleys — you pull the rope down and the flag goes up!' }],
      ['Wheels reduce friction and make moving easier', 'A pulley changes the direction of force', 'Pull the rope down → object goes up'],
      'Fun Fact: The first wheels weren\'t used for transportation — they were used by potters to make clay pots about 5,500 years ago!',
      [mcq('A pulley uses a wheel and a...', ['Handle', 'Rope', 'Spring', 'None of the above'], 1),
       tf('Wheels make it harder to move things.', false),
       mcq('What does a pulley do?', ['Makes things heavier', 'Changes direction of force', 'Creates heat', 'None of the above'], 1),
       mcq('Which uses a wheel and axle?', ['Ramp', 'Doorknob', 'Stapler', 'None of the above'], 1),
       tf('A flag pole uses a pulley.', true)]
    )
  ]
});

// ── GRADE 3 ──────────────────────────────────────────────────────
newScience.push({
  grade: 3, loop: 'life_cycles', title: 'Life Cycles',
  links: [
    link('butterfly_lifecycle', 'Butterfly Life Cycle',
      [{ heading: 'Four Stages', content: 'A butterfly goes through 4 stages called metamorphosis: 1) Egg → 2) Caterpillar (larva) → 3) Chrysalis (pupa) → 4) Butterfly (adult). It\'s an amazing transformation!', visual: '🥚→🐛→🫘→🦋 Egg → Caterpillar → Chrysalis → Butterfly!' },
       { heading: 'Complete Metamorphosis', content: 'The caterpillar looks NOTHING like the butterfly! Inside the chrysalis, its whole body changes. This total transformation is called "complete metamorphosis."', visual: 'A monarch caterpillar is striped black, yellow, and white. The butterfly is orange and black — totally different!' }],
      ['4 stages: egg, larva, pupa, adult', 'This transformation is called metamorphosis', 'The caterpillar totally changes inside the chrysalis'],
      'Fun Fact: Monarch butterflies migrate up to 3,000 miles from Canada to Mexico every fall!',
      [mcq('What is the second stage of a butterfly\'s life?', ['Egg', 'Caterpillar', 'Chrysalis', 'None of the above'], 1),
       mcq('What is the chrysalis stage called?', ['Larva', 'Pupa', 'Adult', 'None of the above'], 1),
       tf('The total change from caterpillar to butterfly is called metamorphosis.', true),
       mcq('How many stages are there?', ['2', '3', '4', 'None of the above'], 2),
       mcq('What does a caterpillar become inside the chrysalis?', ['A bigger caterpillar', 'A butterfly', 'An egg', 'None of the above'], 1)]
    ),
    link('frog_lifecycle', 'Frog Life Cycle',
      [{ heading: 'From Egg to Frog', content: 'Frogs also go through metamorphosis! 1) Egg (in jelly clusters in water) → 2) Tadpole (has a tail, breathes with gills) → 3) Froglet (grows legs, loses tail) → 4) Adult Frog.', visual: '🥚→🐟→🐸 Eggs in water → Tadpole with tail → Grows legs → Adult frog!' },
       { heading: 'Amazing Changes', content: 'Tadpoles live in water and breathe through gills like fish. As they grow into frogs, they develop lungs and legs. Their tail shrinks and disappears!', visual: 'Tadpole: gills + tail | Froglet: legs growing, tail shrinking | Frog: lungs + legs, no tail' }],
      ['Frogs start as eggs in water', 'Tadpoles breathe with gills', 'Frogs breathe with lungs'],
      'Fun Fact: Some frog species can freeze solid in winter and thaw back to life in spring!',
      [mcq('What does a tadpole breathe with?', ['Lungs', 'Gills', 'Skin only', 'None of the above'], 1),
       mcq('In which stage does a frog grow legs?', ['Egg', 'Tadpole', 'Froglet', 'None of the above'], 2),
       tf('Frog eggs are laid in water.', true),
       mcq('What happens to a tadpole\'s tail?', ['It gets longer', 'It disappears', 'It becomes a leg', 'None of the above'], 1),
       mcq('Do frogs go through metamorphosis?', ['Yes', 'No', 'Only some frogs', 'None of the above'], 0)]
    )
  ]
});

newScience.push({
  grade: 3, loop: 'magnets', title: 'Magnets & Magnetism',
  links: [
    link('magnet_basics', 'How Magnets Work',
      [{ heading: 'Push and Pull', content: 'Magnets have two poles: North (N) and South (S). Opposite poles attract (pull together): N-S. Same poles repel (push apart): N-N or S-S.', visual: '🧲 N---S ↔ S---N = ATTRACT! | N---S ↔ N---S = REPEL!' },
       { heading: 'What Magnets Attract', content: 'Magnets attract objects made of iron, steel, nickel, and cobalt. They do NOT attract wood, plastic, glass, or paper.', visual: '🧲 Attracts: paperclip ✓, nail ✓, coin ✓ | Doesn\'t attract: pencil ✗, rubber ✗, plastic ✗' }],
      ['Opposite poles attract, same poles repel', 'Magnets attract iron, steel, nickel, cobalt', 'Every magnet has a north and south pole'],
      'Fun Fact: Earth is a giant magnet! That\'s why compass needles point north — they\'re attracted to Earth\'s magnetic north pole!',
      [mcq('What happens when two north poles meet?', ['They attract', 'They repel', 'Nothing', 'None of the above'], 1),
       mcq('Which material is attracted to magnets?', ['Wood', 'Plastic', 'Iron', 'None of the above'], 2),
       tf('A magnet has a north pole and a south pole.', true),
       mcq('N-S poles together will...', ['Push apart', 'Pull together', 'Stay still', 'None of the above'], 1),
       tf('Magnets attract all metals.', false)]
    ),
    link('magnet_uses', 'Magnets in Everyday Life',
      [{ heading: 'Magnets Everywhere!', content: 'Magnets are in refrigerator doors, speakers, headphones, electric motors, trains, and even your tablet\'s cover! They\'re one of the most useful forces in nature.', visual: '🧲 In your life: fridge magnets, headphones, electric motors, MRI machines, credit card strips' },
       { heading: 'Electromagnets', content: 'An electromagnet is a magnet made by running electricity through a coil of wire. You can turn it ON and OFF! Cranes in junkyards use giant electromagnets to lift cars.', visual: '🔌 + 🧲 = electromagnet! Turn electricity on → magnet works. Turn off → not a magnet.' }],
      ['Magnets are used in motors, speakers, and more', 'Electromagnets can be turned on and off', 'A compass needle is a tiny magnet'],
      'Fun Fact: Maglev trains float above the track using powerful magnets — they can go over 370 mph!',
      [mcq('Which device uses magnets?', ['Pencil', 'Speaker', 'Wooden chair', 'None of the above'], 1),
       mcq('What is special about an electromagnet?', ['It\'s always on', 'It can be turned on and off', 'It only attracts plastic', 'None of the above'], 1),
       tf('A compass uses a magnet to show direction.', true),
       mcq('What makes an electromagnet work?', ['Gravity', 'Electricity', 'Heat', 'None of the above'], 1),
       tf('Junkyard cranes use permanent magnets that can\'t be turned off.', false)]
    )
  ]
});

// ── GRADE 4 ──────────────────────────────────────────────────────
newScience.push({
  grade: 4, loop: 'earth_layers', title: 'Inside Earth',
  links: [
    link('earths_layers', 'Earth\'s Layers',
      [{ heading: 'Four Layers', content: 'Earth has 4 main layers: the crust (thin outer shell we live on), the mantle (thick, hot, slowly flowing rock), the outer core (liquid metal), and the inner core (solid metal, incredibly hot!).', visual: '🌍 Crust → Mantle → Outer Core (liquid iron) → Inner Core (solid iron, 9,800°F!)' },
       { heading: 'Think Like an Egg', content: 'Earth is like a hard-boiled egg! The shell is the crust, the egg white is the mantle, and the yolk is the core.', visual: '🥚 Shell = Crust | White = Mantle | Yolk = Core' }],
      ['4 layers: crust, mantle, outer core, inner core', 'The crust is the thinnest layer', 'The inner core is the hottest part — solid iron and nickel'],
      'Fun Fact: The inner core is about as hot as the surface of the Sun — around 9,800°F (5,400°C)!',
      [mcq('Which layer do we live on?', ['Mantle', 'Crust', 'Core', 'None of the above'], 1),
       mcq('Which layer is made of liquid metal?', ['Crust', 'Mantle', 'Outer core', 'None of the above'], 2),
       tf('The mantle is thicker than the crust.', true),
       mcq('How many main layers does Earth have?', ['2', '3', '4', 'None of the above'], 2),
       mcq('The inner core is...', ['Liquid', 'Gas', 'Solid', 'None of the above'], 2)]
    ),
    link('volcanoes_earthquakes', 'Volcanoes & Earthquakes',
      [{ heading: 'Volcanoes', content: 'A volcano forms when hot melted rock (magma) from the mantle pushes up through the crust. When it reaches the surface, we call it lava. An eruption can send lava, ash, and gas into the air!', visual: '🌋 Magma rises → pressure builds → BOOM! Lava flows, ash clouds form' },
       { heading: 'Earthquakes', content: 'Earth\'s crust is broken into pieces called tectonic plates. When these plates slide past each other or bump together, the ground shakes — that\'s an earthquake!', visual: '🫨 Two plates grinding past each other → SHAKE! → earthquake' }],
      ['Volcanoes form when magma pushes through the crust', 'Magma becomes lava when it exits the volcano', 'Earthquakes happen when tectonic plates move'],
      'Fun Fact: There are about 1,500 active volcanoes on Earth, and about 50 erupt every year!',
      [mcq('What is melted rock called inside Earth?', ['Lava', 'Magma', 'Limestone', 'None of the above'], 1),
       mcq('Earthquakes are caused by...', ['Wind', 'Rain', 'Moving tectonic plates', 'None of the above'], 2),
       tf('Magma is called lava after it reaches the surface.', true),
       mcq('Earth\'s crust is broken into pieces called...', ['Layers', 'Tectonic plates', 'Continents', 'None of the above'], 1),
       tf('Volcanoes can send ash into the atmosphere.', true)]
    )
  ]
});

newScience.push({
  grade: 4, loop: 'weather_climate', title: 'Weather & Climate',
  links: [
    link('weather_tools', 'Weather Instruments',
      [{ heading: 'Measuring Weather', content: 'Scientists use tools to measure weather: a thermometer measures temperature, a rain gauge measures rainfall, a barometer measures air pressure, and an anemometer measures wind speed.', visual: '🌡️ Thermometer | 🌧️ Rain gauge | 📊 Barometer | 💨 Anemometer' },
       { heading: 'Reading a Thermometer', content: 'Temperature tells us how hot or cold the air is. We measure in degrees Fahrenheit (°F) or Celsius (°C). Water freezes at 32°F (0°C) and boils at 212°F (100°C).', visual: '🌡️ 32°F = freezing | 72°F = comfortable | 100°F = very hot | 212°F = boiling' }],
      ['Thermometer = temperature', 'Barometer = air pressure', 'Anemometer = wind speed'],
      'Fun Fact: The hottest temperature ever recorded on Earth was 134°F (56.7°C) in Death Valley, California in 1913!',
      [mcq('What does a thermometer measure?', ['Wind', 'Rain', 'Temperature', 'None of the above'], 2),
       mcq('What measures wind speed?', ['Thermometer', 'Barometer', 'Anemometer', 'None of the above'], 2),
       tf('Water freezes at 32°F.', true),
       mcq('What does a barometer measure?', ['Air pressure', 'Humidity', 'Temperature', 'None of the above'], 0),
       mcq('A rain gauge measures...', ['Wind direction', 'Rainfall amount', 'Cloud types', 'None of the above'], 1)]
    ),
    link('clouds_types', 'Types of Clouds',
      [{ heading: 'Three Main Cloud Types', content: 'Cumulus clouds are fluffy and white like cotton balls — fair weather. Stratus clouds are flat, gray layers — can bring drizzle. Cirrus clouds are thin and wispy up high — made of ice crystals.', visual: '☁️ Cumulus: fluffy cotton | 🌫️ Stratus: flat gray sheets | 🌤️ Cirrus: thin wispy streaks' },
       { heading: 'Storm Clouds', content: 'Cumulonimbus clouds are tall, dark storm clouds. They bring thunderstorms, heavy rain, and sometimes hail or tornadoes! They start as regular cumulus clouds and grow upward.', visual: '⛈️ Cumulonimbus: tall, dark, anvil-shaped → thunder, lightning, heavy rain!' }],
      ['Cumulus = fluffy, fair weather', 'Stratus = flat, gray, drizzle', 'Cumulonimbus = tall, dark, storms'],
      'Fun Fact: A single cumulus cloud can weigh over 1 million pounds — that\'s as heavy as 100 elephants!',
      [mcq('Fluffy, white clouds are called...', ['Stratus', 'Cumulus', 'Cirrus', 'None of the above'], 1),
       mcq('Which cloud type brings thunderstorms?', ['Cirrus', 'Stratus', 'Cumulonimbus', 'None of the above'], 2),
       tf('Cirrus clouds are thin and wispy.', true),
       mcq('Flat, gray clouds that bring drizzle are...', ['Cumulus', 'Stratus', 'Cirrus', 'None of the above'], 1),
       tf('Clouds are made of tiny water droplets or ice crystals.', true)]
    )
  ]
});

// ── GRADE 5 ──────────────────────────────────────────────────────
newScience.push({
  grade: 5, loop: 'chemistry_basics', title: 'Matter & Chemistry',
  links: [
    link('atoms_elements', 'Atoms & Elements',
      [{ heading: 'Building Blocks', content: 'Everything is made of tiny particles called atoms. An element is a substance made of only ONE type of atom. Gold is an element — every atom in pure gold is a gold atom!', visual: '⚛️ Atom = tiny building block | Element = one type of atom only | Gold (Au), Oxygen (O), Carbon (C)' },
       { heading: 'The Periodic Table', content: 'All 118 known elements are organized in the Periodic Table. Each has a symbol (like H for Hydrogen, O for Oxygen, C for Carbon). Elements combine to make everything!', visual: 'H (Hydrogen) + O (Oxygen) → H₂O (Water!) Two hydrogen atoms + one oxygen atom' }],
      ['Atoms are the smallest building blocks of matter', 'Elements are made of one type of atom', 'The Periodic Table organizes all known elements'],
      'Fun Fact: Your body is made of about 7 octillion atoms (that\'s 7 followed by 27 zeros)!',
      [mcq('What is an atom?', ['A type of cell', 'The smallest building block of matter', 'A molecule', 'None of the above'], 1),
       mcq('How many elements are known?', ['50', '100', '118', 'None of the above'], 2),
       tf('An element is made of only one type of atom.', true),
       mcq('What is H the symbol for?', ['Helium', 'Hydrogen', 'Heat', 'None of the above'], 1),
       mcq('Water (H₂O) is made of...', ['One element', 'Two elements', 'Three elements', 'None of the above'], 1)]
    ),
    link('mixtures_solutions', 'Mixtures & Solutions',
      [{ heading: 'Mixtures', content: 'A mixture is two or more substances combined but NOT chemically joined. Trail mix is a mixture — you can separate the nuts, raisins, and chocolate! Sand and water is also a mixture.', visual: '🥜🍫🫐 Trail mix: you can pick out each ingredient. It\'s a mixture!' },
       { heading: 'Solutions', content: 'A solution is a special mixture where one substance dissolves into another. Sugar dissolving in water makes a solution — you can\'t see the sugar anymore, but it\'s still there (taste it!).', visual: '🧂 + 💧 = saltwater solution. The salt dissolves and disappears into the water.' }],
      ['Mixtures can be separated physically', 'Solutions are mixtures where one substance dissolves', 'Dissolving = spreading evenly through a liquid'],
      'Fun Fact: The ocean is a giant solution — it has about 3.5% salt dissolved in it!',
      [mcq('Trail mix is an example of a...', ['Solution', 'Mixture', 'Element', 'None of the above'], 1),
       mcq('When sugar dissolves in water, it makes a...', ['Mixture', 'Solution', 'Chemical reaction', 'None of the above'], 1),
       tf('In a mixture, substances are chemically combined.', false),
       mcq('Which is a solution?', ['Sand and rocks', 'Oil and water', 'Saltwater', 'None of the above'], 2),
       tf('You can separate a mixture by physical means.', true)]
    )
  ]
});

newScience.push({
  grade: 5, loop: 'space_exploration', title: 'The Solar System',
  links: [
    link('sun_and_stars', 'The Sun & Stars',
      [{ heading: 'Our Star', content: 'The Sun is a star — a giant ball of hot gas that produces light and heat through nuclear fusion. It\'s about 93 million miles from Earth. All planets orbit around it.', visual: '☀️ The Sun: diameter = 864,000 miles (109 Earths could fit across it!)' },
       { heading: 'Other Stars', content: 'Stars in the night sky are like our Sun but MUCH farther away. They look tiny because of the distance. Some are bigger than our Sun, some smaller. Stars can be different colors: blue (hottest), white, yellow, orange, red (coolest).', visual: '🔵 Blue stars = hottest | 🟡 Yellow stars (like our Sun) | 🔴 Red stars = coolest' }],
      ['The Sun is a medium-sized yellow star', 'Stars produce energy through nuclear fusion', 'Star color tells us its temperature'],
      'Fun Fact: Light from the Sun takes about 8 minutes to reach Earth — if the Sun suddenly disappeared, we wouldn\'t know for 8 minutes!',
      [mcq('The Sun is a...', ['Planet', 'Moon', 'Star', 'None of the above'], 2),
       mcq('Which color star is the hottest?', ['Red', 'Yellow', 'Blue', 'None of the above'], 2),
       tf('The Sun is about 93 million miles from Earth.', true),
       mcq('Stars look tiny because they are...', ['Small', 'Very far away', 'Not real', 'None of the above'], 1),
       tf('All stars are the same size as our Sun.', false)]
    ),
    link('moon_phases', 'Moon Phases',
      [{ heading: 'Why the Moon Changes Shape', content: 'The Moon doesn\'t make its own light — it reflects sunlight! As the Moon orbits Earth, we see different amounts of its lit side. These are called phases.', visual: '🌑→🌒→🌓→🌔→🌕→🌖→🌗→🌘→🌑 One complete cycle = about 29.5 days' },
       { heading: 'The 8 Phases', content: 'New Moon (dark) → Waxing Crescent → First Quarter (half) → Waxing Gibbous → Full Moon → Waning Gibbous → Third Quarter → Waning Crescent → back to New Moon!', visual: 'Waxing = getting bigger (light on right) | Waning = getting smaller (light on left)' }],
      ['The Moon reflects sunlight', 'One lunar cycle takes about 29.5 days', 'Waxing = growing, Waning = shrinking'],
      'Fun Fact: If you stood on the Moon, the sky would always be black — even during the day — because there\'s no atmosphere to scatter light!',
      [mcq('The Moon gets its light from...', ['Itself', 'The Sun', 'Earth', 'None of the above'], 1),
       mcq('How long is one lunar cycle?', ['7 days', '29.5 days', '365 days', 'None of the above'], 1),
       tf('A waxing moon is getting bigger.', true),
       mcq('What phase shows the full circle of light?', ['New Moon', 'First Quarter', 'Full Moon', 'None of the above'], 2),
       mcq('What does "waning" mean?', ['Getting bigger', 'Getting smaller', 'Staying the same', 'None of the above'], 1)]
    )
  ]
});

// ── GRADE 6 ──────────────────────────────────────────────────────
newScience.push({
  grade: 6, loop: 'genetics_basics', title: 'Genetics & Heredity',
  links: [
    link('dna_genes', 'DNA & Genes',
      [{ heading: 'The Blueprint of Life', content: 'DNA is a molecule inside every cell that carries the instructions for building and running your body. It\'s shaped like a twisted ladder called a "double helix."', visual: '🧬 DNA: twisted ladder shape | Made of 4 bases: A, T, C, G | Every cell has DNA' },
       { heading: 'Genes', content: 'A gene is a section of DNA that codes for a specific trait, like eye color or hair type. You get half your genes from your mom and half from your dad.', visual: 'Mom\'s genes 🧬 + Dad\'s genes 🧬 = Your unique combination!' }],
      ['DNA is shaped like a double helix', 'Genes are sections of DNA that code for traits', 'You inherit half your genes from each parent'],
      'Fun Fact: If you uncoiled all the DNA in one human cell, it would stretch about 6 feet long!',
      [mcq('What shape is DNA?', ['Circle', 'Double helix', 'Square', 'None of the above'], 1),
       mcq('What is a gene?', ['A type of cell', 'A section of DNA coding for a trait', 'A type of protein', 'None of the above'], 1),
       tf('You get all your genes from your mother.', false),
       mcq('DNA is found in every...', ['Bone only', 'Cell', 'Organ only', 'None of the above'], 1),
       mcq('How many parents contribute genes to you?', ['1', '2', '4', 'None of the above'], 1)]
    ),
    link('inherited_traits', 'Inherited vs Learned Traits',
      [{ heading: 'Inherited Traits', content: 'Inherited traits come from your parents through genes: eye color, hair color, skin color, blood type, dimples, ability to roll your tongue. You\'re born with these!', visual: '👁️ Eye color: inherited | 🩸 Blood type: inherited | 👅 Tongue rolling: inherited' },
       { heading: 'Learned Traits', content: 'Learned traits are things you develop through experience: reading, riding a bike, speaking a language, playing piano. These are NOT passed through DNA.', visual: '🚲 Riding a bike: learned | 📖 Reading: learned | 🎹 Playing piano: learned' }],
      ['Inherited traits come from DNA', 'Learned traits come from experience', 'You can\'t inherit skills like reading or sports'],
      'Fun Fact: About 65-80% of people can roll their tongue — it\'s one of the most common inherited traits to check!',
      [mcq('Which is an inherited trait?', ['Reading ability', 'Eye color', 'Riding a bike', 'None of the above'], 1),
       mcq('Playing piano is a __ trait.', ['Inherited', 'Learned', 'Genetic', 'None of the above'], 1),
       tf('Hair color is an inherited trait.', true),
       mcq('Which is NOT inherited?', ['Blood type', 'Dimples', 'Speaking Spanish', 'None of the above'], 2),
       tf('You are born knowing how to read.', false)]
    )
  ]
});

newScience.push({
  grade: 6, loop: 'earth_systems', title: 'Earth\'s Systems',
  links: [
    link('plate_tectonics', 'Plate Tectonics',
      [{ heading: 'Moving Plates', content: 'Earth\'s crust is made of about 15 large tectonic plates that float on the mantle. They move very slowly — about as fast as your fingernails grow (1-2 inches per year)!', visual: '🌍 Earth\'s surface = puzzle pieces (tectonic plates) that slowly move around' },
       { heading: 'Plate Boundaries', content: 'Where plates meet, big things happen! Convergent (crashing together) = mountains. Divergent (pulling apart) = rift valleys, new ocean floor. Transform (sliding past) = earthquakes.', visual: '→← Convergent = mountains | ←→ Divergent = rifts | ↑↓ Transform = earthquakes' }],
      ['Earth has ~15 tectonic plates', 'Plates move 1-2 inches per year', '3 types of boundaries: convergent, divergent, transform'],
      'Fun Fact: 250 million years ago, all continents were joined in one supercontinent called Pangaea!',
      [mcq('How fast do tectonic plates move?', ['1 mile per year', '1-2 inches per year', '100 feet per year', 'None of the above'], 1),
       mcq('Mountains form at __ boundaries.', ['Divergent', 'Convergent', 'Transform', 'None of the above'], 1),
       tf('Tectonic plates float on Earth\'s mantle.', true),
       mcq('What was the supercontinent called?', ['Atlantis', 'Pangaea', 'Gondwana', 'None of the above'], 1),
       mcq('Earthquakes are common at __ boundaries.', ['Convergent', 'Divergent', 'Transform', 'None of the above'], 2)]
    ),
    link('atmosphere_layers', 'Earth\'s Atmosphere',
      [{ heading: '5 Layers of Air', content: 'Earth\'s atmosphere has 5 layers: Troposphere (weather happens here, closest to ground), Stratosphere (ozone layer, jets fly here), Mesosphere, Thermosphere, and Exosphere (fades into space).', visual: '🌍 Ground → Troposphere (weather) → Stratosphere (ozone) → Mesosphere → Thermosphere → Exosphere → Space 🚀' },
       { heading: 'What\'s Our Air Made Of?', content: 'Air is 78% nitrogen, 21% oxygen, and 1% other gases (argon, carbon dioxide, etc.). We breathe the oxygen and exhale carbon dioxide!', visual: '🌬️ Air = 78% Nitrogen + 21% Oxygen + 1% Other (CO₂, Argon, etc.)' }],
      ['Weather happens in the troposphere', 'The ozone layer is in the stratosphere', 'Air is 78% nitrogen and 21% oxygen'],
      'Fun Fact: Without the atmosphere, Earth\'s average temperature would be about 0°F (-18°C) — the atmosphere acts like a blanket!',
      [mcq('Weather happens in the...', ['Stratosphere', 'Troposphere', 'Mesosphere', 'None of the above'], 1),
       mcq('What gas makes up most of our air?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'None of the above'], 2),
       tf('The ozone layer is in the stratosphere.', true),
       mcq('How many layers does the atmosphere have?', ['3', '4', '5', 'None of the above'], 2),
       mcq('About what percentage of air is oxygen?', ['21%', '78%', '50%', 'None of the above'], 0)]
    )
  ]
});

// ═══════════════════════════════════════════════════════════════════
// MERGE & WRITE
// ═══════════════════════════════════════════════════════════════════
const merged = {
  math: [...existing.math, ...newMath],
  science: [...existing.science, ...newScience]
};

// Sort by grade
merged.math.sort((a, b) => a.grade - b.grade);
merged.science.sort((a, b) => a.grade - b.grade);

// Stats
let totalLoops = merged.math.length + merged.science.length;
let totalLinks = 0, totalQuestions = 0;
for (const s of [merged.math, merged.science]) {
  for (const loop of s) {
    totalLinks += loop.links.length;
    for (const link of loop.links) totalQuestions += link.quiz.length;
  }
}

fs.writeFileSync(__dirname + '/lessons.json', JSON.stringify(merged, null, 2));
console.log(`✅ Generated lessons.json`);
console.log(`   ${totalLoops} loops | ${totalLinks} links | ${totalQuestions} questions`);
console.log(`   Math: ${merged.math.length} loops`);
console.log(`   Science: ${merged.science.length} loops`);
