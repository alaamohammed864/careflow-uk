import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/dashboard/Header';
import StatsBar from '@/components/dashboard/StatsBar';
import PatientCard from '@/components/dashboard/PatientCard';
import PriorityFilter from '@/components/dashboard/PriorityFilter';
import AlertOverlay from '@/components/dashboard/AlertOverlay';
import PatientDetailPanel from '@/components/dashboard/PatientDetailPanel';
import { mockPatients } from '@/data/mockPatients';
import { Patient, PriorityLevel } from '@/types/patient';

const Index = () => {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [alertPatient, setAlertPatient] = useState<Patient | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | null>(null);

  const criticalAlerts = patients.filter(p => p.priority === 1 || (p.priority === 2 && p.vitalsTrend === 'deteriorating'));

  const filteredPatients = useMemo(() => {
    let result = [...patients];
    if (priorityFilter !== null) {
      result = result.filter(p => p.priority === priorityFilter);
    }
    // Sort by priority (1 first) then by NEWS2 score descending
    result.sort((a, b) => a.priority - b.priority || b.vitals.news2Score - a.vitals.news2Score);
    return result;
  }, [patients, priorityFilter]);

  const handleAlertClick = () => {
    if (criticalAlerts.length > 0) {
      setAlertPatient(criticalAlerts[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={criticalAlerts.length} onAlertClick={handleAlertClick} />

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <StatsBar patients={patients} />

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            قائمة المرضى
            <span className="text-muted-foreground font-normal text-sm mr-2">
              ({filteredPatients.length})
            </span>
          </h2>
          <PriorityFilter activeFilter={priorityFilter} onFilterChange={setPriorityFilter} />
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
