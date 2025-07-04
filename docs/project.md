# Product Requirements Document (PRD) for Healthcare SaaS MVP

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform streamlines appointment management, department and staff organization, patient communication, and subscription plan management. The MVP leverages Next.js with TypeScript, Clerk for authentication and organization metadata, Supabase for the database, Twilio for messaging, Paytm for billing, shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments and staff (doctors and non-departmental staff) within the facility.
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
  - Admins/staff schedule appointments with a doctor, specifying date, time, and patient details.
  - Patients identified by name, email, and phone number.
  - Appointment status: Pending, Confirmed, Cancelled, Completed.
  - View appointments by day, week, or month in a calendar interface.
- **Technical Requirements**:
  - Store appointments in Supabase: `id`, `patient_id`, `doctor_id`, `date`, `time`, `status`, `created_at`, `updated_at`.
  - Calendar UI with shadcn/ui components and Tailwind CSS.
  - Framer Motion for smooth calendar navigation transitions.

### 4.2 Department Management

- **Description**: Facilities can organize departments to group doctors and staff.
- **Functionality**:
  - Create, update, and delete departments (e.g., Cardiology, Pediatrics).
  - Assign doctors and staff to departments.
  - View department details, including assigned personnel.
- **Technical Requirements**:
  - Supabase table: `departments` (`id`, `name`, `facility_id`, `created_at`, `updated_at`).
  - Junction table: `department_assignments` (`department_id`, `user_id`, `role`).
  - UI with shadcn/ui for department CRUD operations.

### 4.3 Staff Management

- **Description**: Manage doctors and staff, with or without department affiliation.
- **Functionality**:
  - Add/edit staff profiles: name, email, phone, role (doctor/staff), department (optional).
  - Role-based access: Admins manage all staff; doctors/staff view schedules.
  - Staff data stored in Supabase, linked to Clerk user IDs.
- **Technical Requirements**:
  - Supabase table: `staff_profiles` (`id`, `user_id` (Clerk ID), `name`, `phone`, `role` (admin/doctor/staff), `facility_id`, `department_id` (nullable), `created_at`, `updated_at`).
  - Sync Clerk user creation with Supabase via webhook to populate `staff_profiles`.
  - Role-based access enforced via Supabase RLS and Clerk authentication.

### 4.4 Patient Messaging

- **Description**: Send appointment reminders and updates via SMS.
- **Functionality**:
  - Automated SMS for confirmations, reminders (24 hours prior), and cancellations.
  - Manual messaging by admins/staff for custom updates.
  - Message templates (e.g., "Your appointment with Dr. [Name] on [Date] at [Time] is confirmed.").
- **Technical Requirements**:
  - Twilio API for SMS delivery.
  - Supabase edge function to trigger Twilio on appointment CRUD.
  - Supabase table: `message_logs` (`id`, `appointment_id`, `patient_phone`, `message`, `status`, `sent_at`).

### 4.5 Subscription Plan Management

- **Description**: Facilities subscribe to Starter, Pro, or Business plans, stored in Clerk organization metadata, with billing via Paytm.
- **Functionality**:
  - **Plans**:
    - **Starter**: Up to 5 staff, 100 appointments/month, 100 SMS/month.
    - **Pro**: Up to 20 staff, 500 appointments/month, 500 SMS/month, priority support.
    - **Business**: Unlimited staff, 2000 appointments/month, 2000 SMS/month, dedicated support.
  - Admins select/change plans via a billing dashboard.
  - Plan limits enforced (e.g., block appointment/staff creation if limit exceeded).
  - Plan status (`active`, `inactive`, `expired`) updated based on `plan_expires_at`.
  - Paytm for monthly subscription payments with auto-renewal.
- **Technical Requirements**:
  - Clerk organization public metadata: `{ address: string, phone: string, plan: "starter" | "pro" | "business", plan_expires_at: Date, plan_status: "active" | "inactive" | "expired" }`.
  - Clerk organization private metadata: `{ transaction_id: string }`.
  - Supabase table: `billing_logs` (`id`, `facility_id`, `plan`, `amount`, `paytm_transaction_id`, `status`, `created_at`).
  - Paytm Payment Gateway integration in Next.js API routes for payment initiation and webhook for transaction verification.
  - Cron job or Supabase edge function to check `plan_expires_at` daily and update `plan_status` to `expired` if past due.
  - UI for plan selection, billing history, and plan status using shadcn/ui components.

## 5. Technical Stack

- **Frontend**: Next.js (App Router, TypeScript, src directory), shadcn/ui, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL, edge functions).
- **Authentication**: Clerk.js with organization metadata.
- **Messaging**: Twilio for SMS.
- **Billing**: Paytm Payment Gateway for subscriptions.
- **Hosting**: Vercel for Next.js, Supabase for database.

## 6. Data Model

### Supabase Tables

- **facilities**: `id`, `name`, `address`, `phone`, `created_at`, `updated_at`.
- **departments**: `id`, `name`, `facility_id`, `created_at`, `updated_at`.
- **staff_profiles**: `id`, `user_id` (Clerk ID), `name`, `phone`, `role` (admin/doctor/staff), `facility_id`, `department_id` (nullable), `created_at`, `updated_at`.
- **patients**: `id`, `name`, `email`, `phone`, `created_at`, `updated_at`.
- **appointments**: `id`, `patient_id`, `doctor_id`, `date`, `time`, `status`, `created_at`, `updated_at`.
- **message_logs**: `id`, `appointment_id`, `patient_phone`, `message`, `status`, `sent_at`.
- **billing_logs**: `id`, `facility_id`, `plan`, `amount`, `paytm_transaction_id`, `status`, `created_at`.

