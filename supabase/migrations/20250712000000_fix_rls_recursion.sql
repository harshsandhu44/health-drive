-- Fix infinite recursion in RLS policies
-- This migration fixes the circular dependency in the users table RLS policy

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS org_access ON organizations;
DROP POLICY IF EXISTS user_access ON users;
DROP POLICY IF EXISTS dept_access ON departments;
DROP POLICY IF EXISTS doctor_access ON doctors;
DROP POLICY IF EXISTS patient_access ON patients;
DROP POLICY IF EXISTS appt_access ON appointments;
DROP POLICY IF EXISTS record_access ON patient_records;
DROP POLICY IF EXISTS analytics_access ON analytics_logs;

-- Create a security definer function to get user's organization_id
-- This function bypasses RLS to avoid infinite recursion
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()::text LIMIT 1;
$$;

-- Users: Allow users to see their own record and users in the same organization
CREATE POLICY user_self_access ON users
  FOR ALL
  USING (id = auth.uid()::text)
  WITH CHECK (id = auth.uid()::text);

-- Users: Allow organization members to see each other (for non-self operations)
CREATE POLICY user_org_access ON users
  FOR SELECT
  USING (organization_id = get_user_organization_id());

-- Organizations: Only users in the organization can view/edit
CREATE POLICY org_access ON organizations
  FOR ALL
  USING (id = get_user_organization_id())
  WITH CHECK (id = get_user_organization_id());

-- Departments: Organization-specific access
CREATE POLICY dept_access ON departments
  FOR ALL
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

-- Doctors: Organization-specific access
CREATE POLICY doctor_access ON doctors
  FOR ALL
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

-- Appointments: Organization-specific access
CREATE POLICY appt_access ON appointments
  FOR ALL
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());

-- Patients: Only accessible via appointments linked to user's organization
CREATE POLICY patient_access ON patients
  FOR ALL
  USING (
    id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = get_user_organization_id()
    )
  )
  WITH CHECK (
    id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = get_user_organization_id()
    )
  );

-- Patient_Records: Only accessible via patient_id linked to organization's appointments
CREATE POLICY record_access ON patient_records
  FOR ALL
  USING (
    patient_id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = get_user_organization_id()
    )
  )
  WITH CHECK (
    patient_id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = get_user_organization_id()
    )
  );

-- Analytics_Logs: Organization-specific access
CREATE POLICY analytics_access ON analytics_logs
  FOR ALL
  USING (organization_id = get_user_organization_id())
  WITH CHECK (organization_id = get_user_organization_id());