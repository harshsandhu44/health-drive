-- HealthDrive Seed Data
-- Test data for development and testing

-- Insert test organizations
INSERT INTO organizations (id, name, billing_status) VALUES 
('org_123', 'Test Clinic', 'active'),
('org_456', 'HealthCare Center', 'inactive');

-- Insert test users
INSERT INTO users (id, organization_id, email, role) VALUES 
('user_admin_123', 'org_123', 'admin@testclinic.com', 'admin'),
('user_staff_123', 'org_123', 'staff@testclinic.com', 'staff'),
('user_doctor_123', 'org_123', 'doctor@testclinic.com', 'doctor'),
('user_admin_456', 'org_456', 'admin@healthcare.com', 'admin');

-- Insert test departments
INSERT INTO departments (organization_id, name) VALUES 
('org_123', 'Cardiology'),
('org_123', 'Neurology'),
('org_123', 'General Medicine'),
('org_456', 'Pediatrics');

-- Insert test doctors
INSERT INTO doctors (organization_id, department_id, name, contact, specialization) VALUES 
('org_123', (SELECT id FROM departments WHERE name = 'Cardiology' AND organization_id = 'org_123'), 'Dr. John Smith', '+1-555-0101', 'Heart Surgery'),
('org_123', (SELECT id FROM departments WHERE name = 'Neurology' AND organization_id = 'org_123'), 'Dr. Sarah Johnson', '+1-555-0102', 'Brain Surgery'),
('org_123', (SELECT id FROM departments WHERE name = 'General Medicine' AND organization_id = 'org_123'), 'Dr. Michael Brown', '+1-555-0103', 'General Practice'),
('org_456', (SELECT id FROM departments WHERE name = 'Pediatrics' AND organization_id = 'org_456'), 'Dr. Emily Davis', '+1-555-0201', 'Child Care');

-- Insert test patients
INSERT INTO patients (phone_number, name, date_of_birth, blood_group) VALUES 
('1234567890', 'John Doe', '1980-01-15', 'A+'),
('2345678901', 'Jane Smith', '1975-03-22', 'B+'),
('3456789012', 'Bob Johnson', '1990-07-10', 'O+'),
('4567890123', 'Alice Brown', '1985-12-05', 'AB+'),
('5678901234', 'Charlie Wilson', '1970-09-18', 'A-');

-- Insert test appointments
INSERT INTO appointments (organization_id, doctor_id, patient_id, date, time, status) VALUES 
('org_123', (SELECT id FROM doctors WHERE name = 'Dr. John Smith'), (SELECT id FROM patients WHERE name = 'John Doe'), CURRENT_DATE, '10:00:00', 'confirmed'),
('org_123', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson'), (SELECT id FROM patients WHERE name = 'Jane Smith'), CURRENT_DATE, '11:00:00', 'pending'),
('org_123', (SELECT id FROM doctors WHERE name = 'Dr. Michael Brown'), (SELECT id FROM patients WHERE name = 'Bob Johnson'), CURRENT_DATE + 1, '09:00:00', 'confirmed'),
('org_123', (SELECT id FROM doctors WHERE name = 'Dr. John Smith'), (SELECT id FROM patients WHERE name = 'Alice Brown'), CURRENT_DATE + 1, '14:00:00', 'pending'),
('org_123', (SELECT id FROM doctors WHERE name = 'Dr. Sarah Johnson'), (SELECT id FROM patients WHERE name = 'Charlie Wilson'), CURRENT_DATE - 1, '15:30:00', 'completed');

-- Insert test patient records
INSERT INTO patient_records (patient_id, medical_history) VALUES 
((SELECT id FROM patients WHERE name = 'John Doe'), 'Hypertension diagnosed in 2020. Regular check-ups recommended.'),
((SELECT id FROM patients WHERE name = 'Jane Smith'), 'Diabetes Type 2. On medication since 2018.'),
((SELECT id FROM patients WHERE name = 'Bob Johnson'), 'No significant medical history. Routine health check.'),
((SELECT id FROM patients WHERE name = 'Alice Brown'), 'Allergic to penicillin. Previous surgery in 2019.'),
((SELECT id FROM patients WHERE name = 'Charlie Wilson'), 'Heart condition. Regular cardiology follow-ups.');

-- Insert test analytics logs
INSERT INTO analytics_logs (organization_id, metric_type, value) VALUES 
('org_123', 'total_appointments', 150),
('org_123', 'appointments_per_doctor', 50),
('org_123', 'returning_patients', 75),
('org_456', 'total_appointments', 80),
('org_456', 'appointments_per_doctor', 80),
('org_456', 'returning_patients', 40); 