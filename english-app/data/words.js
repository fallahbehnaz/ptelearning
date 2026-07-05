// لغات تکی PTE — تولید شده خودکار از فایل اکسل، به دو درس تقسیم شده
export const WORD_LESSONS = [
  {
    "id": "1",
    "title": "لغات ۱",
    "words": [
      {
            "id": "w1",
            "en": "Sustainable",
            "fa": "پایدار"
      },
      {
            "id": "w2",
            "en": "Development",
            "fa": "توسعه"
      },
      {
            "id": "w3",
            "en": "Economic",
            "fa": "اقتصادی"
      },
      {
            "id": "w4",
            "en": "Growth",
            "fa": "رشد"
      },
      {
            "id": "w5",
            "en": "Transport",
            "fa": "حمل و نقل"
      },
      {
            "id": "w6",
            "en": "Emissions",
            "fa": "انتشار"
      },
      {
            "id": "w7",
            "en": "Global",
            "fa": "جهانی"
      },
      {
            "id": "w8",
            "en": "Tax",
            "fa": "مالیات"
      },
      {
            "id": "w9",
            "en": "Credits",
            "fa": "اعتبار"
      },
      {
            "id": "w10",
            "en": "Payments",
            "fa": "پرداخت"
      },
      {
            "id": "w11",
            "en": "Subsidies",
            "fa": "یارانه"
      },
      {
            "id": "w12",
            "en": "Agricultural",
            "fa": "کشاورزی"
      },
      {
            "id": "w13",
            "en": "Adjustment",
            "fa": "تعدیل"
      },
      {
            "id": "w14",
            "en": "Industry",
            "fa": "صنعت"
      },
      {
            "id": "w15",
            "en": "Costs",
            "fa": "هزینه"
      },
      {
            "id": "w16",
            "en": "Depression",
            "fa": "رکود"
      },
      {
            "id": "w17",
            "en": "Mercury",
            "fa": "جیوه"
      },
      {
            "id": "w18",
            "en": "Disinfectants",
            "fa": "ضدعفونی‌کننده"
      }
]
  },
  {
    "id": "2",
    "title": "لغات ۲",
    "words": [
      {
            "id": "w19",
            "en": "Thermometers",
            "fa": "دماسنج"
      },
      {
            "id": "w20",
            "en": "Barometers",
            "fa": "فشارسنج"
      },
      {
            "id": "w21",
            "en": "Pressure",
            "fa": "فشار"
      },
      {
            "id": "w22",
            "en": "Weather",
            "fa": "آب و هوا"
      },
      {
            "id": "w23",
            "en": "Thermostats",
            "fa": "ترموستات"
      },
      {
            "id": "w24",
            "en": "Toners",
            "fa": "تونر"
      },
      {
            "id": "w25",
            "en": "Scientific",
            "fa": "علمی"
      },
      {
            "id": "w26",
            "en": "Research",
            "fa": "تحقیق"
      },
      {
            "id": "w27",
            "en": "Technological",
            "fa": "تکنولوژیک"
      },
      {
            "id": "w28",
            "en": "Innovation",
            "fa": "نوآوری"
      },
      {
            "id": "w29",
            "en": "Artificial",
            "fa": "مصنوعی"
      },
      {
            "id": "w30",
            "en": "Genetic",
            "fa": "ژنتیکی"
      },
      {
            "id": "w31",
            "en": "Engineering",
            "fa": "مهندسی"
      },
      {
            "id": "w32",
            "en": "Clinical",
            "fa": "بالینی"
      },
      {
            "id": "w33",
            "en": "Financial",
            "fa": "مالی"
      },
      {
            "id": "w34",
            "en": "Stability",
            "fa": "ثبات"
      },
      {
            "id": "w35",
            "en": "Investment",
            "fa": "سرمایه‌گذاری"
      },
      {
            "id": "w36",
            "en": "Corporate",
            "fa": "شرکتی"
      }
]
  }
];

export function getWordLessonById(id) {
  return WORD_LESSONS.find((l) => l.id === id);
}

// ساخت سوالات کوییز به صورت خودکار از روی لغات درس
export function generateWordQuiz(lesson) {
  const allWords = WORD_LESSONS.flatMap((l) => l.words);
  return lesson.words.map((word) => {
    const wrongOptions = allWords
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.fa);
    const options = [...wrongOptions, word.fa].sort(() => Math.random() - 0.5);
    return {
      id: word.id,
      question: word.en,
      correctAnswer: word.fa,
      options,
    };
  });
}
