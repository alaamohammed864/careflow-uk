export type PriorityLevel = 1 | 2 | 3 | 4;

export interface Vitals {
  heartRate: number;
  respiratoryRate: number;
  spO2: number;
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  news2Score: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  chiefComplaint: string;
  arrivalTime: string;
  priority: PriorityLevel;
  vitals: Vitals;
  vitalsTrend: 'improving' | 'stable' | 'deteriorating';
  sensorBattery: number;
  sensorConnected: boolean;
  location: string;
}

export const priorityConfig: Record<PriorityLevel, { label: string; color: string; bgClass: string; pulseClass: string }> = {
  1: { label: 'حرج - تهديد فوري للحياة', color: 'critical', bgClass: 'bg-critical', pulseClass: 'animate-pulse-critical' },
  2: { label: 'عاجل - تدهور سريع', color: 'warning', bgClass: 'bg-warning', pulseClass: 'animate-pulse-warning' },
  3: { label: 'متوسط - علامات غير طبيعية', color: 'info', bgClass: 'bg-info', pulseClass: '' },
  4: { label: 'مستقر', color: 'stable', bgClass: 'bg-stable', pulseClass: '' },
};
