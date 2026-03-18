import { Activity, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  alertCount: number;
  onAlertClick: () => void;
}

const Header = ({ alertCount, onAlertClick }: HeaderProps) => {
  return (
    <header className="glass-surface sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            PulseStream AI
          </h1>
          <p className="text-xs text-muted-foreground">مركز القيادة — الفرز الذكي</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onAlertClick}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Bell className="w-5 h-5 text-foreground" />
          {alertCount > 0 && (
            <span className="absolute -top-1 -left-1 w-5 h-5 bg-critical text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-vital-beat">
              {alertCount}
            </span>
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          ع
        </div>
      </div>
    </header>
  );
};

export default Header;
