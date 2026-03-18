import { Activity, Bell, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  alertCount: number;
  onAlertClick: () => void;
}

const Header = ({ alertCount, onAlertClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { profile, userRole, signOut } = useAuth();

  const roleLabel: Record<string, string> = {
    doctor: 'طبيب',
    nurse: 'ممرض/ة',
    supervisor: 'مشرف',
  };

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
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-foreground" />}
        </button>
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
        <button onClick={signOut} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="تسجيل الخروج">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
            {(profile?.full_name || 'م')[0]}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">{profile?.full_name || 'مستخدم'}</p>
            <p className="text-[10px] text-muted-foreground">{roleLabel[userRole || 'nurse'] || userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
