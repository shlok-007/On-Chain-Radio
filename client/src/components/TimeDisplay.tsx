import React from 'react';
import Timer from './Timer';

const TimeDisplay: React.FC = () => {
  const handleTimerEnd = () => {
    console.log('Timer has ended!');
    // Add your logic when the timer ends
  };

  return (
    <div>
      <h1>My App</h1>
      <Timer initialTime={10} onTimerEnd={() => console.log('timer ended')} />
    </div>
  );
};

export default TimeDisplay;
