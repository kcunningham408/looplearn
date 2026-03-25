import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

// ── Guided conversation trees ──
// Each node: { bot: string, choices: [{ label, next }] }
// Leaf nodes have no choices (end of conversation)

const TREES = {
  // ── MATH conversation paths ──
  math: {
    root: {
      bot: "Hi! I'm LoopBot 🤖 What would you like help with?",
      choices: [
        { label: '💡 Explain this topic', next: 'explain' },
        { label: '🤔 I got a wrong answer', next: 'wrong' },
        { label: '📝 Give me a study tip', next: 'studyTip' },
        { label: '🎯 I need motivation', next: 'motivation' },
      ],
    },
    explain: {
      bot: "Sure! What kind of explanation would help? 🧠",
      choices: [
        { label: '🔢 Break it into steps', next: 'explainSteps' },
        { label: '🍕 Use a real-life example', next: 'explainReal' },
        { label: '🎨 Explain it simply', next: 'explainSimple' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    explainSteps: {
      bot: "Great idea! Here's a tip: break every math problem into small pieces. First, read the question carefully. Then, figure out what operation to use (+, −, ×, ÷). Finally, solve it step by step and check your work! ✅\n\nTry writing each step on paper — it really helps!",
      choices: [
        { label: '👍 That helps!', next: 'glad' },
        { label: '🔄 Tell me more', next: 'explainStepsMore' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainStepsMore: {
      bot: "Here's a trick: cover up part of the problem and solve just one piece at a time. For example, in 23 + 45, first add the ones (3+5=8), then the tens (20+40=60), then combine: 68! 🎉\n\nPractice this with your current lesson!",
      choices: [
        { label: '👍 Got it!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainReal: {
      bot: "Math is everywhere! 🌎\n\n• Sharing pizza equally? That's division! 🍕\n• Counting your toy collection? That's addition! 🧸\n• Measuring ingredients for cookies? That's fractions! 🍪\n\nTry to spot math in your daily life — it makes learning way more fun!",
      choices: [
        { label: '👍 Cool examples!', next: 'glad' },
        { label: '🔄 More examples', next: 'explainRealMore' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainRealMore: {
      bot: "Here are more! 🏀\n\n• Keeping score in a game? That's adding & comparing! \n• Saving allowance money? That's subtraction & multiplication! 💰\n• Building with blocks? That's geometry & measurement! 🧱\n\nMath helps you understand the world around you!",
      choices: [
        { label: '👍 Love it!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainSimple: {
      bot: "Let's keep it super simple! 😊\n\nThink of math like a puzzle. Each problem has pieces — numbers and signs (+, −, ×, ÷). Your job is to put the pieces together to find the answer.\n\nStart with what you know, and build from there. You've got this!",
      choices: [
        { label: '👍 That makes sense!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    wrong: {
      bot: "That's totally okay! Making mistakes is how we learn best 💪 What happened?",
      choices: [
        { label: '😕 I didn\'t understand the question', next: 'wrongConfused' },
        { label: '⏰ I rushed through it', next: 'wrongRushed' },
        { label: '🤷 I just guessed', next: 'wrongGuessed' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    wrongConfused: {
      bot: "No worries! Try this: read the question slowly, twice. 📖 Circle the important numbers and words. Then ask yourself — \"What is this really asking me to find?\" \n\nOnce you know WHAT to find, the HOW becomes easier! You'll get it next time 🌟",
      choices: [
        { label: '👍 I\'ll try that!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    wrongRushed: {
      bot: "Speed isn't everything! 🐢 The best mathematicians take their time.\n\nTry this: after solving a problem, STOP and check your answer before moving on. Ask yourself \"Does this answer make sense?\" \n\nSlow and steady wins the race! 🏆",
      choices: [
        { label: '👍 Good advice!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    wrongGuessed: {
      bot: "Guessing is actually a good start! 🎯 But here's how to make BETTER guesses:\n\n1. Eliminate answers that seem way too big or small\n2. Try to solve at least part of the problem\n3. Use what you learned in the lesson\n\nEven a smart guess is better than a random one! 🧠",
      choices: [
        { label: '👍 I\'ll try smarter guessing!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    studyTip: {
      bot: "Here are my top study tips! 📚 Pick one to try:",
      choices: [
        { label: '⏰ How long should I study?', next: 'tipTime' },
        { label: '🧠 How to remember better', next: 'tipMemory' },
        { label: '📝 How to practice', next: 'tipPractice' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    tipTime: {
      bot: "Short study bursts work best! ⏰\n\n• Study for 15-20 minutes, then take a 5-minute break\n• Do a few problems each day instead of a lot at once\n• Your brain learns better with rest in between!\n\nConsistency beats cramming every time 💪",
      choices: [
        { label: '👍 I\'ll try that schedule!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    tipMemory: {
      bot: "Want a super memory? Try these tricks! 🧠\n\n• Say things out loud while studying\n• Draw pictures of what you're learning\n• Teach what you learned to a stuffed animal or family member\n• Connect new things to stuff you already know\n\nThe more ways you use info, the better it sticks!",
      choices: [
        { label: '👍 Great tricks!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    tipPractice: {
      bot: "Practice makes progress! 📝\n\n• Do the lesson first, THEN try the quiz\n• If you get one wrong, go back and re-read that part\n• Try explaining the answer in your own words\n• Come back tomorrow and try again — you'll be surprised how much you remember!\n\nYou're already practicing just by being here! 🌟",
      choices: [
        { label: '👍 Let\'s do this!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    motivation: {
      bot: "You're doing AMAZING just by learning! 🌟 What do you need right now?",
      choices: [
        { label: '😊 Cheer me on!', next: 'motivCheer' },
        { label: '💭 Why does this matter?', next: 'motivWhy' },
        { label: '😤 This is really hard', next: 'motivHard' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    motivCheer: {
      bot: "🎉 YOU ARE A SUPERSTAR! 🌟\n\nEvery problem you try makes your brain stronger. Every mistake teaches you something new.\n\nDid you know? Scientists say that struggling with hard problems actually grows your brain! So when it feels tough, that's your brain getting bigger! 🧠💪",
      choices: [
        { label: '😊 Thanks LoopBot!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    motivWhy: {
      bot: "Great question! Math & Science help you: 🌍\n\n• Figure out if you have enough money for a treat 💰\n• Understand how your favorite games work 🎮\n• Build cool things when you grow up 🚀\n• Think clearly and solve ANY problem in life\n\nYou're building superpowers right now!",
      choices: [
        { label: '😊 That\'s actually cool!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    motivHard: {
      bot: "I hear you! Hard doesn't mean impossible 💪\n\nRemember: EVERY expert was once a beginner. The fact that you're trying means you're already ahead!\n\nTip: Take a deep breath, go back to the lesson, and read it one more time. It often clicks on the second try! 🔄\n\nI believe in you! 🌟",
      choices: [
        { label: '😊 I\'ll keep trying!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    glad: {
      bot: "Awesome! Remember, I'm always here to help 🤖💙 Keep up the great work!",
      choices: [
        { label: '💬 Ask another question', next: 'root' },
        { label: '👋 Done for now', next: '__close__' },
      ],
    },
  },

  // ── SCIENCE conversation paths ──
  science: {
    root: {
      bot: "Hi! I'm LoopBot 🤖 What would you like help with?",
      choices: [
        { label: '🔬 Explain this topic', next: 'explain' },
        { label: '🤔 I got a wrong answer', next: 'wrong' },
        { label: '📝 Give me a study tip', next: 'studyTip' },
        { label: '🎯 I need motivation', next: 'motivation' },
      ],
    },
    explain: {
      bot: "Sure! How would you like me to help? 🔬",
      choices: [
        { label: '🔍 Break it into steps', next: 'explainSteps' },
        { label: '🌎 Use a real-life example', next: 'explainReal' },
        { label: '🎨 Explain it simply', next: 'explainSimple' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    explainSteps: {
      bot: "Science is all about asking questions and finding answers! Here's how:\n\n1️⃣ Observe — look carefully at what's happening\n2️⃣ Ask — \"Why does this happen?\"\n3️⃣ Learn — read the lesson to find the answer\n4️⃣ Test — try the quiz to check your understanding\n\nYou're already doing steps 3 and 4 right now! 🌟",
      choices: [
        { label: '👍 That helps!', next: 'glad' },
        { label: '🔄 Tell me more', next: 'explainStepsMore' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainStepsMore: {
      bot: "Here's a scientist's secret: draw what you're learning! 🎨\n\nIf you're studying plants, draw one and label the parts. Studying the solar system? Draw the planets in order.\n\nWhen you can picture it AND explain it, you really know it! 🧠",
      choices: [
        { label: '👍 Got it!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainReal: {
      bot: "Science is all around you! 🌎\n\n• Puddles drying up? That's evaporation! ☀️\n• Leaves changing color? That's biology! 🍂\n• Magnets on your fridge? That's physics! 🧲\n• Mixing ingredients for slime? That's chemistry! 🧪\n\nYou're already a scientist — you just didn't know it!",
      choices: [
        { label: '👍 Cool examples!', next: 'glad' },
        { label: '🔄 More examples', next: 'explainRealMore' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainRealMore: {
      bot: "Even more science in your life! 🏡\n\n• Why do you get goosebumps? Your body keeping warm! 🥶\n• Why does bread rise? Tiny organisms called yeast! 🍞\n• How do rainbows form? Light splitting into colors! 🌈\n• Why do plants lean toward windows? They chase sunlight! 🌱\n\nScience explains everything!",
      choices: [
        { label: '👍 Amazing!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    explainSimple: {
      bot: "Think of science like being a detective 🔍\n\nYou look at clues (observations), ask questions (hypotheses), and find answers (experiments)!\n\nThe lesson gives you the clues. The quiz tests if you cracked the case. You're a science detective! 🕵️",
      choices: [
        { label: '👍 I like that!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    // Share wrong/studyTip/motivation from math
    wrong: {
      bot: "That's totally okay! Making mistakes is how scientists learn too 🔬 What happened?",
      choices: [
        { label: '😕 I didn\'t understand the question', next: 'wrongConfused' },
        { label: '⏰ I rushed through it', next: 'wrongRushed' },
        { label: '🤷 I just guessed', next: 'wrongGuessed' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    wrongConfused: {
      bot: "Science questions can be tricky! Try this: 📖\n\n• Look for keywords in the question (like \"because\", \"which\", \"how\")\n• Go back to the lesson and find the section about that topic\n• Read it slowly and look for the answer\n\nScientists re-read things all the time — it's part of the process! 🌟",
      choices: [
        { label: '👍 I\'ll try that!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    wrongRushed: {
      bot: "Even real scientists take their time! 🐢\n\nBefore picking an answer, read ALL the choices first. Sometimes two answers look similar, but one is more correct.\n\nTake a breath, read carefully, and trust what you learned! 🏆",
      choices: [
        { label: '👍 Good advice!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    wrongGuessed: {
      bot: "Smart guessing is a real skill! 🎯\n\nIn science, you can often eliminate wrong answers:\n• If an answer sounds silly, it's probably wrong\n• Look for answers that match what the lesson taught\n• Keywords from the lesson often appear in the right answer\n\nThat narrows it down! 🧠",
      choices: [
        { label: '👍 I\'ll try that!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    studyTip: {
      bot: "Science study tips! 🔬 Pick one:",
      choices: [
        { label: '⏰ How to study science', next: 'tipTime' },
        { label: '🧠 How to remember facts', next: 'tipMemory' },
        { label: '📝 Best way to practice', next: 'tipPractice' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    tipTime: {
      bot: "For science, try the \"Observe & Review\" method! 👀\n\n• Read the lesson once (5 minutes)\n• Close your eyes and try to remember the key points\n• Open the lesson again and check what you missed\n• Then take the quiz!\n\nThis works way better than just reading over and over!",
      choices: [
        { label: '👍 I\'ll try that!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    tipMemory: {
      bot: "Memory tricks for science! 🧠\n\n• Make up silly sentences (\"My Very Educated Mother Just Served Us Nachos\" = planet order!)\n• Draw diagrams and label everything\n• Tell someone what you learned — teaching = learning!\n• Connect new facts to things you already know\n\nYour brain loves connections! 🔗",
      choices: [
        { label: '👍 Great tricks!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    tipPractice: {
      bot: "Best way to practice science! 📝\n\n• Read the fun fact in each lesson — they're there for a reason!\n• After the quiz, think about WHY each answer was right\n• Look around your house for real examples of what you learned\n• Come back tomorrow — your brain processes info while you sleep! 😴",
      choices: [
        { label: '👍 Let\'s do this!', next: 'glad' },
        { label: '🔙 More tips', next: 'studyTip' },
      ],
    },
    motivation: {
      bot: "You're a scientist in training! 🔬 What do you need right now?",
      choices: [
        { label: '😊 Cheer me on!', next: 'motivCheer' },
        { label: '💭 Why does science matter?', next: 'motivWhy' },
        { label: '😤 This is really hard', next: 'motivHard' },
        { label: '🔙 Go back', next: 'root' },
      ],
    },
    motivCheer: {
      bot: "🎉 YOU ARE A SCIENCE SUPERSTAR! 🌟\n\nEvery question you answer makes you smarter. Every wrong answer teaches you something new.\n\nFun fact: Albert Einstein failed lots of tests as a kid, but he never stopped being curious! Curiosity is your superpower! 🚀",
      choices: [
        { label: '😊 Thanks LoopBot!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    motivWhy: {
      bot: "Science is literally everything! 🌍\n\n• How does your phone work? Science! 📱\n• Why is the sky blue? Science! ☁️\n• How do doctors help sick people? Science! 🏥\n• How do rockets fly? SCIENCE! 🚀\n\nLearning science now means you can change the world later!",
      choices: [
        { label: '😊 That\'s awesome!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    motivHard: {
      bot: "Hard is GOOD in science! 💪\n\nEvery discovery in history started with someone saying \"I don't understand this... YET.\"\n\nThe key word is YET. You don't understand it YET. But you will!\n\nGo back to the lesson, read it again slowly, and I promise it'll make more sense 🌟",
      choices: [
        { label: '😊 I\'ll keep trying!', next: 'glad' },
        { label: '🔙 Ask something else', next: 'root' },
      ],
    },
    glad: {
      bot: "Awesome! Remember, I'm always here to help 🤖💙 Keep exploring and discovering!",
      choices: [
        { label: '💬 Ask another question', next: 'root' },
        { label: '👋 Done for now', next: '__close__' },
      ],
    },
  },
};

// Animated choice button
const ChoiceButton = ({ label, onPress, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      <Pressable style={st.choiceBtn} onPress={onPress}>
        <Text style={st.choiceText}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

export const AiTeacherModal = ({ visible, onClose, grade, subject }) => {
  const insets = useSafeAreaInsets();
  const tree = TREES[subject] || TREES.math;
  const [messages, setMessages] = useState([]);
  const [currentNode, setCurrentNode] = useState('root');
  const scrollRef = useRef(null);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setMessages([{ role: 'bot', text: tree.root.bot }]);
      setCurrentNode('root');
    }
  }, [visible]);

  const handleChoice = (choice) => {
    if (choice.next === '__close__') {
      onClose();
      return;
    }

    const nextNode = tree[choice.next];
    if (!nextNode) return;

    setMessages(prev => [
      ...prev,
      { role: 'user', text: choice.label },
      { role: 'bot', text: nextNode.bot },
    ]);
    setCurrentNode(choice.next);
  };

  const handleRestart = () => {
    setMessages([{ role: 'bot', text: tree.root.bot }]);
    setCurrentNode('root');
  };

  const node = tree[currentNode];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={st.container}>
        {/* Header */}
        <View style={st.header}>
          <View style={st.headerLeft}>
            <Text style={st.botAvatar}>🤖</Text>
            <View>
              <Text style={st.headerTitle}>LoopBot</Text>
              <Text style={st.headerSub}>Study Helper · Grade {grade}</Text>
            </View>
          </View>
          <View style={st.headerRight}>
            <Pressable style={st.homeBtn} onPress={handleRestart}>
              <Text style={st.homeBtnText}>🔄 Start Over</Text>
            </Pressable>
            <Pressable style={st.closeBtn} onPress={onClose}>
              <Text style={st.closeText}>✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={st.messages}
          contentContainerStyle={st.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {messages.map((msg, i) => (
            <View
              key={i}
              style={[st.bubble, msg.role === 'user' ? st.userBubble : st.botBubble]}>
              {msg.role === 'bot' && <Text style={st.botIcon}>🤖</Text>}
              <Text style={[st.bubbleText, msg.role === 'user' && st.userText]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Choice buttons */}
        {node?.choices && (
          <View style={[st.choicesArea, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            {node.choices.map((c, i) => (
              <ChoiceButton
                key={`${currentNode}-${i}`}
                label={c.label}
                delay={i * 80}
                onPress={() => handleChoice(c)}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
};

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    backgroundColor: COLORS.bgElevated,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  botAvatar: { fontSize: 28 },
  headerTitle: { ...TYPE.lg, ...TYPE.bold, color: COLORS.textPrimary },
  headerSub: { ...TYPE.xs, color: COLORS.textSecondary },
  homeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}40`,
  },
  homeBtnText: { ...TYPE.sm, ...TYPE.semibold, color: COLORS.primaryLight },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeText: { ...TYPE.lg, color: COLORS.textSecondary },

  // Messages
  messages: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '85%',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: `${COLORS.primary}20`,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}40`,
    borderBottomRightRadius: 4,
  },
  botIcon: { fontSize: 16, marginRight: 8, marginTop: 2 },
  bubbleText: { ...TYPE.md, color: COLORS.textPrimary, flex: 1, lineHeight: 20 },
  userText: { color: COLORS.primaryLight },

  // Choice buttons
  choicesArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.bgElevated,
    gap: 8,
  },
  choiceBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: `${COLORS.primary}50`,
    backgroundColor: `${COLORS.primary}15`,
  },
  choiceText: { ...TYPE.md, ...TYPE.semibold, color: COLORS.primaryLight, textAlign: 'center' },
});
