# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

### Core Commands

- `npm run dev` - Start development server with Turbopack (fastest hot reload)
- `npm run build` - Build application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Run ESLint and fix auto-fixable issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run pre-commit` - Run all checks (type-check, lint:fix, format) - run before committing

### Supabase Commands

- `npx supabase start` - Start local Supabase instance
- `npx supabase stop` - Stop local Supabase instance
- `npx supabase reset` - Reset local database with fresh schema and seed data
- `npx supabase db push` - Push schema changes to remote database
- `npx supabase gen types typescript --local` - Generate TypeScript types from local database

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15 with App Router and React 19
- **Authentication**: Clerk with webhooks for user management
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **State Management**: Zustand stores with React Query for server state
- **UI**: Radix UI primitives with Tailwind CSS styling
- **PWA**: Next-PWA with service worker and offline support

### Key Architecture Patterns

**App Router Structure**:

- `src/app/(auth)/` - Authentication pages (sign-in)
- `src/app/(protected)/` - Protected routes with sidebar layout
  - `dashboard/` - Main overview with metrics and today's appointments
  - `appointments/` - Complete appointment management with dual creation modes
  - `doctors/` - Healthcare provider management with CRUD operations
  - `patients/` - Patient records management with search capabilities
  - `analytics/` - Healthcare facility performance insights and metrics
- `src/app/api/webhooks/clerk/` - Clerk webhook handler for user sync

**State Management**:

- Server actions for CRUD operations in each route's `actions.ts` file
- Client-side state management with React hooks
- Real-time updates through Supabase subscriptions
- UI state separated from business logic

**Database Integration**:

- Server components use `createSupabaseServerClient()` from `src/lib/supabase.ts`
- Client components use `createSupabaseClient()`
- Type-safe database interfaces defined in `src/lib/supabase.ts`

**Component Organization**:

- `src/components/ui/` - Reusable UI primitives (shadcn/ui style)
- `src/components/headers/` - Header components
- `src/components/sidebars/` - Sidebar components
- `src/components/modals/` - Modal components
- `src/components/pwa/` - PWA-specific components

### Database Schema

The application uses a multi-tenant healthcare architecture with:

- `organizations` - Top-level tenant isolation with billing status
- `users` - Synced with Clerk via webhooks, role-based access (admin, staff, doctor)
- `doctors` - Healthcare providers with specializations and contact information
- `patients` - Patient records with demographics, blood group, and medical history
- `appointments` - Scheduling system with status tracking, notes, and patient/doctor relationships
- `analytics_logs` - Performance metrics and usage tracking

### CRUD Operations Available

**Doctors Management**:

- Create, read, update, delete healthcare providers
- Specialization and contact information management
- Organization-level access control

**Patients Management**:

- Full patient record management with demographics
- Advanced search by name, phone number
- Blood group tracking and age calculation
- Safety checks for deletion (prevents removal if appointments exist)

**Appointments Management**:

- Dual creation modes: new patient + appointment, existing patient scheduling
- Status workflow: pending → confirmed → completed/cancelled
- Real-time status updates and notes management
- Patient and doctor relationship tracking

### Authentication Flow

1. Clerk handles authentication UI and user management
2. Webhooks sync user data to Supabase (`/api/webhooks/clerk/route.ts`)
3. Protected routes use Clerk's middleware
4. Supabase RLS policies enforce organization-level access control

### PWA Features

- Service worker registration in root layout
- Offline-first caching strategies in `next.config.ts`
- Push notifications support
- Install prompt and app-like experience

## Development Guidelines

### Code Quality

- Always run `npm run pre-commit` before committing
- TypeScript strict mode is enabled
- ESLint rules include React, accessibility, and import sorting
- Prettier handles code formatting with Tailwind class sorting

### Database Development

- Use local Supabase for development (`npx supabase start`)
- Schema changes go in `supabase/migrations/`
- Seed data in `supabase/seed.sql`
- Always regenerate types after schema changes

### Healthcare Application Patterns

**Server Actions**:

- Each protected route has an `actions.ts` file with CRUD operations
- All database operations use service role client for proper permissions
- FormData pattern for form submissions with proper validation

**Component Patterns**:

- Modal-based CRUD operations for doctors, patients, appointments
- Search and filter capabilities for patient management
- Real-time status updates for appointments
- Dual-mode forms for new vs existing patient workflows

**Form Management**:

- React Hook Form with Zod validation for all healthcare forms
- Patient intake forms with medical information validation
- Appointment scheduling with date/time validation
- Error handling and success feedback for all operations

### Environment Setup

- Requires Node.js 18+
- Local development uses Supabase local instance
- Clerk webhooks require proper environment variables
- PWA features work in development mode
