import styles from './Clock.module.css';

const DigitalSmall = ({ time, language }) => {
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = () => {
    if (language === 'ko') {
      const year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, '0');
      const date = time.getDate().toString().padStart(2, '0');
      return `${year}.${month}.${date}`;
    } else {
      return time.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  return (
    <div className={styles.digitalSmall}>
      <span className={styles.timeSmall}>{formatTime()}</span>
      <span className={styles.dateSmall}>{formatDate()}</span>
    </div>
  );
};

export default DigitalSmall;
