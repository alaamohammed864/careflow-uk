import { useState, useEffect } from 'react';
import { PriorityLevel } from '@/types/patient';
import { Timer } from 'lucide-react';

// NHS target times per priority (in minutes)
const TARGET_MINUTES: Record<PriorityLevel, number> = {
  1: 0,   // Immediate
  2: 10,  // 10 minutes
  3: 60,  // 1 hour
  4: 120, // 2 hours
};

interface CountdownTimerProps {
  arrivalTime: string;
  priority: PriorityLevel;
  compact?: boolean;
}

const CountdownTimer = ({ arrivalTime, priority, compact }: CountdownTimerProps) => {
  const [remaining, setRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [percentage, setPercentage] = useState(100);

  useEffect(() => {
    const update = () => {
      const [h, m] = arrivalTime.split(':').map(Number);
      const now = new Date();
      const arrival = new Date();
      arrival.setHours(h, m, 0, 0);

      const targetMs = TARGET_MINUTES[priority] * 60 * 1000;
      const deadline = arrival.getTime() + targetMs;
      const diff = deadline - now.getTime();

      if (diff <= 0) {
        const over = Math.abs(diff);
        const overMin = Math.floor(over / 60000);
        const overSec = Math.floor((over % 60000) / 1000);
        setRemaining(`-${overMin}:${String(overSec).padStart(2, '0')}`);
        setIsOverdue(true);
        setPercentage(0);
      } else {
        const min = Math.floor(diff / 60000);
        const sec = Math.floor((diff % 60000) / 1000);
        setRemaining(`${min}:${String(sec).padStart(2, '0')}`);
        setIsOverdue(false);
        setPercentage(Math.min(100, (diff / targetMs) * 100));
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [arrivalTime, priority]);

  if (compact) {
    return (
      <span className={`font-mono-data text-xs font-bold ${isOverdue ? 'text-critical animate-vital-beat' : percentage < 30 ? 'text-warning' : 'text-stable'}`}>
        <Timer className="w-3 h-3 inline ml-1" />
        {remaining}
      </span>
    );
  }

  return (
    <div className={`rounded-md p-2 text-center ${isOverdue ? 'bg-critical/10 border border-critical/30' : 'glass-card'}`}>
      <div className="flex items-center justify-center gap-1 mb-1">
        <Timer className={`w-3.5 h-3.5 ${isOverdue ? 'text-critical' : 'text-muted-foreground'}`} />
        <span className="text-xs text-muted-foreground">الهدف الزمني</span>
      </div>
      <p className={`font-mono-data text-lg font-bold ${isOverdue ? 'text-critical animate-vital-beat' : percentage < 30 ? 'text-warning' : 'text-foreground'}`}>
        {remaining}
      </p>
      <div className="w-full h-1 bg-secondary rounded-full mt-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isOverdue ? 'bg-critical' : percentage < 30 ? 'bg-warning' : 'bg-stable'}`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
