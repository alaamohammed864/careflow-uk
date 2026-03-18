import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Mail, Lock, User } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message === 'Invalid login credentials' ? 'بيانات الدخول غير صحيحة' : error.message);
      } else {
        toast.success('تم تسجيل الدخول بنجاح');
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('تم إنشاء الحساب. يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">PulseStream AI</h1>
          <p className="text-sm text-muted-foreground">مركز القيادة — الفرز الذكي</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground text-center">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>

          {!isLogin && (
            <div className="relative">
              <User className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full pr-10 pl-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full pr-10 pl-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pr-10 pl-3 py-2.5 bg-secondary rounded-lg text-foreground text-sm border border-border focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : isLogin ? 'دخول' : 'إنشاء حساب'}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          ENG_ALAA MOHAMMED — PulseStream AI © 2026
        </p>
      </div>
    </div>
  );
};

export default Auth;
