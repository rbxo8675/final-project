import styles from './Clock.module.css';

const Analog = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  // Calculate rotation degrees for each hand
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = ((hours + minutes / 60) / 12) * 360;

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className={styles.hourMarker}
      style={{ transform: `rotate(${i * 30}deg)` }}
    />
  ));

  return (
    <div className={styles.analog}>
      <div className={styles.clockFace}>
        {/* Hour markers */}
        {hourMarkers}

        {/* Clock hands */}
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />

        {/* Center dot */}
        <div className={styles.center} />
      </div>
    </div>
  );
};

export default Analog;
