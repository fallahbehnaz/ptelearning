import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Speech from 'expo-speech';
import { generateRandomNumber, ROUNDS_PER_SESSION } from '../data/numbers';
import { saveLessonScore } from '../data/progress';
import SpeakButton from '../components/SpeakButton';
import PronunciationCheck from '../components/PronunciationCheck';

const NUMBERS_PROGRESS_KEY = 'english_app_progress_numbers';

// عدد تایپ‌شده رو نرمالایز می‌کنه (فاصله/کاما رو حذف می‌کنه) تا مقایسه منصفانه باشه
function normalize(value) {
  return value.trim().replace(/,/g, '');
}

export default function NumberTypingScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => generateRandomNumber());
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    Speech.stop();
    Speech.speak(current, { language: 'en-US', rate: 0.9 });
    return () => Speech.stop();
  }, [current]);

  const handleCheck = () => {
    if (checked || !input) return;
    const correct = normalize(input) === current;
    setIsCorrect(correct);
    setChecked(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (round === ROUNDS_PER_SESSION - 1) {
      saveLessonScore(NUMBERS_PROGRESS_KEY, 'typing', score, ROUNDS_PER_SESSION);
      setFinished(true);
    } else {
      setRound((r) => r + 1);
      setCurrent(generateRandomNumber());
      setInput('');
      setChecked(false);
    }
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
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setRound(0);
              setScore(0);
              setCurrent(generateRandomNumber());
              setInput('');
              setChecked(false);
              setFinished(false);
            }}
          >
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.progressText}>
          سوال {round + 1} از {ROUNDS_PER_SESSION}
        </Text>

        <View style={styles.speakArea}>
          <SpeakButton text={current} size={88} color="#4F46E5" />
          <Text style={styles.instruction}>عدد رو گوش بده و با رقم بنویسش</Text>
          <PronunciationCheck target={current} />
        </View>

        <TextInput
          style={[
            styles.input,
            checked && (isCorrect ? styles.inputCorrect : styles.inputWrong),
          ]}
          value={input}
          onChangeText={setInput}
          keyboardType="decimal-pad"
          placeholder="مثلاً 247"
          placeholderTextColor="#9CA3AF"
          editable={!checked}
          textAlign="center"
        />

        {checked && !isCorrect && (
          <Text style={styles.correctAnswerText}>جواب درست: {current}</Text>
        )}

        {!checked ? (
          <TouchableOpacity
            style={[styles.actionButton, !input && styles.disabledButton]}
            onPress={handleCheck}
            disabled={!input}
          >
            <Text style={styles.actionButtonText}>بررسی</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionButtonNext} onPress={handleNext}>
            <Text style={styles.actionButtonText}>
              {round === ROUNDS_PER_SESSION - 1 ? 'پایان' : 'سوال بعدی'}
            </Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 20 },
  progressText: { color: '#6B7280', fontWeight: '600', marginTop: 10, textAlign: 'center' },
  speakArea: { alignItems: 'center', marginTop: 30, marginBottom: 30, gap: 14 },
  instruction: { color: '#9CA3AF', textAlign: 'center' },
  input: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 18,
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  inputCorrect: { borderColor: '#22C55E', backgroundColor: '#F0FDF4' },
  inputWrong: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  correctAnswerText: { textAlign: 'center', color: '#EF4444', marginTop: 10, fontWeight: '600' },
  actionButton: {
    marginTop: 24,
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionButtonNext: {
    marginTop: 24,
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.4 },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
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
