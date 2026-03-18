import { motion, AnimatePresence } from 'framer-motion';
import { Patient, priorityConfig } from '@/types/patient';
import { AlertTriangle, X, Phone } from 'lucide-react';

interface AlertOverlayProps {
  patient: Patient | null;
  onDismiss: () => void;
}

const AlertOverlay = ({ patient, onDismiss }: AlertOverlayProps) => {
  if (!patient) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md mx-4 rounded-xl border-2 border-critical bg-card p-6 animate-pulse-critical"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-critical" />
              <h2 className="text-lg font-bold text-critical">تنبيه أولوية ١</h2>
            </div>
            <button onClick={onDismiss} className="p-1 rounded-md hover:bg-secondary">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-foreground font-semibold text-lg">{patient.name}</p>
              <p className="text-muted-foreground text-sm">{patient.chiefComplaint}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-critical/10 rounded-md p-3 text-center">
                <p className="text-xs text-muted-foreground">نبض القلب</p>
                <p className="font-mono-data text-xl font-bold text-critical">{patient.vitals.heartRate}</p>
              </div>
              <div className="bg-critical/10 rounded-md p-3 text-center">
                <p className="text-xs text-muted-foreground">SpO2</p>
                <p className="font-mono-data text-xl font-bold text-critical">{patient.vitals.spO2}%</p>
              </div>
              <div className="bg-critical/10 rounded-md p-3 text-center">
                <p className="text-xs text-muted-foreground">NEWS2</p>
                <p className="font-mono-data text-xl font-bold text-critical">{patient.vitals.news2Score}</p>
              </div>
              <div className="bg-critical/10 rounded-md p-3 text-center">
                <p className="text-xs text-muted-foreground">الموقع</p>
                <p className="font-mono-data text-sm font-bold text-foreground">{patient.location}</p>
              </div>
            </div>

            <p className="text-sm text-warning text-balance">
              ⚠️ تم رصد تدهور سريع في العلامات الحيوية. يُطلب مراجعة فورية خلال ٥ دقائق.
            </p>

            <button className="w-full flex items-center justify-center gap-2 bg-critical text-destructive-foreground font-semibold py-3 rounded-lg hover:bg-critical/90 transition-colors">
              <Phone className="w-4 h-4" />
              إطلاق نداء طوارئ
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertOverlay;
