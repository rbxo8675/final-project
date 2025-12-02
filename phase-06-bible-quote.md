# Phase 6: 성경/명언

## 목표
성경 구절과 명언을 표시하며, 사용자가 선택할 수 있도록 구현합니다.

## 작업 내용

### 1. Bible API 서비스 생성
`src/services/bible.js` 파일 생성

#### API 옵션
여러 Bible API 중 선택 가능:
- **Bible API**: https://bible-api.com/
- **API.Bible**: https://scripture.api.bible/ (API 키 필요)
- **자체 JSON 데이터**: 간단한 구절 모음

#### 구현 예시 (bible-api.com)
```javascript
const BIBLE_API = 'https://bible-api.com';

export const getRandomVerse = async (translation = 'kjv') => {
  // 인기 구절 목록
  const verses = [
    'john 3:16',
    'philippians 4:13',
    'proverbs 3:5-6',
    'psalm 23:1',
    'romans 8:28',
    'jeremiah 29:11',
    'matthew 6:33',
    'isaiah 40:31',
    'joshua 1:9',
    'psalm 46:1'
    // 더 많은 구절 추가
  ];

  const randomVerse = verses[Math.floor(Math.random() * verses.length)];

  const response = await fetch(`${BIBLE_API}/${randomVerse}?translation=${translation}`);
  const data = await response.json();

  return {
    text: data.text.trim(),
    reference: data.reference,
    translation: data.translation_name
  };
};
```

#### 한글 성경 지원
자체 JSON 파일 생성: `src/data/koreanVerses.json`
```json
[
  {
    "text": "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
    "reference": "요한복음 3:16",
    "translation": "개역한글"
  },
  {
    "text": "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라",
    "reference": "빌립보서 4:13",
    "translation": "개역한글"
  }
  // 더 많은 구절 추가
]
```

```javascript
import koreanVerses from '../data/koreanVerses.json';

export const getKoreanVerse = () => {
  const randomIndex = Math.floor(Math.random() * koreanVerses.length);
  return koreanVerses[randomIndex];
};
```

### 2. Quote API 서비스 생성
`src/services/quote.js` 파일 생성

#### API 옵션
- **Quotable**: https://api.quotable.io/
- **ZenQuotes**: https://zenquotes.io/api/random

#### 구현 예시 (Quotable)
```javascript
const QUOTE_API = 'https://api.quotable.io';

export const getRandomQuote = async () => {
  const response = await fetch(`${QUOTE_API}/random`);
  const data = await response.json();

  return {
    text: data.content,
    author: data.author,
    tags: data.tags
  };
};
```

#### 한글 명언 지원
자체 JSON 파일: `src/data/koreanQuotes.json`
```json
[
  {
    "text": "행복은 습관이다. 그것을 몸에 지니라.",
    "author": "허버드"
  },
  {
    "text": "산다는것 그것은 치열한 전투이다.",
    "author": "로망 롤랑"
  }
  // 더 많은 명언 추가
]
```

### 3. Quote 컴포넌트 생성
`src/components/Quote/Quote.jsx`와 `Quote.module.css` 생성

#### 컴포넌트 구조
```javascript
const Quote = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { widgets, language, bibleTranslation } = useSettings();

  const quoteType = widgets.quote.type; // 'bible' | 'quote' | 'both'

  useEffect(() => {
    loadContent();
  }, [quoteType, language]);

  const loadContent = async () => {
    setLoading(true);
    try {
      let data;

      if (quoteType === 'bible') {
        data = await loadBible();
      } else if (quoteType === 'quote') {
        data = await loadQuote();
      } else if (quoteType === 'both') {
        // 랜덤하게 성경 또는 명언
        data = Math.random() > 0.5 ? await loadBible() : await loadQuote();
      }

      setContent(data);
    } catch (error) {
      console.error('Failed to load quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBible = async () => {
    if (language === 'ko') {
      return { ...getKoreanVerse(), type: 'bible' };
    } else {
      const verse = await getRandomVerse(bibleTranslation);
      return { ...verse, type: 'bible' };
    }
  };

  const loadQuote = async () => {
    if (language === 'ko') {
      const quotes = await import('../data/koreanQuotes.json');
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      return { ...randomQuote, type: 'quote' };
    } else {
      const quote = await getRandomQuote();
      return { ...quote, type: 'quote' };
    }
  };

  if (loading) return <div className={styles.loader}>Loading...</div>;
  if (!content) return null;

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteText}>"{content.text}"</div>
      <div className={styles.quoteSource}>
        {content.type === 'bible' ? (
          <span>- {content.reference}</span>
        ) : (
          <span>- {content.author}</span>
        )}
      </div>
      <button onClick={loadContent} className={styles.refreshBtn}>
        새 {content.type === 'bible' ? '구절' : '명언'}
      </button>
    </div>
  );
};
```

### 4. CSS 스타일링
`Quote.module.css`

#### 주요 스타일
- 중앙 또는 하단 배치
- 반투명 배경
- 텍스트 정렬 (중앙)
- 인용구 스타일 ("" 표시)
- 출처 표시 (작은 글씨, 이탤릭)
- 새로고침 버튼

### 5. 번역본 옵션
성경 번역본 선택:
- `kjv` - King James Version
- `web` - World English Bible
- `korean` - 개역한글 (자체 데이터)

### 6. App.js에 Quote 추가
```javascript
import Quote from './components/Quote/Quote';

function App() {
  const { widgets } = useSettings();

  return (
    <AppProvider>
      <Background />
      {widgets.clock.enabled && <Clock />}
      {widgets.weather.enabled && <Weather />}
      {widgets.quote.enabled && <Quote />}
      {/* 다른 컴포넌트들 */}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] 성경 구절이 정상 표시됨
- [ ] 명언이 정상 표시됨
- [ ] 성경/명언 선택이 작동함
- [ ] 한글/영어 전환이 작동함
- [ ] 새로고침 버튼이 작동함
- [ ] 번역본 선택이 가능함
- [ ] 에러 처리가 구현됨

## 주의사항
- API 제한: 일부 API는 사용 제한이 있을 수 있음
- 폴백: API 실패 시 로컬 데이터 사용
- 자체 데이터: 충분한 양의 구절/명언 준비 (최소 50개 이상)

## 개선 아이디어
- [ ] 즐겨찾기 기능
- [ ] 공유 기능 (SNS)
- [ ] 구절/명언 검색 기능
- [ ] 카테고리별 필터링

## 다음 단계
Phase 7: 북마크 구현
