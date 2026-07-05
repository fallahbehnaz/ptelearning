import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { getSection } from '../data/sections';
import { saveLessonScore } from '../data/progress';
import SpeakButton from '../components/SpeakButton';

export default function QuizScreen({ route, navigation }) {
  const { section: sectionKey, lessonId } = route.params;
  const section = getSection(sectionKey);
  const lesson = section.getLessonById(lessonId);
  const questions = useMemo(() => section.generateQuiz(lesson), [lessonId]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const question = questions[index];

  const handleSelect = (option) => {
    if (selected) return; // جلوگیری از چند بار انتخاب
    setSelected(option);
    const isCorrect = option === question.correctAnswer;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (index === questions.length - 1) {
        const finalScore = isCorrect ? score + 1 : score;
        saveLessonScore(section.progressKey, lessonId, finalScore, questions.length);
        setFinished(true);
      } else {
        setSelected(null);
        setIndex((i) => i + 1);
      }
    }, 700);
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>
            {score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '💪'}
          </Text>
          <Text style={styles.resultTitle}>آزمون تموم شد!</Text>
          <Text style={styles.resultScore}>
            {score} از {questions.length} درست
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home', { section: sectionKey })}
          >
            <Text style={styles.homeButtonText}>بازگشت به لیست درس‌ها</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.progressText}>
        سوال {index + 1} از {questions.length}
      </Text>
      <View style={styles.questionRow}>
        <Text style={styles.questionText}>{question.question}</Text>
        <SpeakButton text={question.question} size={40} color="#EEF2FF" iconColor="#4F46E5" />
      </View>
      <Text style={styles.instruction}>معنی درست رو انتخاب کن</Text>

      <View style={styles.options}>
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correctAnswer;
          let bgColor = '#fff';
          if (selected) {
            if (isCorrect) bgColor = '#BBF7D0';
            else if (isSelected) bgColor = '#FECACA';
          }
          return (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, { backgroundColor: bgColor }]}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 20 },
  progressText: { color: '#6B7280', fontWeight: '600', marginTop: 10 },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 30,
  },
  questionText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  instruction: { textAlign: 'center', color: '#9CA3AF', marginTop: 8, marginBottom: 30 },
  options: { gap: 12 },
  optionButton: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionText: { fontSize: 16, fontWeight: '600', color: '#1F2937', textAlign: 'center' },
  resultBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: 22, fontWeight: '700', marginTop: 16, color: '#1F2937' },
  resultScore: { fontSize: 18, color: '#6B7280', marginTop: 8 },
  homeButton: {
    marginTop: 30,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  homeButtonText: { color: '#fff', fontWeight: '700' },
});
