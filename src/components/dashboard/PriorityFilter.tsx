import { PriorityLevel, priorityConfig } from '@/types/patient';

interface PriorityFilterProps {
  activeFilter: PriorityLevel | null;
  onFilterChange: (level: PriorityLevel | null) => void;
}

const PriorityFilter = ({ activeFilter, onFilterChange }: PriorityFilterProps) => {
  const levels: (PriorityLevel | null)[] = [null, 1, 2, 3, 4];
  const labels: Record<string, string> = {
    null: 'الكل',
    '1': 'حرج',
    '2': 'عاجل',
    '3': 'متوسط',
    '4': 'مستقر',
  };
  const colorClasses: Record<string, string> = {
    null: 'bg-secondary text-foreground',
    '1': 'bg-critical/20 text-critical border-critical/40',
    '2': 'bg-warning/20 text-warning border-warning/40',
    '3': 'bg-info/20 text-info border-info/40',
    '4': 'bg-stable/20 text-stable border-stable/40',
  };

  return (
    <div className="flex items-center gap-2">
      {levels.map((level) => {
        const key = String(level);
        const isActive = activeFilter === level;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(level)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
              isActive
                ? `${colorClasses[key]} border-current`
                : 'bg-secondary text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
};

export default PriorityFilter;