### Clerk Metadata

- **User Metadata**: None (removed).
- **Organization Public Metadata**:
  ```typescript
  interface OrganizationPublicMetadata {
    address: string;
    phone: string;
    plan: "starter" | "pro" | "business";
    plan_expires_at: Date;
    plan_status: "active" | "inactive" | "expired";
  }
  ```
- **Organization Private Metadata**:
  ```typescript
  interface OrganizationPrivateMetadata {
    transaction_id: string;
  }
  ```

## 7. User Interface

- **Dashboard**: Overview of appointments, department stats, staff availability, and plan status (with `plan_expires_at` and `plan_status`).
- **Appointments Page**: Calendar view, scheduling form, appointment list.
- **Departments Page**: Department CRUD and staff assignments.
- **Staff Page**: Staff directory with role filters and profile management.
- **Messaging Page**: Message logs and manual messaging.
- **Billing Page**: Plan selection, current plan details (including `plan_expires_at` and `plan_status`), billing history, and Paytm payment initiation.
- **UI Components**: shadcn/ui for forms, tables, modals; Tailwind CSS for styling; Framer Motion for animations.

## 8. Non-Functional Requirements

- **Security**:
  - Clerk for authentication and role-based access control.
  - Supabase Row-Level Security (RLS) by `facility_id` and user role.
  - Secure Paytm API credentials with environment variables.
  - Restrict access to `OrganizationPrivateMetadata` (`transaction_id`) to authorized API calls.
- **Performance**:
  - Optimize Next.js with SSG/SSR.
  - Supabase queries with indexes.
  - Paytm webhook for real-time transaction updates.
- **Scalability**:
  - Supabase for database scalability.
  - Twilio and Paytm for reliable messaging and billing.
- **Accessibility**:
  - WCAG 2.1 compliance.
  - Keyboard-navigable shadcn/ui components.

## 9. Integration Details

- **Clerk-Supabase**:
  - Sync organization data with Supabase via webhooks.
  - Store `OrganizationPublicMetadata` in Clerk; sync `address`, `phone`, `plan`, `plan_expires_at`, `plan_status` to Supabase `facilities` table.
  - Securely manage `OrganizationPrivateMetadata` (`transaction_id`) for billing verification.
  - Use Clerk user IDs to link with Supabase `staff_profiles` for role and facility data.
- **Twilio**:
  - Twilio SDK in Next.js API routes or Supabase edge functions.
  - Secure credentials in environment variables.
- **Paytm**:
  - Paytm Payment Gateway for subscription payments.
  - API routes for payment initiation and webhook to update `transaction_id` in `OrganizationPrivateMetadata` and log in `billing_logs`.
  - Update `plan_expires_at` and `plan_status` on successful payment.
- **shadcn/ui & Tailwind**:
  - shadcn/ui for consistent design.
  - Tailwind config with healthcare-themed colors.

## 10. Development Plan

### Phase 1: Setup and Authentication (2 weeks)

- Set up Next.js with TypeScript, Tailwind CSS, shadcn/ui.
- Integrate Clerk for organization authentication with metadata interfaces.
- Configure Supabase with schema and RLS.
- Build login/signup with organization plan selection.

### Phase 2: Core Features (4 weeks)

- Implement appointment, department, and staff management.
- Set up Supabase edge functions for appointment triggers.

### Phase 3: Messaging and Billing (3 weeks)

- Integrate Twilio for SMS.
- Implement Paytm billing with plan selection, transaction logging, and metadata updates (`plan_expires_at`, `plan_status`, `transaction_id`).
- Add Framer Motion animations.

### Phase 4: Testing and Launch (2 weeks)

- Test Clerk, Supabase, Twilio, and Paytm integrations.
- Verify metadata sync and plan enforcement.
- Conduct user acceptance testing.
- Deploy to Vercel and Supabase.
- Monitor usage and feedback.

## 11. Success Metrics

- **User Adoption**: 10 facilities onboarded within 3 months.
- **Engagement**: 80% of facilities scheduling 50+ appointments/month.
- **Billing Success**: 90% successful Paytm transactions.
- **Reliability**: 99% uptime for messaging and billing.
- **User Satisfaction**: CSAT score of 4/5.

## 12. Risks and Mitigations

- **Risk**: Clerk-Supabase sync complexity.
  - **Mitigation**: Follow Clerk’s integration guide and test webhooks.
- **Risk**: Paytm transaction failures.
  - **Mitigation**: Implement retry logic and monitor Paytm webhook status.
- **Risk**: Plan expiration logic errors.
  - **Mitigation**: Test `plan_expires_at` and `plan_status` updates thoroughly.
- **Risk**: UI/UX complexity.
  - **Mitigation**: Use shadcn/ui and conduct usability testing.

## 13. Future Enhancements

- Patient self-scheduling portal.
- EHR integrations (e.g., Epic, Cerner).
- Advanced analytics.
- Multi-language support.

## 14. References

- [Clerk-Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Metadata Setup](https://clerk.com/docs/users/metadata)
- Paytm Payment Gateway, Supabase, Twilio, shadcn/ui, Framer Motion documentation.
