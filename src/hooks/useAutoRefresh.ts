import { useState, useEffect, useCallback } from 'react';

const REFRESH_INTERVAL = 60; // seconds

export const useAutoRefresh = (onRefresh: () => void) => {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const reset = useCallback(() => {
    setCountdown(REFRESH_INTERVAL);
    onRefresh();
  }, [onRefresh]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRefresh();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onRefresh]);

  return { countdown, reset };
};
