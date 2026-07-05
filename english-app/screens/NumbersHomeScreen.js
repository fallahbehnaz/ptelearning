import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProgress } from '../data/progress';

const NUMBERS_PROGRESS_KEY = 'english_app_progress_numbers';

export default function NumbersHomeScreen({ navigation }) {
  const [progress, setProgress] = useState({});

  useFocusEffect(
    useCallback(() => {
      getProgress(NUMBERS_PROGRESS_KEY).then(setProgress);
    }, [])
  );

  const choiceBest = progress.choice?.best;
  const typingBest = progress.typing?.best;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SectionSelect')}>
          <Text style={styles.backButtonText}>‹ بازگشت</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اعداد</Text>
        <Text style={styles.headerSubtitle}>تمرین خوانش اعداد یک تا چهار رقمی و اعشاری</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FEF3C7' }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NumberChoice')}
        >
          <Text style={styles.emoji}>🎯</Text>
          <Text style={[styles.cardTitle, { color: '#B45309' }]}>چندگزینه‌ای</Text>
          <Text style={styles.cardSubtitle}>عدد رو گوش کن، از بین ۴ گزینه انتخاب کن</Text>
          {choiceBest != null && (
            <Text style={styles.bestScore}>بهترین امتیاز: {choiceBest}/10</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#DBEAFE' }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NumberTyping')}
        >
          <Text style={styles.emoji}>⌨️</Text>
          <Text style={[styles.cardTitle, { color: '#1D4ED8' }]}>تایپ کن</Text>
          <Text style={styles.cardSubtitle}>عدد رو گوش کن و با رقم بنویسش</Text>
          {typingBest != null && (
            <Text style={styles.bestScore}>بهترین امتیاز: {typingBest}/10</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    padding: 20,
    backgroundColor: '#4F46E5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: { marginBottom: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#E0E7FF', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#E0E7FF', marginTop: 4 },
  cards: { padding: 16, gap: 16, marginTop: 8 },
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  emoji: { fontSize: 40, marginBottom: 8 },
  cardTitle: { fontSize: 20, fontWeight: '700' },
  cardSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },
  bestScore: { fontSize: 12, color: '#9CA3AF', marginTop: 10, fontWeight: '600' },
});
