# Product Requirements Document (PRD) for Healthcare SaaS MVP

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform streamlines appointment management, department organization, patient communication, and subscription plan management. The MVP leverages Next.js (App Router, TypeScript), Clerk for authentication and organization metadata, Supabase for the database, Twilio for messaging (future phase), shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations. Organization and user data are managed in Clerk, with no Supabase tables for facilities or staff profiles. Billing is handled manually by admins setting plan details in Clerk, logged in Supabase. The database schema uses `TEXT` for Clerk IDs, makes patient email optional, and includes an optional note in appointments.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments within facilities.
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
  - Admins and doctors schedule appointments with a doctor (identified by Clerk user ID), specifying a datetime, patient details, and optional note.
  - Patients identified by name, phone number, and optional email.
  - Appointment status: Pending, Confirmed, Cancelled, Completed.
  - View appointments by day, week, or month in a calendar interface.
- **Technical Requirements**:
  - Store appointments in Supabase: `id`, `patient_id` (UUID), `doctor_id` (TEXT, Clerk user ID), `appointment_datetime` (TIMESTAMP WITH TIME ZONE), `status`, `organization_id` (TEXT, Clerk org ID), `created_at`, `updated_at`, `note` (TEXT, nullable).
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

- **Description**: Send appointment reminders and updates via SMS (future phase).
- **Functionality**:
  - Automated SMS for confirmations, reminders (24 hours prior), and cancellations.
  - Manual messaging by admins/doctors for custom updates.
  - Message templates (e.g., "Your appointment with Dr. [Name] on [Datetime] is confirmed.").
- **Technical Requirements**:
  - Twilio API for SMS delivery (future phase).
  - Supabase edge function to trigger Twilio on appointment CRUD.
  - Supabase table: `message_logs` (`id`, `appointment_id`, `patient_phone`, `message`, `status`, `organization_id` (TEXT), `created_at`).

### 4.5 Subscription Plan Management

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
  - Clerk organization public metadata: `{ address: string, phone: string, plan: "starter catalogue" | "pro" | "business", plan_expires_at: string, plan_status: "active" | "inactive" | "expired" }`.
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

## 6. Data Model

### Supabase Tables

- **departments**: `id` (UUID), `name` (TEXT), `organization_id` (TEXT, Clerk org ID), `created_at`, `updated_at`.
- **patients**: `id` (UUID), `name` (TEXT), `email` (TEXT, nullable), `phone` (TEXT), `organization_id` (TEXT), `created_at`, `updated_at`.
- **appointments**: `id` (UUID), `patient_id` (UUID, fk to patients.id), `doctor_id` (TEXT, Clerk user ID), `appointment_datetime` (TIMESTAMP WITH TIME ZONE), `status` (TEXT), `organization_id` (TEXT), `created_at`, `updated_at`, `note` (TEXT, nullable).
- **message_logs**: `id` (UUID), `appointment_id` (UUID, fk to appointments.id), `patient_phone` (TEXT), `message` (TEXT), `status` (TEXT), `organization_id` (TEXT), `created_at`.
- **billing_logs**: `id` (UUID), `organization_id` (TEXT), `plan` (TEXT), `amount` (NUMERIC), `paytm_transaction_id` (TEXT), `status` (TEXT), `created_at`.

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
- **Appointments Page**: Calendar view, scheduling form (with datetime and note inputs), appointment list.
- **Departments Page**: Department CRUD operations.
- **Staff Page**: Directory of organization members (via Clerk API) with role filters.
- **Messaging Page**: Message logs and manual messaging interface (future phase).
- **Billing Page**: View current plan details, billing history; admin UI to manually update plan details (`plan`, `plan_expires_at`, `plan_status`, `transaction_id`).
- **UI Components**: shadcn/ui for forms, tables, modals; Tailwind CSS for styling; Framer Motion for animations.

## 8. Non-Functional Requirements

- **Security**:
  - Clerk for authentication and role-based access via organization memberships.
  - Supabase Row-Level Security (RLS) with validation deferred to application logic via Clerk API.
  - Restrict `OrganizationPrivateMetadata` (`transaction_id`) to server-side access.
- **Performance**:
  - Optimize Next.js with SSG/SSR and Server Actions for data fetching.
  - Supabase queries with indexes on `organization_id`.
- **Scalability**:
  - Supabase for database scalability.
  - Twilio for reliable messaging (future phase).
- **Accessibility**:
  - WCAG 2.1 compliance.
  - Keyboard-navigable shadcn/ui components.

## 9. Integration Details

- **Clerk-Supabase**:
  - Sync organization data via Clerk webhooks to update `billing_logs`.
  - Use Clerk REST API to fetch organization membership roles (`admin`, `member`) for access control.
  - Store organization data (`address`, `phone`, `plan`, etc.) in Clerk metadata.
- **Twilio**:
  - Twilio SDK in Next.js API routes or Supabase edge functions (future phase).
  - Secure credentials in environment variables.
- **Billing**:
  - Manual plan updates via Clerk API in admin UI.
  - Webhook to log plan changes in `billing_logs`.
  - Paytm integration deferred to future phase.
- **shadcn/ui & Tailwind**:
  - shadcn/ui for consistent design.
  - Tailwind config with healthcare-themed colors.

## 10. Development Plan

### Phase 1: Setup and Authentication (2 weeks)

- Set up Next.js with TypeScript, Tailwind CSS, shadcn/ui.
- Integrate Clerk for organization authentication and membership roles.
- Configure Supabase with schema, RLS, and `@supabase/ssr`.
- Build login/signup with organization membership flows.
- Set up Clerk webhooks for organization events.

### Phase 2: Core Features (4 weeks)

- Implement appointment and department management with Server Actions.
- Set up Supabase edge functions for plan status checks.

### Phase 3: Messaging and Billing (3 weeks)

- Prepare for Twilio integration (future phase).
- Implement admin UI for manual plan updates in Clerk.
- Add Framer Motion animations.

### Phase 4: Testing and Launch (2 weeks)

- Test Clerk, Supabase, and API integrations.
- Verify RLS and role-based access via Clerk API.
- Conduct user acceptance testing.
- Deploy to Vercel and Supabase.
- Monitor usage and feedback.

## 11. Success Metrics

- **User Adoption**: 10 facilities onboarded within 3 months.
- **Engagement**: 80% of facilities scheduling 50+ appointments/month.
- **Billing Accuracy**: 100% accuracy in manual plan assignments.
- **Reliability**: 99% uptime for database operations.
- **User Satisfaction**: CSAT score of 4/5.

## 12. Risks and Mitigations

- **Risk**: Clerk-Supabase sync complexity.
  - **Mitigation**: Use Clerk webhooks and test thoroughly.
- **Risk**: Manual billing errors.
  - **Mitigation**: Implement admin UI with validation and audit logs in `billing_logs`.
- **Risk**: Role-based access without user metadata.
  - **Mitigation**: Use Clerk API to fetch membership roles; implement role-checking endpoint.
- **Risk**: UI/UX complexity.
  - **Mitigation**: Use shadcn/ui and conduct usability testing.

## 13. Future Enhancements

- Integrate Paytm for online payments.
- Implement Twilio for SMS messaging.
- Patient self-scheduling portal.
- EHR integrations (e.g., Epic, Cerner).
- Advanced analytics.
- Multi-language support.

## 14. References

- [Clerk-Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Webhooks](https://clerk.com/docs/integrations/webhooks)
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- Twilio, shadcn/ui, Framer Motion documentation.
