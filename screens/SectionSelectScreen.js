import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { SECTIONS } from '../data/sections';

const CARD_META = {
  collocation: { emoji: '🧩', color: '#4F46E5', bg: '#EEF2FF' },
  words: { emoji: '📖', color: '#0D9488', bg: '#ECFDF5' },
  numbers: { emoji: '🔢', color: '#B45309', bg: '#FEF3C7' },
};

export default function SectionSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ptelearning</Text>
        <Text style={styles.headerSubtitle}>یه بخش رو برای شروع انتخاب کن</Text>
      </View>

      <View style={styles.cards}>
        {Object.values(SECTIONS).map((section) => {
          const meta = CARD_META[section.key] || CARD_META.collocation;
          const wordCount = section.lessons.reduce((s, l) => s + l.words.length, 0);
          return (
            <TouchableOpacity
              key={section.key}
              style={[styles.card, { backgroundColor: meta.bg }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home', { section: section.key })}
            >
              <Text style={styles.emoji}>{meta.emoji}</Text>
              <Text style={[styles.cardTitle, { color: meta.color }]}>{section.title}</Text>
              <Text style={styles.cardSubtitle}>{section.subtitle}</Text>
              <Text style={styles.cardCount}>
                {section.lessons.length} درس • {wordCount} عبارت
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.card, { backgroundColor: CARD_META.numbers.bg }]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NumbersHome')}
        >
          <Text style={styles.emoji}>{CARD_META.numbers.emoji}</Text>
          <Text style={[styles.cardTitle, { color: CARD_META.numbers.color }]}>اعداد</Text>
          <Text style={styles.cardSubtitle}>تمرین خوانش اعداد با گوش دادن</Text>
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
  cardCount: { fontSize: 12, color: '#9CA3AF', marginTop: 10, fontWeight: '600' },
});
