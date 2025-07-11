-- Row Level Security Policies for HealthDrive
-- These policies ensure data privacy and organization-specific access

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_logs ENABLE ROW LEVEL SECURITY;

-- Organizations: Only users in the organization can view/edit
CREATE POLICY org_access ON organizations
  FOR ALL
  USING (id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (id = (SELECT organization_id FROM users WHERE id = auth.uid()::text));

-- Users: Only users in the same organization can view/edit
CREATE POLICY user_access ON users
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text));

-- Departments: Organization-specific access
CREATE POLICY dept_access ON departments
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text));

-- Doctors: Organization-specific access
CREATE POLICY doctor_access ON doctors
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text));

-- Patients: Only accessible via appointments linked to user's organization
CREATE POLICY patient_access ON patients
  FOR ALL
  USING (
    id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text)
    )
  )
  WITH CHECK (
    id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text)
    )
  );

-- Appointments: Organization-specific access
CREATE POLICY appt_access ON appointments
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text));

-- Patient_Records: Only accessible via patient_id linked to organization's appointments
CREATE POLICY record_access ON patient_records
  FOR ALL
  USING (
    patient_id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text)
    )
  )
  WITH CHECK (
    patient_id IN (
      SELECT DISTINCT patient_id 
      FROM appointments 
      WHERE organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text)
    )
  );

-- Analytics_Logs: Organization-specific access
CREATE POLICY analytics_access ON analytics_logs
  FOR ALL
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text))
  WITH CHECK (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()::text)); 