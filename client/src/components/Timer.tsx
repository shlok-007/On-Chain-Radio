import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimerEnd: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimerEnd }) => {
  const [time, setTime] = useState<number>(initialTime);

  useEffect(() => {
    // Exit early when the timer reaches 0
    if (time <= 0) {
      onTimerEnd();
      return;
    }

    // Set up the interval to decrement the time
    const timerInterval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, [time, onTimerEnd]);

  // Format seconds into "mm:ss" string
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className='inline-block'>
      <p className='text-lg'>{formatTime()}</p>
    </div>
  );
};

export default Timer;
