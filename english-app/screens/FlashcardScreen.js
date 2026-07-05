import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { getSection } from '../data/sections';
import SpeakButton from '../components/SpeakButton';

export default function FlashcardScreen({ route, navigation }) {
  const { section: sectionKey, lessonId } = route.params;
  const section = getSection(sectionKey);
  const lesson = section.getLessonById(lessonId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = lesson.words[index];
  const isLast = index === lesson.words.length - 1;

  const handleNext = () => {
    if (isLast) {
      navigation.replace('Quiz', { section: sectionKey, lessonId });
    } else {
      setFlipped(false);
      setIndex(index + 1);
    }
  };

  const handlePrev = () => {
    if (index > 0) {
      setFlipped(false);
      setIndex(index - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.progressText}>
        {index + 1} / {lesson.words.length}
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={0.9}
      >
        <Text style={styles.wordText}>{flipped ? word.fa : word.en}</Text>
        <SpeakButton text={word.en} size={52} color="rgba(255,255,255,0.25)" />
        <Text style={styles.hint}>{flipped ? 'برای دیدن انگلیسی بزن' : 'برای دیدن معنی بزن'}</Text>
      </TouchableOpacity>

      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navButton, index === 0 && styles.disabledButton]}
          onPress={handlePrev}
          disabled={index === 0}
        >
          <Text style={styles.navButtonText}>قبلی</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext}>
          <Text style={styles.navButtonPrimaryText}>
            {isLast ? 'شروع آزمون' : 'بعدی'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', alignItems: 'center', padding: 20 },
  progressText: { marginTop: 10, color: '#6B7280', fontWeight: '600' },
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    gap: 18,
  },
  wordText: { fontSize: 40, fontWeight: '700', color: '#fff', textAlign: 'center', paddingHorizontal: 16 },
  hint: { color: '#E0E7FF', marginTop: 4, fontSize: 13 },
  navRow: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 20 },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.4 },
  navButtonText: { fontWeight: '600', color: '#374151' },
  navButtonPrimary: {
    flex: 2,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
  },
  navButtonPrimaryText: { fontWeight: '700', color: '#fff' },
});
