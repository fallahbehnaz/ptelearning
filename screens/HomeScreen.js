import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getSection } from '../data/sections';
import { getProgress } from '../data/progress';

export default function HomeScreen({ navigation, route }) {
  const { section: sectionKey } = route.params;
  const section = getSection(sectionKey);
  const [progress, setProgress] = useState({});

  useFocusEffect(
    useCallback(() => {
      getProgress(section.progressKey).then(setProgress);
    }, [section.progressKey])
  );

  const renderLesson = ({ item }) => {
    const lessonProgress = progress[item.id];
    const percent = lessonProgress
      ? Math.round((lessonProgress.best / item.words.length) * 100)
      : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Flashcards', { section: sectionKey, lessonId: item.id })
        }
      >
        <View style={styles.deckNumber}>
          <Text style={styles.deckNumberText}>{item.id}</Text>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.words.length} عبارت</Text>
          {lessonProgress && (
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
            </View>
          )}
        </View>
        {lessonProgress && (
          <Text style={styles.percentText}>{percent}%</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SectionSelect')}>
          <Text style={styles.backButtonText}>‹ بازگشت</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{section.title}</Text>
        <Text style={styles.headerSubtitle}>
          {section.lessons.length} دسته • {section.lessons.reduce((s, l) => s + l.words.length, 0)} عبارت
        </Text>
      </View>
      <FlatList
        data={section.lessons}
        keyExtractor={(item) => item.id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
      />
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
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  deckNumber: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  deckNumberText: { fontSize: 18, fontWeight: '700', color: '#4F46E5' },
  cardText: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  percentText: { fontWeight: '700', color: '#4F46E5', marginLeft: 8 },
});
