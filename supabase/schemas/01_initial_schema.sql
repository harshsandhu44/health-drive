-- HealthDrive Initial Database Schema
-- This file contains the complete schema for the HealthDrive B2B SaaS application
-- Tables support text IDs for Clerk integration and proper relationships

-- Organizations table - stores healthcare facilities
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name VARCHAR NOT NULL,
  billing_status VARCHAR DEFAULT 'inactive' CHECK (billing_status IN ('active', 'inactive', 'past_due')),
  created_at TIMESTAMP DEFAULT now()
);

-- Users table - stores user accounts associated with organizations
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL CHECK (role IN ('admin', 'staff', 'doctor')),
  created_at TIMESTAMP DEFAULT now()
);

-- Departments table - stores department information for each organization
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL
);

-- Doctors table - stores doctor profiles for each organization
CREATE TABLE doctors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  name VARCHAR NOT NULL,
  contact VARCHAR,
  specialization VARCHAR
);

-- Patients table - stores patient information for secure record access
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  date_of_birth DATE NOT NULL,
  blood_group VARCHAR NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
);

-- Appointments table - stores appointment details for scheduling
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  doctor_id TEXT REFERENCES doctors(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Patient Records table - stores medical history for patients
CREATE TABLE patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  medical_history TEXT,
  last_updated TIMESTAMP DEFAULT now()
);

-- Analytics Logs table - stores analytics data for reporting
CREATE TABLE analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  metric_type VARCHAR NOT NULL CHECK (metric_type IN ('total_appointments', 'appointments_per_doctor', 'returning_patients')),
  value INTEGER NOT NULL,
  timestamp TIMESTAMP DEFAULT now()
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_departments_organization_id ON departments(organization_id);
CREATE INDEX idx_doctors_organization_id ON doctors(organization_id);
CREATE INDEX idx_doctors_department_id ON doctors(department_id);
CREATE INDEX idx_patients_phone_number ON patients(phone_number);
CREATE INDEX idx_appointments_organization_id ON appointments(organization_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_patient_records_patient_id ON patient_records(patient_id);
CREATE INDEX idx_analytics_logs_organization_id ON analytics_logs(organization_id);
CREATE INDEX idx_analytics_logs_timestamp ON analytics_logs(timestamp); 