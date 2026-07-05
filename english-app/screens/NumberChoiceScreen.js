import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import * as Speech from 'expo-speech';
import { generateNumberQuestion, ROUNDS_PER_SESSION } from '../data/numbers';
import { saveLessonScore } from '../data/progress';
import SpeakButton from '../components/SpeakButton';
import PronunciationCheck from '../components/PronunciationCheck';

const NUMBERS_PROGRESS_KEY = 'english_app_progress_numbers';

export default function NumberChoiceScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const question = useMemo(() => generateNumberQuestion(), [round]);

  // با شروع هر سوال، عدد رو یه بار خودکار می‌خونه
  useEffect(() => {
    Speech.stop();
    Speech.speak(question.correct, { language: 'en-US', rate: 0.9 });
    return () => Speech.stop();
  }, [question]);

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === question.correct;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (round === ROUNDS_PER_SESSION - 1) {
        const finalScore = isCorrect ? score + 1 : score;
        saveLessonScore(NUMBERS_PROGRESS_KEY, 'choice', finalScore, ROUNDS_PER_SESSION);
        setFinished(true);
      } else {
        setSelected(null);
        setRound((r) => r + 1);
      }
    }, 700);
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultBox}>
          <Text style={styles.resultEmoji}>
            {score === ROUNDS_PER_SESSION ? '🎉' : score >= ROUNDS_PER_SESSION / 2 ? '👍' : '💪'}
          </Text>
          <Text style={styles.resultTitle}>تموم شد!</Text>
          <Text style={styles.resultScore}>
            {score} از {ROUNDS_PER_SESSION} درست
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setRound(0);
            setScore(0);
            setSelected(null);
            setFinished(false);
          }}>
            <Text style={styles.retryButtonText}>یه بار دیگه</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('NumbersHome')}>
            <Text style={styles.homeButtonText}>بازگشت</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.progressText}>
        سوال {round + 1} از {ROUNDS_PER_SESSION}
      </Text>

      <View style={styles.speakArea}>
        <SpeakButton text={question.correct} size={88} color="#4F46E5" />
        <Text style={styles.instruction}>عدد رو گوش بده و رقمش رو انتخاب کن</Text>
        <PronunciationCheck target={question.correct} />
      </View>

      <View style={styles.options}>
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correct;
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
  progressText: { color: '#6B7280', fontWeight: '600', marginTop: 10, textAlign: 'center' },
  speakArea: { alignItems: 'center', marginTop: 30, marginBottom: 30, gap: 14 },
  instruction: { color: '#9CA3AF', textAlign: 'center' },
  options: { gap: 12 },
  optionButton: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionText: { fontSize: 22, fontWeight: '700', color: '#1F2937', textAlign: 'center' },
  resultBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultEmoji: { fontSize: 64 },
  resultTitle: { fontSize: 22, fontWeight: '700', marginTop: 16, color: '#1F2937' },
  resultScore: { fontSize: 18, color: '#6B7280', marginTop: 8 },
  retryButton: {
    marginTop: 30,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  retryButtonText: { color: '#fff', fontWeight: '700' },
  homeButton: { marginTop: 14, padding: 10 },
  homeButtonText: { color: '#6B7280', fontWeight: '600' },
});
