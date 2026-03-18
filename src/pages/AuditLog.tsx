import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Shield, User, Clock } from 'lucide-react';

interface AuditEntry {
  id: string;
  user_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const AuditLog = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (data) setEntries(data as AuditEntry[]);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-surface sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-bold text-foreground">سجل التدقيق</h1>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          العودة <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">لا توجد سجلات بعد</div>
        ) : (
          <div className="space-y-2">
            {entries.map(entry => (
              <div key={entry.id} className="glass-card rounded-lg p-4 flex items-start gap-3">
                <div className="p-2 rounded-md bg-secondary shrink-0">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{entry.user_name || 'مستخدم'}</span>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{entry.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {entry.entity_type} {entry.entity_id && `— ${entry.entity_id}`}
                  </p>
                  {entry.details && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {JSON.stringify(entry.details)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(entry.created_at).toLocaleString('ar-IQ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AuditLog;
