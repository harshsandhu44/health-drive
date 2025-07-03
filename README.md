# Health Drive

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform aims to streamline appointment management, department and staff organization, and patient communication. The MVP will leverage Next.js with TypeScript, Clerk for authentication, Supabase for the database, Twilio for messaging, shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments and staff (doctors and non-departmental staff) within the facility.
- Facilitate appointment-related communication with patients via SMS using Twilio.
- Deliver a secure, scalable, and user-friendly platform for healthcare administrators.

## 3. Target Audience

- Healthcare facility administrators (e.g., hospitals, clinics).
- Department heads and scheduling staff.
- Doctors and support staff interacting with the platform.

## 4. Key Features

### 4.1 Appointment Management

- **Description**: Facilities can create, update, cancel, and view patient appointments.
- **Functionality**:
  - Admins/staff can schedule appointments with a doctor, specifying date, time, and patient details.
  - Patients are identified by name, email, and phone number.
  - Appointment status: Pending, Confirmed, Cancelled, Completed.
  - View appointments by day, week, or month in a calendar interface.
- **Technical Requirements**:
  - Store appointments in Supabase with fields: `id`, `patient_id`, `doctor_id`, `date`, `time`, `status`, `created_at`, `updated_at`.
  - Calendar UI built with shadcn/ui components and Tailwind CSS.
  - Framer Motion for smooth transitions in calendar navigation.

### 4.2 Department Management

- **Description**: Facilities can organize departments to group doctors and staff.
- **Functionality**:
  - Create, update, and delete departments (e.g., Cardiology, Pediatrics).
  - Assign doctors and staff to departments.
  - View department details, including assigned personnel.
- **Technical Requirements**:
  - Supabase table for departments: `id`, `name`, `facility_id`, `created_at`, `updated_at`.
  - Junction table for department assignments: `department_id`, `user_id`, `role` (doctor/staff).
  - UI with shadcn/ui for department CRUD operations.

### 4.3 Staff Management

- **Description**: Manage doctors and staff, with or without department affiliation.
- **Functionality**:
  - Add/edit staff profiles with details: name, email, phone, role (doctor/staff), department (optional).
  - Role-based access: Admins manage all staff; doctors/staff view their schedules.
  - Staff metadata stored in Clerk for role and facility affiliation.
- **Technical Requirements**:
  - Clerk metadata for user roles (`admin`, `doctor`, `staff`) and `facility_id`.
  - Supabase table for staff profiles: `id`, `user_id` (Clerk ID), `name`, `phone`, `department_id` (nullable).
  - Sync Clerk user creation with Supabase profile via webhook (per Clerk-Supabase integration guide).

### 4.4 Patient Messaging

- **Description**: Send appointment reminders and updates to patients via SMS.
- **Functionality**:
  - Automated SMS for appointment confirmation, reminders (24 hours prior), and cancellations.
  - Manual message sending by admins/staff for custom updates.
  - Message templates for consistency (e.g., "Your appointment with Dr. [Name] on [Date] at [Time] is confirmed.").
- **Technical Requirements**:
  - Twilio API integration for SMS delivery.
  - Supabase edge function to trigger Twilio API calls on appointment CRUD operations.
  - Store message logs in Supabase: `id`, `appointment_id`, `patient_phone`, `message`, `status`, `sent_at`.

## 5. Technical Stack

- **Frontend**: Next.js (App Router, TypeScript, src directory), shadcn/ui, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL, edge functions).
- **Authentication**: Clerk.js with metadata for roles and facility affiliation.
- **Messaging**: Twilio for SMS.
- **Hosting**: Vercel for Next.js deployment, Supabase for database.

## 6. Data Model

### Supabase Tables

- **facilities**: `id`, `name`, `address`, `created_at`, `updated_at`.
- **departments**: `id`, `name`, `facility_id`, `created_at`, `updated_at`.
- **staff_profiles**: `id`, `user_id` (Clerk ID), `name`, `phone`, `department_id` (nullable), `created_at`, `updated_at`.
- **patients**: `id`, `name`, `email`, `phone`, `created_at`, `updated_at`.
- **appointments**: `id`, `patient_id`, `doctor_id`, `date`, `time`, `status`, `created_at`, `updated_at`.
- **message_logs**: `id`, `appointment_id`, `patient_phone`, `message`, `status`, `sent_at`.

