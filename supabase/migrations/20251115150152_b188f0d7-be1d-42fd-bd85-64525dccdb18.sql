-- Create admin weekly surveys table
CREATE TABLE IF NOT EXISTS public.admin_weekly_surveys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  week_start DATE NOT NULL,
  team_status TEXT,
  conflicts TEXT,
  concerns TEXT,
  workload TEXT,
  support_needed TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_weekly_surveys ENABLE ROW LEVEL SECURITY;

-- Admins can view their own surveys
CREATE POLICY "Admins can view their own surveys"
ON public.admin_weekly_surveys
FOR SELECT
USING (auth.uid() = admin_id);

-- Admins can create their own surveys
CREATE POLICY "Admins can create their own surveys"
ON public.admin_weekly_surveys
FOR INSERT
WITH CHECK (auth.uid() = admin_id);

-- Add index for performance
CREATE INDEX idx_admin_weekly_surveys_admin_week 
ON public.admin_weekly_surveys(admin_id, week_start);