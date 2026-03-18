import { motion, AnimatePresence } from 'framer-motion';
import { Patient, priorityConfig } from '@/types/patient';
import { X, Heart, Wind, Activity, Thermometer, Droplets, Battery, MapPin, Clock } from 'lucide-react';

interface PatientDetailPanelProps {
  patient: Patient | null;
  onClose: () => void;
}

const PatientDetailPanel = ({ patient, onClose }: PatientDetailPanelProps) => {
  return (
    <AnimatePresence>
      {patient && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-full max-w-md z-40 glass-surface border-r border-border overflow-y-auto"
        >
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">تفاصيل المريض</h2>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Patient Info */}
            <div className="glass-card rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${priorityConfig[patient.priority].bgClass}`} />
                <div>
                  <h3 className="font-semibold text-foreground">{patient.name}</h3>
                  <p className="text-xs text-muted-foreground">{patient.age} سنة · {patient.gender} · {patient.id}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{patient.chiefComplaint}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{patient.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />وصول: {patient.arrivalTime}</span>
                <span className="flex items-center gap-1"><Battery className="w-3 h-3" />{patient.sensorBattery}%</span>
              </div>
            </div>

            {/* Priority */}
            <div className={`rounded-lg p-3 border ${patient.priority === 1 ? 'border-critical bg-critical/5' : patient.priority === 2 ? 'border-warning bg-warning/5' : 'border-border bg-secondary'}`}>
              <p className="text-sm font-semibold">
                الأولوية {patient.priority}: {priorityConfig[patient.priority].label}
              </p>
            </div>

            {/* Vitals Detail */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">العلامات الحيوية الحالية</h4>
              <div className="grid grid-cols-2 gap-2">
                <VitalDetail icon={Heart} label="نبض القلب" value={`${patient.vitals.heartRate} bpm`} danger={patient.vitals.heartRate > 120 || patient.vitals.heartRate < 50} />
                <VitalDetail icon={Wind} label="معدل التنفس" value={`${patient.vitals.respiratoryRate} /دقيقة`} danger={patient.vitals.respiratoryRate > 24} />
                <VitalDetail icon={Activity} label="تشبع الأكسجين" value={`${patient.vitals.spO2}%`} danger={patient.vitals.spO2 < 92} />
                <VitalDetail icon={Thermometer} label="درجة الحرارة" value={`${patient.vitals.temperature}°C`} danger={patient.vitals.temperature > 38.5} />
                <VitalDetail icon={Droplets} label="ضغط الدم" value={`${patient.vitals.bloodPressureSystolic}/${patient.vitals.bloodPressureDiastolic}`} danger={patient.vitals.bloodPressureSystolic > 150 || patient.vitals.bloodPressureSystolic < 90} />
                <VitalDetail icon={Activity} label="NEWS2" value={`${patient.vitals.news2Score}`} danger={patient.vitals.news2Score >= 7} />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors">
                بدء التقييم السريري
              </button>
              {patient.priority <= 2 && (
                <button className="w-full py-2.5 rounded-lg bg-critical text-destructive-foreground font-semibold text-sm hover:bg-critical/90 transition-colors">
                  إطلاق نداء طوارئ
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const VitalDetail = ({ icon: Icon, label, value, danger }: { icon: React.ElementType; label: string; value: string; danger: boolean }) => (
  <div className={`rounded-md p-3 ${danger ? 'bg-critical/10 border border-critical/30' : 'glass-card'}`}>
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className={`w-3.5 h-3.5 ${danger ? 'text-critical' : 'text-muted-foreground'}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`font-mono-data text-lg font-bold ${danger ? 'text-critical' : 'text-foreground'}`}>{value}</p>
  </div>
);

export default PatientDetailPanel;
