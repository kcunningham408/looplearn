import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

export const QuizQuestion = ({ question, selectedIndex, onSelect, answered, correctIndex }) => {
  const isTF = question.type === 'tf';

  const getOptionStyle = (index) => {
    if (!answered) {
      return selectedIndex === index ? st.optionSelected : {};
    }
    if (index === correctIndex) return st.optionCorrect;
    if (index === selectedIndex && index !== correctIndex) return st.optionWrong;
    return {};
  };

  return (
    <View style={st.container} accessibilityRole="radiogroup" accessibilityLabel={`Question: ${question.q}`}>
      <Text style={st.questionText}>{question.q}</Text>
      {isTF ? (
        <View style={st.tfRow}>
          {question.a.map((option, index) => (
            <Pressable
              key={`${question.q}-tf-${index}`}
              style={[
                st.tfOption,
                index === 0 ? st.tfTrue : st.tfFalse,
                selectedIndex === index && !answered && st.tfSelected,
                answered && index === correctIndex && st.optionCorrect,
                answered && index === selectedIndex && index !== correctIndex && st.optionWrong,
              ]}
              disabled={answered}
              onPress={() => onSelect(index)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedIndex === index }}
              accessibilityLabel={`${option}${answered && index === correctIndex ? ', correct answer' : ''}${answered && index === selectedIndex && index !== correctIndex ? ', incorrect' : ''}`}>
              <Text style={st.tfEmoji}>{index === 0 ? '✅' : '❌'}</Text>
              <Text
                style={[
                  st.tfText,
                  answered && index === correctIndex && { color: COLORS.correct },
                  answered && index === selectedIndex && index !== correctIndex && { color: COLORS.wrong },
                ]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        question.a.map((option, index) => (
          <Pressable
            key={`${question.q}-${index}`}
            style={[st.option, getOptionStyle(index)]}
            disabled={answered}
            onPress={() => onSelect(index)}
            accessibilityRole="radio"
            accessibilityState={{ selected: selectedIndex === index }}
            accessibilityLabel={`${option}${answered && index === correctIndex ? ', correct answer' : ''}${answered && index === selectedIndex && index !== correctIndex ? ', incorrect' : ''}`}>
            <Text
              style={[
                st.optionText,
                answered && index === correctIndex && { color: COLORS.correct },
                answered && index === selectedIndex && index !== correctIndex && { color: COLORS.wrong },
              ]}>
              {option}
            </Text>
          </Pressable>
        ))
      )}
    </View>
  );
};

const st = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 20,
  },
  questionText: {
    ...TYPE.xl,
    ...TYPE.bold,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  option: {
    padding: 20,
    minHeight: 56,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    marginBottom: 12,
  },
  optionSelected: {
    backgroundColor: 'rgba(139,92,246,0.18)',
    borderColor: COLORS.primary,
  },
  optionCorrect: {
    backgroundColor: COLORS.correctGlow,
    borderColor: COLORS.correct,
  },
  optionWrong: {
    backgroundColor: COLORS.wrongGlow,
    borderColor: COLORS.wrong,
  },
  optionText: {
    ...TYPE.xl,
    ...TYPE.semibold,
    color: COLORS.textPrimary,
  },
  // True/False
  tfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tfOption: {
    flex: 1,
    padding: 24,
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfTrue: {
    backgroundColor: 'rgba(52,211,153,0.10)',
  },
  tfFalse: {
    backgroundColor: 'rgba(248,113,113,0.10)',
  },
  tfSelected: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderColor: COLORS.primary,
  },
  tfEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  tfText: {
    ...TYPE.lg,
    ...TYPE.bold,
    color: COLORS.textPrimary,
  },
});
