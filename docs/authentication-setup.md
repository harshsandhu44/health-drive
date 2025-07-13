# Authentication Setup with Clerk

This document describes the Clerk authentication implementation for HealthDrive, including route
organization, webhook configuration, and integration with Supabase.

## Overview

The authentication system uses Clerk for user and organization management, with automatic
synchronization to Supabase for data consistency. The implementation follows Next.js 15 App Router
best practices with proper route grouping.

## Route Organization

### Route Groups

The application uses Next.js route groups to organize authentication-related routes:

```
src/app/
├── (auth)/                 # Authentication pages (public)
│   ├── layout.tsx         # Auth-specific layout
│   ├── sign-in/
│   │   └── page.tsx       # Sign-in page
│   └── sign-up/
│       └── page.tsx       # Sign-up page
├── (protected)/           # Protected routes (require auth)
│   ├── layout.tsx         # Protected layout with navigation
│   ├── dashboard/
│   │   └── page.tsx       # Main dashboard
│   └── [other-pages]/     # Future protected pages
└── api/webhooks/clerk/    # Clerk webhook endpoint
    └── route.ts
```

### Route Protection

- **Middleware**: Global protection using `clerkMiddleware`
- **Route Groups**: Separate layouts for auth and protected areas
- **Automatic Redirects**: Unauthenticated users → sign-in, Authenticated users → dashboard

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URL Configuration
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Webhook Configuration
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase (for data sync)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Clerk Credentials

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Copy the publishable key and secret key from the API Keys section
3. Configure the webhook endpoint in Clerk dashboard

## Webhook Configuration

### Webhook Setup in Clerk Dashboard

1. Go to Webhooks in your Clerk dashboard
2. Add a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select the following events:
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organizationMembership.created`
   - `organizationMembership.deleted`

### Data Synchronization

The webhook automatically syncs the following data to Supabase:

#### Organizations Table

- `id` (text) - Clerk organization ID
- `name` - Organization name
- `billing_status` - Default: 'inactive'
- `created_at` - Timestamp

#### Users Table

- `id` (text) - Clerk user ID
- `organization_id` (text) - Reference to organization
- `email` - Primary email address
- `role` - Mapped from Clerk roles ('admin' or 'staff')
- `created_at` - Timestamp

## Security Features

### Route Protection

- Middleware-level authentication checks
- Automatic redirects for unauthorized access
- Protected API routes

### Data Validation

- Webhook signature verification using svix
- Type-safe data handling
- Error handling and logging

### Role-Based Access

- Organization-level isolation
- Role mapping from Clerk to application roles
- Supabase RLS policies for data security

## Development Setup

### 1. Install Dependencies

```bash
npm install @clerk/nextjs svix
```

### 2. Configure Middleware

The middleware is already set up in `middleware.ts` to protect routes automatically.

### 3. Test Authentication Flow

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should be redirected to `/auth/sign-in`
4. Create an account and verify the redirect to `/dashboard`

### 4. Test Webhook Locally

1. Use ngrok or similar tool to expose localhost
2. Update webhook URL in Clerk dashboard
3. Create/update organizations and users to test sync

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is publicly accessible
   - Verify webhook secret matches environment variable
   - Check Clerk dashboard webhook logs

2. **Authentication redirects not working**
   - Verify environment variables are set correctly
   - Check middleware configuration
   - Ensure Clerk provider is properly configured

3. **Data not syncing to Supabase**
   - Check webhook endpoint logs
   - Verify Supabase connection and permissions
   - Check RLS policies allow webhook operations

### Debugging

Enable debug logging by adding to your webhook handler:

```typescript
console.log("Webhook event:", evt.type, evt.data);
```

## Production Deployment

### Checklist

- [ ] Set production Clerk keys
- [ ] Configure production webhook URL
- [ ] Update environment variables
- [ ] Test webhook functionality
- [ ] Verify Supabase RLS policies
- [ ] Test complete authentication flow

### Security Considerations

- Never commit `.env.local` to version control
- Use secure webhook secrets
- Implement proper error handling
- Monitor webhook performance and errors

## Next Steps

After authentication is set up:

1. Implement organization selection for multi-tenant users
2. Add role-based permissions for different features
3. Create user profile management
4. Implement team member invitation system
5. Add billing integration with organization management