### Clerk Metadata

- **User Metadata**: `role` (admin/doctor/staff), `facility_id`.

## 7. User Interface

- **Dashboard**: Overview of upcoming appointments, department stats, and staff availability.
- **Appointments Page**: Calendar view, form for scheduling, and list of appointments.
- **Departments Page**: List of departments with CRUD functionality and staff assignments.
- **Staff Page**: Staff directory with role filters and profile management.
- **Messaging Page**: View message logs and send manual messages.
- **UI Components**: shadcn/ui for forms, tables, modals; Tailwind CSS for styling; Framer Motion for animations (e.g., page transitions, modal pop-ups).

## 8. Non-Functional Requirements

- **Security**:
  - Clerk for secure authentication and role-based access control.
  - Supabase Row-Level Security (RLS) to restrict data access by `facility_id` and user role.
- **Performance**:
  - Optimize Next.js for fast page loads with SSG/SSR where applicable.
  - Supabase queries optimized with indexes on frequently accessed fields.
- **Scalability**:
  - Supabase for scalable database operations.
  - Twilio for reliable messaging at scale.
- **Accessibility**:
  - Follow WCAG 2.1 guidelines for UI components.
  - Ensure shadcn/ui components are keyboard-navigable.

## 9. Integration Details

- **Clerk-Supabase**:
  - Use Clerk webhooks to sync user data with Supabase `staff_profiles` (per Clerk documentation).
  - Store `facility_id` and `role` in Clerk metadata for access control.
- **Twilio**:
  - Integrate Twilio SDK in Next.js API routes or Supabase edge functions.
  - Secure Twilio credentials using environment variables.
- **shadcn/ui & Tailwind**:
  - Use shadcn/ui components for consistent design.
  - Customize Tailwind config for healthcare-themed colors (e.g., blue, white, green).

## 10. Development Plan

### Phase 1: Setup and Authentication (2 weeks)

- Set up Next.js project with TypeScript, Tailwind CSS, and shadcn/ui.
- Integrate Clerk for authentication and metadata setup.
- Configure Supabase with initial schema and RLS policies.
- Build login/signup flows with role selection.

### Phase 2: Core Features (4 weeks)

- Implement appointment management with calendar UI.
- Build department and staff management modules.
- Set up Supabase edge functions for appointment triggers.

### Phase 3: Messaging and Polish (2 weeks)

- Integrate Twilio for SMS notifications.
- Add Framer Motion animations for UI transitions.
- Test and refine UI/UX with shadcn/ui components.

### Phase 4: Testing and Launch (2 weeks)

- Conduct unit and integration tests for Clerk, Supabase, and Twilio integrations.
- Perform user acceptance testing with sample facilities.
- Deploy to Vercel and Supabase.
- Monitor initial usage and gather feedback.

## 11. Success Metrics

- **User Adoption**: 10 healthcare facilities onboarded within 3 months post-launch.
- **Engagement**: 80% of facilities scheduling at least 50 appointments/month.
- **Reliability**: 99% uptime for messaging and appointment systems.
- **User Satisfaction**: Average CSAT score of 4/5 from facility admins.

## 12. Risks and Mitigations

- **Risk**: Complex Clerk-Supabase sync.
  - **Mitigation**: Follow Clerk’s Supabase integration guide and test webhooks thoroughly.
- **Risk**: Twilio messaging delays.
  - **Mitigation**: Monitor Twilio status and implement retry logic in edge functions.
- **Risk**: UI/UX complexity for non-technical admins.
  - **Mitigation**: Use shadcn/ui for intuitive design and conduct usability testing.

## 13. Future Enhancements

- Patient portal for self-scheduling.
- Integration with EHR systems (e.g., Epic, Cerner).
- Advanced analytics for facility performance.
- Multi-language support for diverse facilities.

## 14. References

- [Clerk-Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Clerk Metadata Setup](https://clerk.com/docs/users/metadata)
- Supabase, Twilio, shadcn/ui, and Framer Motion documentation.
