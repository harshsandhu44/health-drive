-- Fix RLS policies for webhook operations
-- Allow service role to perform webhook operations without authentication context

-- Add policy to allow service role to insert organizations (for webhooks)
CREATE POLICY service_role_org_access ON organizations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add policy to allow service role to insert users (for webhooks)  
CREATE POLICY service_role_user_access ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add service role policies for other tables that might be accessed during webhooks
CREATE POLICY service_role_dept_access ON departments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_doctor_access ON doctors
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_appt_access ON appointments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_patient_access ON patients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_record_access ON patient_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY service_role_analytics_access ON analytics_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);