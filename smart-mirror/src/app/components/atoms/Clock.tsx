// src/app/components/atoms/Clock.tsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-6xl font-light text-white mb-2">
        {format(time, 'HH:mm')}
      </div>
      <div className="text-2xl text-gray-300">
        {format(time, 'EEEE, MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default Clock;