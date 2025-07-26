'use client';
import { useEffect, useState } from 'react';

export default function CountdownTimer({ end }: { end: number }) {
  const [timeLeft, setTimeLeft] = useState(end - Date.now());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(end - Date.now()), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (timeLeft <= 0) return <span className="text-red-400">Ended</span>;
  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  return (
    <span>{hours}h {minutes}m {seconds}s</span>
  );
}
