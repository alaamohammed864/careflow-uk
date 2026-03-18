
-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('doctor', 'nurse', 'supervisor');

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Patients table
CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_code text NOT NULL UNIQUE,
  name text NOT NULL,
  age int NOT NULL,
  gender text NOT NULL,
  chief_complaint text NOT NULL,
  arrival_time timestamptz NOT NULL DEFAULT now(),
  priority int NOT NULL DEFAULT 3,
  heart_rate int,
  respiratory_rate int,
  spo2 int,
  temperature numeric(4,1),
  blood_pressure_systolic int,
  blood_pressure_diastolic int,
  news2_score int NOT NULL DEFAULT 0,
  vitals_trend text NOT NULL DEFAULT 'stable',
  sensor_battery int NOT NULL DEFAULT 100,
  sensor_connected boolean NOT NULL DEFAULT true,
  location text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'waiting',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Vitals history for time-series charts
CREATE TABLE public.vitals_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  heart_rate int,
  respiratory_rate int,
  spo2 int,
  temperature numeric(4,1),
  blood_pressure_systolic int,
  blood_pressure_diastolic int,
  news2_score int,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.vitals_history ENABLE ROW LEVEL SECURITY;

-- Audit log
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  user_name text,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Authenticated can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- User roles
CREATE POLICY "Authenticated can read roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Supervisors can manage roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'supervisor'));
CREATE POLICY "Supervisors can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'supervisor'));
CREATE POLICY "Supervisors can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'supervisor'));

-- Patients
CREATE POLICY "Authenticated can read patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update patients" ON public.patients FOR UPDATE TO authenticated USING (true);

-- Vitals history
CREATE POLICY "Authenticated can read vitals" ON public.vitals_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert vitals" ON public.vitals_history FOR INSERT TO authenticated WITH CHECK (true);

-- Audit log
CREATE POLICY "Authenticated can read audit log" ON public.audit_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert audit log" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vitals_history;
