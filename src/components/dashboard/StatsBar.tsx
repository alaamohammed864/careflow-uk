import { Patient } from '@/types/patient';
import { Activity, AlertTriangle, Users, Clock } from 'lucide-react';

interface StatsBarProps {
  patients: Patient[];
}

const StatsBar = ({ patients }: StatsBarProps) => {
  const critical = patients.filter(p => p.priority === 1).length;
  const urgent = patients.filter(p => p.priority === 2).length;
  const deteriorating = patients.filter(p => p.vitalsTrend === 'deteriorating').length;

  const stats = [
    { label: 'إجمالي المرضى', value: patients.length, icon: Users, color: 'text-foreground' },
    { label: 'حالات حرجة', value: critical, icon: AlertTriangle, color: 'text-critical', pulse: critical > 0 },
    { label: 'حالات عاجلة', value: urgent, icon: Activity, color: 'text-warning' },
    { label: 'تدهور مُكتشف', value: deteriorating, icon: Clock, color: 'text-critical' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-lg p-4 flex items-center gap-3">
          <div className={`p-2 rounded-md bg-secondary ${stat.pulse ? 'animate-pulse-critical' : ''}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{stat.label}</p>
            <p className={`font-mono-data text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
