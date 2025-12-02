import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { getContent } from '../../services/quote';
import styles from './Quote.module.css';

const Quote = () => {
  const { widgets, language = 'ko', bibleTranslation = 'korean' } = useSettings();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quoteType = widgets?.quote?.type || 'both'; // 'bible' | 'quote' | 'both'

  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteType, language, bibleTranslation]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getContent(language, quoteType, bibleTranslation);
      setContent(data);
    } catch (err) {
      console.error('Failed to load quote/verse:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.quoteContainer}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className={styles.quoteContainer}>
        <div className={styles.error}>Failed to load content</div>
        <button onClick={loadContent} className={styles.retryBtn}>
          Retry
        </button>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className={styles.quoteContainer}>
      <div className={styles.quoteText}>
        "{content.text}"
      </div>

      <div className={styles.quoteSource}>
        {content.type === 'bible' ? (
          <span>- {content.reference}</span>
        ) : (
          <span>- {content.author}</span>
        )}
      </div>

      <button
        onClick={loadContent}
        className={styles.refreshBtn}
        title={language === 'ko' ? '새로고침' : 'Refresh'}
      >
        🔄
      </button>
    </div>
  );
};

export default Quote;
