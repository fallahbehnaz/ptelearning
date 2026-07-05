import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';

// دکمه‌ی بلندگو برای خوندن یک کلمه/عبارت انگلیسی با صدای دستگاه
// size و color قابل تنظیم‌ان تا هم توی فلش‌کارت (بزرگ) و هم توی کوییز (کوچیک) استفاده بشه
export default function SpeakButton({ text, size = 44, color = '#4F46E5', iconColor = '#fff' }) {
  const [speaking, setSpeaking] = useState(false);

  const handlePress = () => {
    if (!text) return;
    Speech.stop();
    setSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.95,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {speaking ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <Text style={[styles.icon, { fontSize: size * 0.45, color: iconColor }]}>🔊</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    includeFontPadding: false,
  },
});
