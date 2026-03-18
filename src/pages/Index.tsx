import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import StatsBar from '@/components/dashboard/StatsBar';
import PatientCard from '@/components/dashboard/PatientCard';
import PriorityFilter from '@/components/dashboard/PriorityFilter';
import AlertOverlay from '@/components/dashboard/AlertOverlay';
import PatientDetailPanel from '@/components/dashboard/PatientDetailPanel';
import { mockPatients } from '@/data/mockPatients';
import { Patient, PriorityLevel } from '@/types/patient';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';
import { useAudioAlert } from '@/hooks/useAudioAlert';
import { RefreshCw, UserPlus, BarChart3, Shield } from 'lucide-react';

type SortKey = 'priority' | 'spO2' | 'temperature' | 'arrivalTime' | 'news2';

const Index = () => {
  const navigate = useNavigate();
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [alertPatient, setAlertPatient] = useState<Patient | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [sortAsc, setSortAsc] = useState(true);

  const { playAlert } = useAudioAlert();

  const criticalAlerts = patients.filter(p => p.priority === 1 || (p.priority === 2 && p.vitalsTrend === 'deteriorating'));

  const handleRefresh = useCallback(() => {
    // In production, this would refetch from DB
    if (criticalAlerts.length > 0) {
      playAlert();
    }
  }, [criticalAlerts.length, playAlert]);

  const { countdown, reset } = useAutoRefresh(handleRefresh);

  const filteredPatients = useMemo(() => {
    let result = [...patients];
    if (priorityFilter !== null) {
      result = result.filter(p => p.priority === priorityFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'priority': cmp = a.priority - b.priority || b.vitals.news2Score - a.vitals.news2Score; break;
        case 'spO2': cmp = a.vitals.spO2 - b.vitals.spO2; break;
        case 'temperature': cmp = a.vitals.temperature - b.vitals.temperature; break;
        case 'news2': cmp = b.vitals.news2Score - a.vitals.news2Score; break;
        case 'arrivalTime': cmp = a.arrivalTime.localeCompare(b.arrivalTime); break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [patients, priorityFilter, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleAlertClick = () => {
    if (criticalAlerts.length > 0) {
      playAlert();
      setAlertPatient(criticalAlerts[0]);
    }
  };

  const sortButtons: { key: SortKey; label: string }[] = [
    { key: 'priority', label: 'الأولوية' },
    { key: 'spO2', label: 'SpO₂' },
    { key: 'temperature', label: 'الحرارة' },
    { key: 'news2', label: 'NEWS2' },
    { key: 'arrivalTime', label: 'وقت الوصول' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={criticalAlerts.length} onAlertClick={handleAlertClick} />

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Quick Nav */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => navigate('/check-in')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <UserPlus className="w-3.5 h-3.5" /> تسجيل مريض
          </button>
          <button onClick={() => navigate('/stats')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
            <BarChart3 className="w-3.5 h-3.5" /> الإحصائيات
          </button>
          <button onClick={() => navigate('/audit')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
            <Shield className="w-3.5 h-3.5" /> سجل التدقيق
          </button>
          <div className="mr-auto flex items-center gap-2">
            <button onClick={reset} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">تحديث:</span>
              <span className="font-mono-data text-xs text-foreground font-bold">{countdown}ث</span>
              <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(countdown / 60) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        <StatsBar patients={patients} />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base font-semibold text-foreground">
            قائمة المرضى
            <span className="text-muted-foreground font-normal text-sm mr-2">
              ({filteredPatients.length})
            </span>
          </h2>
          <PriorityFilter activeFilter={priorityFilter} onFilterChange={setPriorityFilter} />
        </div>

        {/* Sort controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">ترتيب حسب:</span>
          {sortButtons.map(sb => (
            <button
              key={sb.key}
              onClick={() => handleSort(sb.key)}
              className={`px-2 py-1 rounded text-xs transition-colors ${sortKey === sb.key ? 'bg-primary/20 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {sb.label} {sortKey === sb.key && (sortAsc ? '↑' : '↓')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={setSelectedPatient}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>

      <PatientDetailPanel patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      <AlertOverlay patient={alertPatient} onDismiss={() => setAlertPatient(null)} />
    </div>
  );
};

export default Index;
