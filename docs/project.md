# Product Requirements Document (PRD) for Healthcare SaaS MVP

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
  - Clerk organization public metadata: `{ address: string, phone: string, plan: "starter" | "pro" | "business", plan_expires_at: string, plan_status: "active" | "inactive" | "expired" }`.
  - Clerk organization private metadata: `{ transaction_id: string }`.
  - Supabase table: `billing_logs` (`id`, `organization_id`, `plan`, `amount`, `paytm_transaction_id`, `status`, `created_at`).
  - Paytm Payment Gateway integration in Next.js API routes for payment initiation and webhook for transaction verification.
  - Supabase edge function to check `plan_expires_at` daily and update `plan_status` via Clerk API.
  - UI for plan selection, billing history, and plan status using shadcn/ui components.

## 5. Technical Stack

- **Frontend**: Next.js (App Router, TypeScript, src directory), shadcn/ui, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL, edge functions).
- **Authentication**: Clerk.js with organization metadata and membership roles.
- **Messaging**: Twilio for SMS.
- **Billing**: Paytm Payment Gateway for subscriptions.
- **Hosting**: Vercel for Next.js, Supabase for database.

## 6. Data Model

### Supabase Tables

- **departments**: `id` (UUID), `name` (TEXT), `organization_id` (UUID, Clerk org ID), `created_at`, `updated_at`.
- **patients**: `id` (UUID), `name` (TEXT), `email` (TEXT), `phone` (TEXT), `organization_id` (UUID), `created_at`, `updated_at`.
- **appointments**: `id` (UUID), `patient_id` (UUID), `doctor_id` (TEXT, Clerk user ID), `date` (DATE), `time` (TIME), `status` (TEXT), `organization_id` (UUID), `created_at`, `updated_at`.
- **message_logs**: `id` (UUID), `appointment_id` (UUID), `patient_phone` (TEXT), `message` (TEXT), `status` (TEXT), `organization_id` (UUID), `created_at`.
- **billing_logs**: `id` (UUID), `organization_id` (UUID), `plan` (TEXT), `amount` (NUMERIC), `paytm_transaction_id` (TEXT), `status` (TEXT), `created_at`.

### Clerk Metadata

- **User Metadata**: None.
- **Organization Public Metadata**:
  ```typescript
  interface OrganizationPublicMetadata {
    address: string;
    phone: string;
    plan: "starter" | "pro" | "business";
    plan_expires_at: string;
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

- **Dashboard**: Overview of appointments, department stats, plan status (`plan_expires_at`, `plan_status`), and staff (via Clerk API).
- **Appointments Page**: Calendar view, scheduling form, appointment list.
- **Departments Page**: Department CRUD operations.
- **Staff Page**: Directory of organization members (via Clerk API) with role filters.
- **Messaging Page**: Message logs and manual messaging interface.
- **Billing Page**: Plan selection, current plan details, billing history, Paytm payment initiation.
- **UI Components**: shadcn/ui for forms, tables, modals; Tailwind CSS for styling; Framer Motion for animations.

## 8. Non-Functional Requirements

- **Security**:
  - Clerk for authentication and role-based access via organization memberships.
  - Supabase Row-Level Security (RLS) using Clerk JWT (`auth.jwt()->>'sub'`) and organization ID.
  - Secure Paytm API credentials with environment variables.
  - Restrict `OrganizationPrivateMetadata` (`transaction_id`) to server-side access.
- **Performance**:
  - Optimize Next.js with SSG/SSR.
  - Supabase queries with indexes on `organization_id`.
  - Paytm webhook for real-time transaction updates.
- **Scalability**:
  - Supabase for database scalability.
  - Twilio and Paytm for reliable messaging and billing.
- **Accessibility**:
  - WCAG 2.1 compliance.
  - Keyboard-navigable shadcn/ui components.

## 9. Integration Details

- **Clerk-Supabase**:
  - Sync organization data via Clerk webhooks to update `billing_logs`.
  - Use Clerk REST API to fetch organization membership roles (`admin`, `member`) for access control.
  - Store organization data (`address`, `phone`, `plan`, etc.) in Clerk metadata.
- **Twilio**:
  - Twilio SDK in Next.js API routes or Supabase edge functions.
  - Secure credentials in environment variables.
- **Paytm**:
  - Paytm Payment Gateway for subscription payments.
  - API routes for payment initiation and webhook to update `billing_logs` and Clerk metadata (`transaction_id`, `plan_expires_at`, `plan_status`).
- **shadcn/ui & Tailwind**:
  - shadcn/ui for consistent design.
  - Tailwind config with healthcare-themed colors.

## 10. Development Plan

### Phase 1: Setup and Authentication (2 weeks)

- Set up Next.js with TypeScript, Tailwind CSS, shadcn/ui.
- Integrate Clerk for organization authentication and membership roles.
- Configure Supabase with schema, RLS, and `@supabase/ssr`.
- Build login/signup with organization membership flows.
- Set up Clerk webhooks for organization and user events.

### Phase 2: Core Features (4 weeks)

- Implement appointment and department management.
- Set up Supabase edge functions for appointment triggers and plan status checks.

### Phase 3: Messaging and Billing (3 weeks)

- Integrate Twilio for SMS.
- Implement Paytm billing with plan selection and transaction logging.
- Add Framer Motion animations.

### Phase 4: Testing and Launch (2 weeks)

- Test Clerk, Supabase, Twilio, and Paytm integrations.
- Verify RLS and role-based access via Clerk API.
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
  - **Mitigation**: Use Clerk webhooks and test thoroughly.
- **Risk**: Paytm transaction failures.
  - **Mitigation**: Implement retry logic and monitor webhook status.
- **Risk**: Role-based access without user metadata.
  - **Mitigation**: Use Clerk API to fetch membership roles; implement role-checking endpoint.
- **Risk**: UI/UX complexity.
  - **Mitigation**: Use shadcn/ui and conduct usability testing.

## 13. Future Enhancements

- Patient self-scheduling portal.
- EHR integrations (e.g., Epic, Cerner).
- Advanced analytics.
- Multi-language support.

## 14. References

- [Clerk-Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Webhooks](https://clerk.com/docs/integrations/webhooks)
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- Paytm Payment Gateway, Twilio, shadcn/ui, Framer Motion documentation.
