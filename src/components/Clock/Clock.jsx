import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import DigitalLarge from './DigitalLarge';
import Analog from './Analog';
import DigitalSmall from './DigitalSmall';
import styles from './Clock.module.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { widgets, language } = useSettings();

  const clockStyle = widgets?.clock?.style || 'digital-large';
  const enabled = widgets?.clock?.enabled ?? true;

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!enabled) return null;

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
