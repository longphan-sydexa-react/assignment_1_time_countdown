import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_COUNT = 10;

enum CountdownStatus {
  IDLE = "idle",
  RUNNING = "running",
  PAUSED = "paused",
  FINISHED = "finished",
}

export function Welcome() {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [countdownStatus, setCountdownStatus] = useState<CountdownStatus>(CountdownStatus.IDLE);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isCountValueOver = count <= 0;

  const buttonText = useMemo(() => {
    if (countdownStatus === CountdownStatus.IDLE) {
      return "Start";
    }

    if (countdownStatus === CountdownStatus.RUNNING) {
      return "Pause";
    }

    if (countdownStatus === CountdownStatus.PAUSED) {
      return "Resume";
    }

    return "Restart";
  }, [countdownStatus]);

  const startCountdown = () => {
    intervalRef.current = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);
  };

  const pauseCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const onClickButton = () => {
    if (countdownStatus === CountdownStatus.IDLE || countdownStatus === CountdownStatus.PAUSED) {
      setCountdownStatus(CountdownStatus.RUNNING);
      startCountdown();
      return;
    }

    if (countdownStatus === CountdownStatus.RUNNING) {
      setCountdownStatus(CountdownStatus.PAUSED);
      pauseCountdown();
      return;
    }

    setCountdownStatus(CountdownStatus.IDLE);
    setCount(DEFAULT_COUNT);
  };

  useEffect(() => {
    if (isCountValueOver) {
      setCountdownStatus(CountdownStatus.FINISHED);
      pauseCountdown();
    }
  }, [isCountValueOver]);

  useEffect(() => {
    return () => {
      pauseCountdown();
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-8 h-screen">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={onClickButton}>{buttonText}</button>
      <p className="text-2xl font-bold">Countdown: {count}</p>
    </div>
  );
}
