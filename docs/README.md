# HealthDrive - Healthcare Management System

A modern healthcare management system built with Next.js, Supabase, and Clerk for managing appointments, patients, and doctors.

## Overview

HealthDrive is a Progressive Web App (PWA) designed for healthcare organizations to efficiently manage:
- Patient appointments and scheduling
- Doctor profiles and specializations  
- Patient records and medical history
- Analytics and reporting
- Multi-organization support with role-based access

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Authentication**: Clerk with webhooks for user management
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **UI**: Radix UI primitives with Tailwind CSS styling
- **State Management**: Zustand stores with React Query for server state
- **PWA**: Next-PWA with service worker and offline support

## Key Features

### Multi-Tenant Architecture
- Organization-based data isolation
- Role-based access control (admin, staff, doctor)
- Clerk webhook integration for user sync

### Appointment Management
- UTC-based datetime storage with timezone conversion
- Status tracking (pending, confirmed, completed, cancelled)
- Real-time updates and notifications
- Doctor and patient assignment

### Patient Records
- Auto-generated patient IDs (PAT_xxxxxxxx format)
- Medical history tracking
- Blood group and basic demographics
- Phone-based patient lookup

### Analytics Dashboard
- Appointment metrics and trends
- Doctor performance statistics
- Patient return rate tracking
- Real-time charts and visualizations

## Database Schema

### Core Tables
- `organizations` - Multi-tenant organization data
- `users` - Clerk-synced user accounts with roles
- `patients` - Patient information with auto-generated text IDs
- `doctors` - Healthcare provider profiles
- `appointments` - Scheduling with UTC datetime storage
- `departments` - Organizational structure
- `patient_records` - Medical history tracking
- `analytics_logs` - Metrics and reporting data

### Key Design Decisions
- **UTC Datetime**: All appointments stored in UTC, converted to local timezone in frontend
- **Text Patient IDs**: Auto-generated `PAT_xxxxxxxx` format for better user experience
- **Organization Isolation**: RLS policies ensure data separation between organizations
- **Real-time Updates**: Supabase subscriptions for live data sync

## Development

### Prerequisites
- Node.js 18+
- Supabase CLI
- Clerk account for authentication

### Environment Setup
```bash
# Install dependencies
npm install

# Start local Supabase
npx supabase start

# Run development server
npm run dev
```

### Database Management
```bash
# Reset database with fresh schema and seed data
npx supabase db reset

# Generate TypeScript types
npx supabase gen types typescript --local > src/types/supabase.ts

# Apply new migrations
npx supabase db push
```

### Code Quality
```bash
# Run all pre-commit checks
npm run pre-commit

# Individual checks
npm run type-check
npm run lint:fix
npm run format
```

## API Routes

### Webhooks
- `/api/webhooks/clerk` - Clerk user sync webhook

### Actions (Server Actions)
- Appointment CRUD operations with UTC datetime handling
- Patient management with auto-generated IDs
- Doctor profile management
- Analytics data fetching

## PWA Features

- Service worker for offline caching
- Push notifications support
- Installable app experience
- Background sync capabilities

## Architecture Patterns

### State Management
- Zustand for global client state
- React Query for server state caching
- Optimistic updates for better UX

### Type Safety
- Full TypeScript coverage
- Generated Supabase types
- Zod schemas for form validation
- Global type definitions

### Component Organization
- shadcn/ui component library
- Radix UI primitives for accessibility
- CVA for component variants
- Consistent design system

## Security

- Row Level Security (RLS) policies for data isolation
- Clerk authentication with webhook verification
- Environment variable protection
- HTTPS-only in production

## Deployment

The application is designed for deployment on:
- Vercel (recommended for Next.js)
- Supabase for database and real-time features
- Clerk for authentication services

## Contributing

1. Follow the existing code patterns and conventions
2. Run `npm run pre-commit` before committing
3. Use the established type system
4. Write comprehensive tests for new features
5. Update documentation for significant changes

## Support

For issues and questions:
- Check the existing code patterns
- Review the database schema
- Test with local development environment
- Use TypeScript for better development experience