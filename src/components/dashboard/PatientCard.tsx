import { motion } from 'framer-motion';
import { Patient, priorityConfig } from '@/types/patient';
import { Heart, Wind, Thermometer, Activity, Battery, TrendingDown, TrendingUp, Minus, Wifi } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onClick: (patient: Patient) => void;
}

const trendIcon = (trend: Patient['vitalsTrend']) => {
  switch (trend) {
    case 'deteriorating': return <TrendingDown className="w-4 h-4 text-critical" />;
    case 'improving': return <TrendingUp className="w-4 h-4 text-stable" />;
    default: return <Minus className="w-4 h-4 text-muted-foreground" />;
  }
};

const trendLabel = (trend: Patient['vitalsTrend']) => {
  switch (trend) {
    case 'deteriorating': return 'تدهور';
    case 'improving': return 'تحسن';
    default: return 'مستقر';
  }
};

const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const config = priorityConfig[patient.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={() => onClick(patient)}
      className={`glass-card rounded-lg p-4 cursor-pointer hover:border-foreground/15 transition-all ${config.pulseClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${config.bgClass} ${patient.priority <= 2 ? 'animate-vital-beat' : ''}`} />
          <div>
            <h3 className="font-semibold text-foreground">{patient.name}</h3>
            <p className="text-xs text-muted-foreground">
              {patient.age} سنة · {patient.gender} · {patient.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {patient.sensorBattery < 50 && (
            <span className="flex items-center gap-1 text-warning">
              <Battery className="w-3 h-3" />
              {patient.sensorBattery}%
            </span>
          )}
          <Wifi className={`w-3 h-3 ${patient.sensorConnected ? 'text-stable' : 'text-critical'}`} />
        </div>
      </div>

      {/* Complaint & Location */}
      <p className="text-sm text-muted-foreground mb-3">{patient.chiefComplaint}</p>

      {/* Vitals Grid */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <VitalItem icon={Heart} label="نبض" value={`${patient.vitals.heartRate}`} unit="bpm" danger={patient.vitals.heartRate > 120 || patient.vitals.heartRate < 50} />
        <VitalItem icon={Wind} label="تنفس" value={`${patient.vitals.respiratoryRate}`} unit="/د" danger={patient.vitals.respiratoryRate > 24} />
        <VitalItem icon={Activity} label="SpO2" value={`${patient.vitals.spO2}`} unit="%" danger={patient.vitals.spO2 < 92} />
        <VitalItem icon={Thermometer} label="حرارة" value={`${patient.vitals.temperature}`} unit="°C" danger={patient.vitals.temperature > 38.5} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {trendIcon(patient.vitalsTrend)}
          <span className="text-muted-foreground">{trendLabel(patient.vitalsTrend)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-mono-data font-bold text-sm ${patient.vitals.news2Score >= 7 ? 'text-critical' : patient.vitals.news2Score >= 5 ? 'text-warning' : 'text-stable'}`}>
            NEWS2: {patient.vitals.news2Score}
          </span>
          <span className="text-muted-foreground">وصول: {patient.arrivalTime}</span>
        </div>
      </div>
    </motion.div>
  );
};

interface VitalItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  danger: boolean;
}

const VitalItem = ({ icon: Icon, label, value, unit, danger }: VitalItemProps) => (
  <div className={`rounded-md p-2 text-center ${danger ? 'bg-critical/10' : 'bg-secondary'}`}>
    <Icon className={`w-3 h-3 mx-auto mb-1 ${danger ? 'text-critical animate-vital-beat' : 'text-muted-foreground'}`} />
    <p className={`font-mono-data text-sm font-bold ${danger ? 'text-critical' : 'text-foreground'}`}>
      {value}<span className="text-[10px] text-muted-foreground">{unit}</span>
    </p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </div>
);

export default PatientCard;
