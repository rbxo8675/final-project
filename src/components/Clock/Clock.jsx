import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import DigitalLarge from './DigitalLarge';
import Analog from './Analog';
import DigitalSmall from './DigitalSmall';
import styles from './Clock.module.css';

const Clock = ({ style }) => {
  const [time, setTime] = useState(new Date());
  const { language } = useSettings();

  // Use prop style if provided, otherwise default to digital-large
  const clockStyle = style || 'digital-large';

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clockContainer}>
      {clockStyle === 'digital-large' && (
        <DigitalLarge time={time} language={language} />
      )}
      {clockStyle === 'analog' && <Analog time={time} />}
      {clockStyle === 'digital-small' && (
        <DigitalSmall time={time} language={language} />
      )}
    </div>
  );
};

export default Clock;
