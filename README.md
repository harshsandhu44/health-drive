# Health Drive

## 1. Executive Summary

This PRD outlines the Minimum Viable Product (MVP) for a B2B SaaS platform designed for healthcare facilities. The platform streamlines appointment management, department organization, doctor management, patient communication, and subscription plan management. The MVP leverages Next.js (App Router, TypeScript), Clerk for authentication and organization metadata, Supabase for the database, Twilio for messaging (future phase), shadcn/ui with Tailwind CSS for UI, and Framer Motion for animations. A `doctors` table tracks doctor details, including specialization, and patient associations. Billing is handled manually by admins setting plan details in Clerk, logged in Supabase. The database schema uses `TEXT` for Clerk IDs, makes patient email optional, and includes an optional note in appointments.

## 2. Objectives

- Enable healthcare facilities to manage patient appointments efficiently.
- Organize departments and doctors within facilities.
- Facilitate appointment-related communication with patients via SMS (future phase).
- Provide subscription plans (Starter, Pro, Business) managed manually by admins.
- Deliver a secure, scalable, and user-friendly platform for healthcare administrators.

## 3. Target Audience

- Healthcare facility administrators (e.g., hospitals, clinics).
- Department heads and scheduling staff.
- Doctors and support staff interacting with the platform.
