-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create weekly_surveys table
CREATE TABLE public.weekly_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  mood TEXT,
  wellbeing TEXT,
  health TEXT,
  productivity TEXT,
  goals TEXT,
  risks TEXT,
  voice_input TEXT,
  moodmeter_score INTEGER CHECK (moodmeter_score >= 0 AND moodmeter_score <= 100),
  ai_summary TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

-- Enable RLS
ALTER TABLE public.weekly_surveys ENABLE ROW LEVEL SECURITY;

-- RLS policies for weekly_surveys
CREATE POLICY "Users can view their own surveys"
ON public.weekly_surveys FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own surveys"
ON public.weekly_surveys FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all surveys"
ON public.weekly_surveys FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Add name field to profiles for teammate display
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Trigger to auto-assign employee role on signup
CREATE OR REPLACE FUNCTION public.handle_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'employee');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_role();