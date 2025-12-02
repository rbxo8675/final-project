import styles from './Clock.module.css';

const DigitalLarge = ({ time, language }) => {
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = () => {
    if (language === 'ko') {
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const date = time.getDate();
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const day = days[time.getDay()];
      return `${year}년 ${month}월 ${date}일 ${day}`;
    } else {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return time.toLocaleDateString('en-US', options);
    }
  };

  return (
    <div className={styles.digitalLarge}>
      <div className={styles.time}>{formatTime()}</div>
      <div className={styles.date}>{formatDate()}</div>
    </div>
  );
};

export default DigitalLarge;
