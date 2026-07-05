import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

// عدد/حرف اضافه/فاصله رو نادیده می‌گیره تا مقایسه منصفانه باشه
function normalize(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[.,!?؛،]/g, '')
    .replace(/\s+/g, ' ');
}

// دکمه‌ی میکروفون: صدای کاربر رو می‌گیره، به متن تبدیل می‌کنه
// و با متن هدف (target) مقایسه می‌کنه تا بگه درست تلفظ کرده یا نه
export default function PronunciationCheck({ target, light = false }) {
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null); // { correct, heard, error }

  useSpeechRecognitionEvent('start', () => setListening(true));
  useSpeechRecognitionEvent('end', () => setListening(false));
  useSpeechRecognitionEvent('result', (event) => {
    const heard = event.results?.[0]?.transcript || '';
    setResult({ correct: normalize(heard) === normalize(target), heard });
  });
  useSpeechRecognitionEvent('error', (event) => {
    setListening(false);
    setResult({ correct: false, heard: '', error: event.error });
  });

  const handlePress = async () => {
    setResult(null);
    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      setResult({ correct: false, heard: '', error: 'no-permission' });
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: false,
      continuous: false,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.micButton, listening && styles.micButtonActive]}
        onPress={handlePress}
        disabled={listening}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {listening ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.micIcon}>🎤</Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.hint, light && styles.hintLight]}>
        {listening ? 'در حال گوش دادن...' : 'بزن و بگو'}
      </Text>

      {result && (
        <View style={[styles.resultBox, result.correct ? styles.resultCorrect : styles.resultWrong]}>
          {result.error ? (
            <Text style={styles.resultText}>
              {result.error === 'no-permission'
                ? 'دسترسی به میکروفون داده نشده'
                : 'صدایی شنیده نشد، دوباره امتحان کن'}
            </Text>
          ) : (
            <>
              <Text style={styles.resultText}>
                {result.correct ? '✅ درست گفتی!' : '❌ درست نبود'}
              </Text>
              <Text style={styles.heardText}>شنیدم: {result.heard || '—'}</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 6 },
  micButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: { backgroundColor: '#B91C1C' },
  micIcon: { fontSize: 24 },
  hint: { fontSize: 12, color: '#6B7280' },
  hintLight: { color: 'rgba(255,255,255,0.85)' },
  resultBox: {
    marginTop: 4,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 200,
  },
  resultCorrect: { backgroundColor: '#BBF7D0' },
  resultWrong: { backgroundColor: '#FECACA' },
  resultText: { fontWeight: '700', color: '#1F2937' },
  heardText: { fontSize: 12, color: '#374151', marginTop: 2 },
});
