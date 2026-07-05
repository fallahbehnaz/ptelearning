import { LESSONS, getLessonById, generateQuiz } from './lessons';
import { WORD_LESSONS, getWordLessonById, generateWordQuiz } from './words';

// رجیستری بخش‌های اپ. هر بخش دیتای خودش، توابع خودش و کلید ذخیره‌ی پیشرفت جدا داره
// تا پیشرفت کالوکیشن با پیشرفت لغات قاطی نشه.
export const SECTIONS = {
  collocation: {
    key: 'collocation',
    title: 'کالوکیشن',
    subtitle: 'عبارت‌های دوکلمه‌ای و بیشتر برای PTE',
    lessons: LESSONS,
    getLessonById,
    generateQuiz,
    progressKey: 'english_app_progress_collocation',
  },
  words: {
    key: 'words',
    title: 'لغات',
    subtitle: 'لغات تکی برای PTE',
    lessons: WORD_LESSONS,
    getLessonById: getWordLessonById,
    generateQuiz: generateWordQuiz,
    progressKey: 'english_app_progress_words',
  },
};

export function getSection(key) {
  return SECTIONS[key];
}
