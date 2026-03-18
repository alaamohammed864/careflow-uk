import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowRight, UserPlus } from 'lucide-react';

const PatientCheckIn = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: 'ذكر' as 'ذكر' | 'أنثى',
    chiefComplaint: '',
    location: 'منطقة الانتظار أ',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const patientCode = `P-${String(Date.now()).slice(-6)}`;

    const { error } = await supabase.from('patients').insert({
      patient_code: patientCode,
      name: form.name,
      age: parseInt(form.age),
      gender: form.gender,
      chief_complaint: form.chiefComplaint,
      location: form.location,
      priority: 3,
      heart_rate: 80,
      respiratory_rate: 16,
      spo2: 98,
      temperature: 36.8,
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      news2_score: 0,
      vitals_trend: 'stable',
      created_by: user.id,
    });

    if (error) {
      toast.error('فشل في تسجيل المريض: ' + error.message);
    } else {
      // Log to audit
      await supabase.from('audit_log').insert({
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        action: 'تسجيل وصول مريض',
        entity_type: 'patient',
        entity_id: patientCode,
        details: { name: form.name, complaint: form.chiefComplaint },
      });
      toast.success(`تم تسجيل المريض ${form.name} بنجاح`);
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-surface sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">تسجيل وصول مريض جديد</h1>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          العودة <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">بيانات المريض</h2>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">الاسم الكامل</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">العمر</label>
              <input
                type="number"
                required
                min={0}
                max={150}
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">الجنس</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value as 'ذكر' | 'أنثى' })}
                className="w-full px-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              >
                <option value="ذكر">ذكر</option>
                <option value="أنثى">أنثى</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">الشكوى الرئيسية</label>
            <textarea
              required
              rows={3}
              value={form.chiefComplaint}
              onChange={e => setForm({ ...form, chiefComplaint: e.target.value })}
              className="w-full px-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground mb-1">الموقع</label>
            <select
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
            >
              <option>منطقة الانتظار أ</option>
              <option>منطقة الانتظار ب</option>
              <option>غرفة الفحص 1</option>
              <option>غرفة الفحص 2</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل المريض'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default PatientCheckIn;
