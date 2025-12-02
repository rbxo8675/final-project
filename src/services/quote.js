import koreanVerses from '../data/koreanVerses.json';
import koreanQuotes from '../data/koreanQuotes.json';

const QUOTABLE_API = 'https://api.quotable.io';

/**
 * 랜덤 영어 명언 가져오기 (Quotable API)
 * @returns {Promise<Object>} 명언 정보
 */
export const getRandomQuote = async () => {
  try {
    const response = await fetch(`${QUOTABLE_API}/random`);

    if (!response.ok) {
      throw new Error(`Quote API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.content,
      author: data.author,
      tags: data.tags,
      type: 'quote'
    };
  } catch (error) {
    console.error('Failed to fetch random quote:', error);
    // 실패 시 로컬 한글 명언에서 랜덤으로 반환
    return getKoreanQuote();
  }
};

/**
 * 한글 명언 가져오기
 * @returns {Object} 명언 정보
 */
export const getKoreanQuote = () => {
  const randomIndex = Math.floor(Math.random() * koreanQuotes.length);
  const quote = koreanQuotes[randomIndex];

  return {
    text: quote.text,
    author: quote.author,
    type: 'quote'
  };
};

/**
 * 한글 성경 구절 가져오기
 * @returns {Object} 성경 구절 정보
 */
export const getKoreanVerse = () => {
  const randomIndex = Math.floor(Math.random() * koreanVerses.length);
  const verse = koreanVerses[randomIndex];

  return {
    text: verse.text,
    reference: verse.reference,
    translation: verse.translation,
    type: 'bible'
  };
};

/**
 * 영어 성경 구절 가져오기 (Bible API)
 * @param {string} translation - 번역본 ('kjv', 'web' 등)
 * @returns {Promise<Object>} 성경 구절 정보
 */
export const getRandomVerse = async (translation = 'kjv') => {
  // 인기 있는 성경 구절 목록
  const popularVerses = [
    'john 3:16',
    'philippians 4:13',
    'proverbs 3:5-6',
    'psalm 23:1',
    'romans 8:28',
    'jeremiah 29:11',
    'matthew 6:33',
    'isaiah 40:31',
    'joshua 1:9',
    'psalm 46:1',
    'matthew 11:28',
    '1 peter 5:7',
    'psalm 27:4',
    'acts 16:31',
    'psalm 4:8',
    'john 14:6',
    '2 corinthians 5:17',
    'ephesians 2:8-9',
    'romans 12:2',
    'galatians 5:22-23'
  ];

  const randomVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)];

  try {
    const response = await fetch(`https://bible-api.com/${randomVerse}?translation=${translation}`);

    if (!response.ok) {
      throw new Error(`Bible API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      text: data.text.trim(),
      reference: data.reference,
      translation: data.translation_name || translation.toUpperCase(),
      type: 'bible'
    };
  } catch (error) {
    console.error('Failed to fetch random verse:', error);
    // 실패 시 로컬 한글 성경 구절에서 반환
    return getKoreanVerse();
  }
};

/**
 * 언어와 타입에 따라 적절한 컨텐츠 가져오기
 * @param {string} language - 언어 ('ko' 또는 'en')
 * @param {string} type - 타입 ('bible', 'quote', 'both')
 * @param {string} bibleTranslation - 성경 번역본
 * @returns {Promise<Object>} 컨텐츠 정보
 */
export const getContent = async (language = 'ko', type = 'both', bibleTranslation = 'korean') => {
  let selectedType = type;

  // 'both'인 경우 랜덤으로 선택
  if (type === 'both') {
    selectedType = Math.random() > 0.5 ? 'bible' : 'quote';
  }

  if (selectedType === 'bible') {
    if (language === 'ko' || bibleTranslation === 'korean') {
      return getKoreanVerse();
    } else {
      return await getRandomVerse(bibleTranslation);
    }
  } else {
    if (language === 'ko') {
      return getKoreanQuote();
    } else {
      return await getRandomQuote();
    }
  }
};
