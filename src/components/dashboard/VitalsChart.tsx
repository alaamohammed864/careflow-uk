import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Patient } from '@/types/patient';

interface VitalsChartProps {
  patient: Patient;
}

// Generate mock 30-minute vitals history
const generateVitalsHistory = (patient: Patient) => {
  const data = [];
  const now = new Date();
  const base = patient.vitals;

  for (let i = 30; i >= 0; i -= 5) {
    const time = new Date(now.getTime() - i * 60000);
    const drift = patient.vitalsTrend === 'deteriorating' ? (30 - i) / 30 : patient.vitalsTrend === 'improving' ? -(30 - i) / 30 : 0;
    data.push({
      time: `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`,
      heartRate: Math.round(base.heartRate + (Math.random() - 0.5) * 8 + drift * 15),
      spO2: Math.max(80, Math.min(100, Math.round(base.spO2 + (Math.random() - 0.5) * 2 - drift * 5))),
      respRate: Math.round(base.respiratoryRate + (Math.random() - 0.5) * 3 + drift * 4),
      temp: +(base.temperature + (Math.random() - 0.5) * 0.3 + drift * 0.5).toFixed(1),
    });
  }
  return data;
};

const VitalsChart = ({ patient }: VitalsChartProps) => {
  const data = useMemo(() => generateVitalsHistory(patient), [patient.id]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">اتجاه المؤشرات الحيوية — آخر 30 دقيقة</h4>

      <div className="grid grid-cols-1 gap-3">
        <ChartRow label="نبض القلب" dataKey="heartRate" color="hsl(0, 84%, 60%)" data={data} unit="bpm" />
        <ChartRow label="SpO₂" dataKey="spO2" color="hsl(210, 80%, 55%)" data={data} unit="%" domain={[85, 100]} />
        <ChartRow label="معدل التنفس" dataKey="respRate" color="hsl(38, 92%, 50%)" data={data} unit="/د" />
        <ChartRow label="الحرارة" dataKey="temp" color="hsl(162, 59%, 45%)" data={data} unit="°C" domain={[35, 41]} />
      </div>
    </div>
  );
};

const ChartRow = ({ label, dataKey, color, data, unit, domain }: {
  label: string; dataKey: string; color: string; data: unknown[]; unit: string; domain?: [number, number];
}) => (
  <div className="glass-card rounded-lg p-3">
    <p className="text-xs text-muted-foreground mb-2">{label}</p>
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 15%)" />
        <XAxis dataKey="time" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 9 }} />
        <YAxis domain={domain || ['auto', 'auto']} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 9 }} width={30} />
        <Tooltip
          contentStyle={{ background: 'hsl(222, 47%, 7%)', border: '1px solid hsl(222, 20%, 15%)', borderRadius: '6px', color: 'hsl(210, 40%, 98%)', fontSize: 11 }}
          formatter={(value: number) => [`${value} ${unit}`, label]}
        />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default VitalsChart;
