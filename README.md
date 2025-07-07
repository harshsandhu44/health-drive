# Health Drive

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform streamlines appointment management, department organization, doctor management, patient communication, and subscription plan management. The MVP leverages Next.js (App Router, TypeScript), Clerk for authentication and organization metadata, Supabase for the database, Twilio for messaging (future phase), shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations. A `doctors` table tracks doctor details, including specialization, and patient associations. The `patients` table allows cross-organization access by removing `organization_id` and includes a `medical_records` JSONB field for flexible medical data storage. Billing is handled manually by admins setting plan details in Clerk, logged in Supabase.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments and doctors within facilities.
- Allow cross-organization access to patient data with secure controls.
- Facilitate appointment-related communication with patients via SMS (future phase).
- Provide subscription plans (Starter, Pro, Business) managed manually by admins.
- Deliver a secure, scalable, and user-friendly platform for healthcare administrators.

## 3. Target Audience

- Healthcare facility administrators (e.g., hospitals, clinics).
- Department heads and scheduling staff.
- Doctors and support staff interacting with the platform.

## 4. Key Features

### 4.1 Appointment Management

- **Description**: Facilities can create, update, cancel, and view patient appointments.
- **Functionality**:
  - Admins and doctors schedule appointments with a doctor (identified by UUID from `doctors` table), specifying a datetime, patient details, and optional note.
  - Patients identified by name, phone number, optional email, and optional medical records.
  - Appointment status: Pending, Confirmed, Cancelled, Completed.
  - View appointments by day, week, or month in a calendar interface.
- **Technical Requirements**:
  - Store appointments in Supabase: `id`, `patient_id` (UUID), `doctor_id` (UUID, fk to doctors.id), `appointment_datetime` (TIMESTAMP WITH TIME ZONE), `status`, `organization_id` (TEXT, Clerk org ID), `created_at`, `updated_at`, `note` (TEXT, nullable).
  - Calendar UI with shadcn/ui components and Tailwind CSS.
  - Framer Motion for smooth calendar navigation transitions.
  - Server Actions for data fetching and mutations, calling API routes.

### 4.2 Department Management

- **Description**: Facilities can organize departments to group activities.
- **Functionality**:
  - Create, update, and delete departments (e.g., Cardiology, Pediatrics).
  - View department details.
- **Technical Requirements**:
  - Supabase table: `departments` (`id`, `name`, `organization_id` (TEXT), `created_at`, `updated_at`).
  - UI with shadcn/ui for department CRUD operations.
  - Role-based access via Clerk organization memberships (`admin` for management, `member` for viewing).
  - Server Actions for CRUD operations.

### 4.3 Doctor Management

- **Description**: Manage doctors within facilities, tracking associated patients and specialization.
- **Functionality**:
  - Admins create, update, and delete doctors with name, phone number, optional address, and optional specialization.
  - Automatically track patients associated with each doctor via appointments.
  - View doctor details, including specialization, and patient lists.
- **Technical Requirements**:
  - Supabase table: `doctors` (`id` (UUID), `name` (TEXT), `phone_number` (TEXT), `address` (TEXT, nullable), `organization_id` (TEXT), `patient_ids` (UUID[], nullable), `specialization` (TEXT, nullable), `created_at`, `updated_at`).
  - UI with shadcn/ui for doctor CRUD operations.
  - Trigger to update `patient_ids` based on appointments.
  - Server Actions for CRUD operations, restricted to admins.

### 4.4 Staff Management

- **Description**: Manage staff via Clerk organization memberships.
- **Functionality**:
  - Admins invite users to the organization with roles (`admin`, `member`).
  - Staff view their schedules; admins manage all staff.
  - No Supabase table for staff; data stored in Clerk (user details, organization membership roles).
- **Technical Requirements**:
  - Clerk organization membership roles: `admin` (full access), `member` (doctors/staff with limited access).
  - Clerk API to fetch user details (name, phone) and membership roles.
  - Sync user creation with organization membership via Clerk webhooks.

### 4.5 Patient Management

- **Description**: Manage patient data accessible across organizations, including medical records.
- **Functionality**:
  - Create, update, and view patients with name, phone number, optional email, and optional medical records.
  - Medical records stored as JSONB with keys: `diagnoses`, `medications`, `allergies`, `immunizations`, `lab_results`, `visit_history`.
  - All authenticated users can view patients; admins and doctors can manage patients.
- **Technical Requirements**:
  - Supabase table: `patients` (`id` (UUID), `name` (TEXT), `email` (TEXT, nullable), `phone` (TEXT), `medical_records` (JSONB, nullable), `created_at`, `updated_at`).
  - UI with shadcn/ui for patient CRUD operations, including JSON input for medical records.
  - Server Actions for patient management, with role-based access via Clerk API.

### 4.6 Patient Messaging

- **Description**: Send appointment reminders and updates via SMS (future phase).
- **Functionality**:
  - Automated SMS for confirmations, reminders (24 hours prior), and cancellations.
  - Manual messaging by admins/doctors for custom updates.
  - Message templates (e.g., "Your appointment with Dr. [Name] on [Datetime] is confirmed.").
- **Technical Requirements**:
  - Twilio API for SMS delivery (future phase).
  - Supabase edge function to trigger Twilio on appointment CRUD.
  - Supabase table: `message_logs` (`id`, `appointment_id`, `patient_phone`, `message`, `status`, `organization_id` (TEXT), `created_at`).

### 4.7 Subscription Plan Management

- **Description**: Facilities subscribe to Starter, Pro, or Business plans, manually set by admins in Clerk organization metadata, with records logged in Supabase.
- **Functionality**:
  - **Plans**:
    - **Starter**: Up to 5 staff, 100 appointments/month, 100 SMS/month.
    - **Pro**: Up to 20 staff, 500 appointments/month, 500 SMS/month, priority support.
    - **Business**: Unlimited staff, 2000 appointments/month, 2000 SMS/month, dedicated support.
  - Admins manually update plan details (`plan`, `plan_expires_at`, `plan_status`, `transaction_id`) via an admin UI.
  - Plan limits enforced (e.g., block appointment/staff creation if limit exceeded).
  - Plan status (`active`, `inactive`, `expired`) updated based on `plan_expires_at`.
- **Technical Requirements**:
  - Clerk organization public metadata: `{ address: string, phone: string, plan: "starter" | "pro" | "business", plan_expires_at: string, plan_status: "active" | "inactive" | "expired" }`.
  - Clerk organization private metadata: `{ transaction_id: string }`.
  - Supabase table: `billing_logs` (`id`, `organization_id` (TEXT), `plan`, `amount`, `paytm_transaction_id`, `status`, `created_at`).
  - Admin UI for manual plan updates using Clerk API and Server Actions.
  - Supabase edge function to check `plan_expires_at` daily and update `plan_status` via Clerk API.
  - UI for plan selection, billing history, and plan status using shadcn/ui components.

## 5. Technical Stack

- **Frontend**: Next.js (App Router, TypeScript, src directory), shadcn/ui, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL, edge functions).
- **Authentication**: Clerk.js with organization metadata and membership roles.
- **Messaging**: Twilio for SMS (future phase).
- **Billing**: Manual plan assignment via Clerk API (Paytm deferred to future phase).
- **Hosting**: Vercel for Next.js, Supabase for database.
