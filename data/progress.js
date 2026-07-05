import AsyncStorage from '@react-native-async-storage/async-storage';

// حالا هر بخش (کالوکیشن، لغات و...) کلید ذخیره‌ی جدا داره
// progressKey از data/sections.js میاد، مثلا 'english_app_progress_words'

export async function getProgress(progressKey) {
  try {
    const json = await AsyncStorage.getItem(progressKey);
    return json ? JSON.parse(json) : {};
  } catch (e) {
    console.warn('خطا در خواندن پیشرفت:', e);
    return {};
  }
}

export async function saveLessonScore(progressKey, lessonId, score, total) {
  try {
    const progress = await getProgress(progressKey);
    progress[lessonId] = {
      score,
      total,
      completedAt: new Date().toISOString(),
      best: progress[lessonId]?.best
        ? Math.max(progress[lessonId].best, score)
        : score,
    };
    await AsyncStorage.setItem(progressKey, JSON.stringify(progress));
    return progress;
  } catch (e) {
    console.warn('خطا در ذخیره پیشرفت:', e);
  }
}
