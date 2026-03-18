import { useCallback, useRef } from 'react';

export const useAudioAlert = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef(0);

  const playAlert = useCallback(() => {
    const now = Date.now();
    // Prevent playing more than once every 5 seconds
    if (now - lastPlayedRef.current < 5000) return;
    lastPlayedRef.current = now;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;

      // Create urgent two-tone alert
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Two-tone alert pattern (similar to hospital alarms)
      playTone(880, 0, 0.2);
      playTone(660, 0.25, 0.2);
      playTone(880, 0.5, 0.2);
      playTone(660, 0.75, 0.2);
    } catch {
      // Audio not available
    }
  }, []);

  return { playAlert };
};
