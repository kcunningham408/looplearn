import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import COLORS from '../config/colors';
import TYPE from '../config/typography';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuizQuestion = memo(function QuizQuestion({ question, selectedIndex, onSelect, answered, correctIndex }) {
  const isTF = question.type === 'tf';

  const getOptionStyle = (index) => {
    if (!answered) {
      return selectedIndex === index ? st.optionSelected : {};
    }
    if (index === correctIndex) return st.optionCorrect;
    if (index === selectedIndex && index !== correctIndex) return st.optionWrong;
    return {};
  };

  const getLetterStyle = (index) => {
    if (!answered) {
      return selectedIndex === index ? { backgroundColor: COLORS.primary, borderColor: COLORS.primary } : {};
    }
    if (index === correctIndex) return { backgroundColor: COLORS.correct, borderColor: COLORS.correct };
    if (index === selectedIndex && index !== correctIndex) return { backgroundColor: COLORS.wrong, borderColor: COLORS.wrong };
    return {};
  };

  const getLetterTextStyle = (index) => {
    if (!answered && selectedIndex === index) return { color: COLORS.white };
    if (answered && index === correctIndex) return { color: COLORS.white };
    if (answered && index === selectedIndex && index !== correctIndex) return { color: COLORS.white };
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
            <View style={[st.optionLetter, getLetterStyle(index)]}>
              <Text style={[st.optionLetterText, getLetterTextStyle(index)]}>{OPTION_LETTERS[index]}</Text>
            </View>
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
});

const st = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: 22,
  },
  questionText: {
    ...TYPE.xl,
    ...TYPE.bold,
    color: COLORS.textPrimary,
    marginBottom: 20,
    lineHeight: 28,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  optionCorrect: {
    backgroundColor: COLORS.correctSoft,
    borderColor: COLORS.correct,
  },
  optionWrong: {
    backgroundColor: COLORS.wrongSoft,
    borderColor: COLORS.wrong,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionLetterText: {
    ...TYPE.sm,
    ...TYPE.bold,
    color: COLORS.textSecondary,
  },
  optionText: {
    ...TYPE.lg,
    ...TYPE.semibold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  // True/False
  tfRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tfOption: {
    flex: 1,
    padding: 22,
    minHeight: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tfTrue: {
    backgroundColor: COLORS.correctSoft,
  },
  tfFalse: {
    backgroundColor: COLORS.wrongSoft,
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
