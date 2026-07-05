// تولید عدد تصادفی برای تمرین خوانش اعداد
// ترکیبی از: یک/دو رقمی، سه رقمی، چهار رقمی و اعشاری

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// یه عدد تصادفی می‌سازه و به صورت رشته (برای نمایش/تلفظ) برمی‌گردونه
export function generateRandomNumber() {
  const roll = Math.random();

  if (roll < 0.3) {
    // یک یا دو رقمی
    return String(randomInt(1, 99));
  }
  if (roll < 0.6) {
    // سه رقمی
    return String(randomInt(100, 999));
  }
  if (roll < 0.8) {
    // چهار رقمی
    return String(randomInt(1000, 9999));
  }

  // اعشاری (یک یا دو رقم اعشار)
  const whole = randomInt(1, 999);
  const decimalDigits = Math.random() < 0.5 ? 1 : 2;
  const decimalPart =
    decimalDigits === 1
      ? String(randomInt(1, 9))
      : String(randomInt(1, 99)).padStart(2, '0');
  return `${whole}.${decimalPart}`;
}

// یه گزینه‌ی غلط ولی شبیه به عدد درست می‌سازه (یه رقم رو عوض می‌کنه)
// تا گزینه‌های کوییز خیلی بی‌ربط نباشن
function makeDistractor(correctStr, usedSet) {
  let attempt;
  let tries = 0;
  do {
    const chars = correctStr.split('');
    const digitIndices = chars
      .map((c, i) => i)
      .filter((i) => chars[i] !== '.');
    const idx = digitIndices[randomInt(0, digitIndices.length - 1)];
    let newDigit;
    do {
      newDigit = String(randomInt(0, 9));
    } while (newDigit === chars[idx]);
    chars[idx] = newDigit;
    // جلوگیری از صفر در ابتدای عدد
    if (chars[0] === '0') {
      chars[0] = String(randomInt(1, 9));
    }
    attempt = chars.join('');
    tries++;
  } while ((attempt === correctStr || usedSet.has(attempt)) && tries < 20);
  return attempt;
}

// یه سوال کامل کوییز می‌سازه: عدد درست + ۳ گزینه‌ی غلط + گزینه‌ها قاطی‌شده
export function generateNumberQuestion() {
  const correct = generateRandomNumber();
  const options = new Set([correct]);
  while (options.size < 4) {
    options.add(makeDistractor(correct, options));
  }
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  return { correct, options: shuffled };
}

export const ROUNDS_PER_SESSION = 10;
