# HealthDrive To-Do List

This to-do list tracks tasks for the HealthDrive project, organized by milestones (Week 1 and Week 2) as outlined in the project requirements.

## Week 1: Foundation and Core Features

- [ ] **PWA Setup**

  - Configure Next.js 15 for PWA with notification support.
  - Test app installation and push notifications.

- [ ] **Database Setup**

  - Initialize Supabase project.
  - Create tables: Organizations, Users, Doctors, Departments, Appointments, Patient_Records, Analytics_Logs.
  - Set up real-time subscriptions for Appointments and Analytics_Logs.

- [ ] **Authentication**

  - Integrate Clerk for user and organization authentication.
  - Configure Clerk webhook to sync organizations and users to Supabase.
  - Test authentication flow and data sync.

- [ ] **Dashboard UI**

  - Design analytics cards (Today's Appointments, Patients/Week, Doctors) using Shadcn UI and TailwindCSS.
  - Implement data table for today's appointments with sorting/filtering.
  - Ensure real-time updates using Supabase subscriptions.

- [ ] **Doctors Page**

  - Create data table for doctors listing (Name, Department, Contact).
  - Implement add/edit doctor popups with form validation.
  - Integrate with Supabase for CRUD operations.

- [ ] **Appointments Page**

  - Create data table for appointments listing (Patient, Doctor, Date, Time, Status).
  - Implement add/edit appointment popups with phone number validation.
  - Enable real-time updates for appointments.

- [ ] **Analytics Page**

  - Build analytics overview (Total Appointments, Per Doctor, Returning Patients).
  - Implement CSV and PDF export functionality.
  - Ensure real-time analytics updates.

- [ ] **UI/UX Enhancements**

  - Apply Motion animations for popups and page transitions.
  - Test responsiveness across devices.

## Week 2: Billing and Support

- [ ] **Billing Integration**

  - Integrate Paytm SDK for organization billing.
  - Create billing management UI (view plans, payment status).
  - Test payment flow and error handling.

- [ ] **Help Page**

  - Design help page with contact email (support@healthdrive.in).
  - Add FAQ section with common questions.
  - Implement email contact button (mailto link).

- [ ] **Testing and Deployment**

  - Conduct end-to-end testing for all features.
  - Deploy application to production environment.
  - Monitor real-time performance and fix bugs.

## Notes

- Prioritize real-time features and authentication in Week 1 to ensure core functionality.
- Use Supabase dashboard to monitor database performance.
- Document any third-party integration issues (Clerk, Paytm) for quick resolution.