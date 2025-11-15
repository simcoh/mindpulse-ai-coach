-- Update admin_weekly_surveys table to match new question structure
ALTER TABLE admin_weekly_surveys 
  DROP COLUMN IF EXISTS conflicts,
  DROP COLUMN IF EXISTS concerns,
  DROP COLUMN IF EXISTS workload,
  DROP COLUMN IF EXISTS support_needed;

ALTER TABLE admin_weekly_surveys
  ADD COLUMN IF NOT EXISTS survey_feedback text,
  ADD COLUMN IF NOT EXISTS behavior_concerns text,
  ADD COLUMN IF NOT EXISTS problem_report text,
  ADD COLUMN IF NOT EXISTS help_needed text;