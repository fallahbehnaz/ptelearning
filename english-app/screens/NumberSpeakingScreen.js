import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { generateRandomNumber, ROUNDS_PER_SESSION } from '../data/numbers';
import { saveLessonScore } from '../data/progress';
import PronunciationCheck from '../components/PronunciationCheck';

const NUMBERS_PROGRESS_KEY = 'english_app_progress_numbers';

export default function NumberSpeakingScreen({ navigation }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // با تغییر round یا وقتی کاربر خودش رد می‌کنه (key)، عدد جدید می‌سازیم
  const [refreshKey, setRefreshKey] = useState(0);
  const number = useMemo(() => generateRandomNumber(), [round, refreshKey]);

  // وقتی نتیجه‌ی تشخیص گفتار مشخص شد (درست/غلط)، امتیاز رو ثبت می‌کنیم
  // و بعد از یه مکث کوتاه می‌ریم سوال بعدی
  const handleResult = (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    setTimeout(() => {
      if (round === ROUNDS_PER_SESSION - 1) {
        saveLessonScore(NUMBERS_PROGRESS_KEY, 'speaking', newScore, ROUNDS_PER_SESSION);
        setFinished(true);
      } else {
        setRound((r) => r + 1);
      }
    }, 1200);
  };

  const handleSkip = () => {
    // اگه بخواد بدون امتیاز به عدد بعدی بره
    if (round === ROUNDS_PER_SESSION - 1) {
      saveLessonScore(NUMBERS_PROGRESS_KEY, 'speaking', score, ROUNDS_PER_SESSION);
      setFinished(true);
    } else {
      setRound((r) => r + 1);
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
              setFinished(false);
              setRefreshKey((k) => k + 1);
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.progressText}>
        سوال {round + 1} از {ROUNDS_PER_SESSION}
      </Text>

      <View style={styles.numberCard}>
        <Text style={styles.numberText}>{number}</Text>
      </View>

      <Text style={styles.instruction}>این عدد رو با صدای بلند بخون</Text>

      <View style={styles.checkArea}>
        {/* کلید (key) عوض می‌شه تا با هر عدد جدید، نتیجه‌ی قبلی پاک بشه */}
        <PronunciationCheck key={`${round}-${refreshKey}`} target={number} onResult={handleResult} />
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>رد شدن از این سوال ›</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 20 },
  progressText: { color: '#6B7280', fontWeight: '600', marginTop: 10, textAlign: 'center' },
  numberCard: {
    marginTop: 30,
    backgroundColor: '#4F46E5',
    borderRadius: 24,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontSize: 52, fontWeight: '800', color: '#fff', letterSpacing: 2 },
  instruction: { color: '#9CA3AF', textAlign: 'center', marginTop: 20, marginBottom: 10 },
  checkArea: { alignItems: 'center', marginTop: 10 },
  skipButton: { alignSelf: 'center', marginTop: 30, padding: 10 },
  skipButtonText: { color: '#9CA3AF', fontWeight: '600' },
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
