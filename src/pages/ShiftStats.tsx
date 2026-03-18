import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Download, Users, Clock, AlertTriangle, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Patient } from '@/types/patient';
import { mockPatients } from '@/data/mockPatients';

const PRIORITY_COLORS = ['hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(210, 80%, 55%)', 'hsl(162, 59%, 45%)'];
const PRIORITY_LABELS = ['حرج P1', 'عاجل P2', 'متوسط P3', 'مستقر P4'];

const ShiftStats = () => {
  const navigate = useNavigate();
  const patients = mockPatients;

  const stats = useMemo(() => {
    const byPriority = [1, 2, 3, 4].map(p => ({
      name: PRIORITY_LABELS[p - 1],
      value: patients.filter(pt => pt.priority === p).length,
      color: PRIORITY_COLORS[p - 1],
    }));

    const avgWait = patients.length > 0
      ? Math.round(patients.reduce((sum, p) => {
          const [h, m] = p.arrivalTime.split(':').map(Number);
          const arrival = h * 60 + m;
          const now = new Date().getHours() * 60 + new Date().getMinutes();
          return sum + (now - arrival);
        }, 0) / patients.length)
      : 0;

    const alertsCount = patients.filter(p => p.priority === 1 || (p.priority === 2 && p.vitalsTrend === 'deteriorating')).length;

    return { byPriority, total: patients.length, avgWait, alertsCount };
  }, [patients]);

  const handleExportPDF = () => {
    const content = `
تقرير نوبة PulseStream AI
========================
التاريخ: ${new Date().toLocaleDateString('ar-IQ')}
الوقت: ${new Date().toLocaleTimeString('ar-IQ')}

إجمالي المرضى: ${stats.total}
متوسط وقت الانتظار: ${stats.avgWait} دقيقة
عدد التنبيهات الحرجة: ${stats.alertsCount}

توزيع حسب الأولوية:
${stats.byPriority.map(p => `  ${p.name}: ${p.value}`).join('\n')}

ENG_ALAA MOHAMMED — PulseStream AI © 2026
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-surface sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">إحصائيات النوبة</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleExportPDF} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
            <Download className="w-3.5 h-3.5" /> تصدير التقرير
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            العودة <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} label="إجمالي المرضى" value={stats.total} color="text-foreground" />
          <StatCard icon={Clock} label="متوسط الانتظار" value={`${stats.avgWait} د`} color="text-info" />
          <StatCard icon={AlertTriangle} label="تنبيهات حرجة" value={stats.alertsCount} color="text-critical" />
          <StatCard icon={Zap} label="أسرع استجابة" value="3 د" color="text-stable" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">توزيع المرضى حسب الأولوية</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.byPriority} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {stats.byPriority.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 47%, 7%)', border: '1px solid hsl(222, 20%, 15%)', borderRadius: '8px', color: 'hsl(210, 40%, 98%)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {stats.byPriority.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                  {p.name}: {p.value}
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">عدد المرضى حسب المستوى</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.byPriority} layout="vertical">
                <XAxis type="number" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'hsl(222, 47%, 7%)', border: '1px solid hsl(222, 20%, 15%)', borderRadius: '8px', color: 'hsl(210, 40%, 98%)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {stats.byPriority.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) => (
  <div className="glass-card rounded-lg p-4 flex items-center gap-3">
    <div className="p-2 rounded-md bg-secondary">
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
    <div>
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={`font-mono-data text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default ShiftStats;
