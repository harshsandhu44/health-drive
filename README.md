# Health Drive

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform streamlines appointment management, department organization, patient communication, and subscription plan management. The MVP leverages Next.js with TypeScript, Clerk for authentication and organization metadata, Supabase for the database, Twilio for messaging, Paytm for billing, shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations. Organization and user data are managed in Clerk, with no Supabase tables for facilities or staff profiles.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments within facilities.
- Facilitate appointment-related communication with patients via SMS.
- Provide subscription plans (Starter, Pro, Business) managed via a custom Paytm-based billing system.
- Deliver a secure, scalable, and user-friendly platform for healthcare administrators.

## 3. Target Audience

- Healthcare facility administrators (e.g., hospitals, clinics).
- Department heads and scheduling staff.
- Doctors and support staff interacting with the platform.

## 4. Key Features

### 4.1 Appointment Management

- **Description**: Facilities can create, update, cancel, and view patient appointments.
- **Functionality**:
  - Admins and doctors schedule appointments with a doctor (identified by Clerk user ID), specifying date, time, and patient details.
  - Patients identified by name, email, and phone number.
  - Appointment status: Pending, Confirmed, Cancelled, Completed.
  - View appointments by day, week, or month in a calendar interface.
- **Technical Requirements**:
  - Store appointments in Supabase: `id`, `patient_id`, `doctor_id` (Clerk user ID), `date`, `time`, `status`, `organization_id` (Clerk organization ID), `created_at`, `updated_at`.
  - Calendar UI with shadcn/ui components and Tailwind CSS.
  - Framer Motion for smooth calendar navigation transitions.

### 4.2 Department Management

- **Description**: Facilities can organize departments to group activities.
- **Functionality**:
  - Create, update, and delete departments (e.g., Cardiology, Pediatrics).
  - View department details.
- **Technical Requirements**:
  - Supabase table: `departments` (`id`, `name`, `organization_id`, `created_at`, `updated_at`).
  - UI with shadcn/ui for department CRUD operations.
  - Role-based access via Clerk organization memberships (`admin` for management, `member` for viewing).

### 4.3 Staff Management

- **Description**: Manage doctors and staff via Clerk organization memberships.
- **Functionality**:
  - Admins invite users to the organization with roles (`admin`, `member`).
  - Doctors and staff view their schedules; admins manage all staff.
  - No Supabase table for staff; data stored in Clerk (user details, organization membership roles).
- **Technical Requirements**:
  - Clerk organization membership roles: `admin` (full access), `member` (doctors/staff with limited access).
  - Clerk API to fetch user details (name, phone) and membership roles.
  - Sync user creation with organization membership via Clerk webhooks.

### 4.4 Patient Messaging

- **Description**: Send appointment reminders and updates via SMS.
- **Functionality**:
  - Automated SMS for confirmations, reminders (24 hours prior), and cancellations.
  - Manual messaging by admins/doctors for custom updates.
  - Message templates (e.g., "Your appointment with Dr. [Name] on [Date] at [Time] is confirmed.").
- **Technical Requirements**:
  - Twilio API for SMS delivery.
  - Supabase edge function to trigger Twilio on appointment CRUD.
  - Supabase table: `message_logs` (`id`, `appointment_id`, `patient_phone`, `message`, `status`, `organization_id`, `created_at`).
