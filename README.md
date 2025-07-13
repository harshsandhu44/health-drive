# Health Drive 🏥

A comprehensive healthcare management platform built with Next.js 15, React 19, and TypeScript.
Health Drive provides a complete solution for healthcare facilities to manage doctors, patients,
appointments, and analytics in a modern, secure environment.

## ✨ Core Features

### 🏥 **Healthcare Management**

- **👨‍⚕️ Doctor Management** - Complete CRUD operations for healthcare providers with specializations
- **👥 Patient Management** - Comprehensive patient records with search and filtering capabilities
- **📅 Appointment System** - Advanced scheduling with dual creation modes (new/existing patients)
- **📊 Healthcare Analytics** - Real-time insights and performance metrics
- **🔍 Advanced Search** - Find patients by name, phone, or other criteria instantly

### 🔧 **Technical Features**

- **📱 Progressive Web App (PWA)** - Works offline and can be installed on devices
- **🔐 Multi-tenant Authentication** - Organization-based access control with Clerk
- **📊 Real-time Data** - Live updates with Supabase integration and Row Level Security
- **🎨 Modern UI** - Professional healthcare interface with Radix UI and Tailwind CSS
- **♿ Accessibility** - WCAG compliant components for healthcare compliance
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Application Architecture

### 📋 **Page Structure**

- **🏠 Dashboard** - Overview with key metrics, today's appointments, and quick actions
- **📅 Appointments** - Complete appointment management with status tracking and scheduling
- **👨‍⚕️ Doctors** - Healthcare provider management with specializations and contact details
- **👥 Patients** - Patient records management with search and demographic tracking
- **📊 Analytics** - Comprehensive insights and performance metrics for the healthcare facility

### 🔄 **Appointment Workflows**

- **New Patient + Appointment** - Create patient record and schedule appointment in one workflow
- **Existing Patient + Appointment** - Quick appointment scheduling for existing patients with
  search
- **Appointment Management** - Update status, modify details, and track appointment lifecycle
- **Status Tracking** - Real-time status updates (Pending → Confirmed → Completed/Cancelled)

## 🚀 Tech Stack

### **Frontend & Framework**

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router and React 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) with strict mode
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom healthcare theme
- **UI Components**: [Radix UI](https://www.radix-ui.com/) with shadcn/ui patterns

### **Backend & Database**

- **Database**: [Supabase](https://supabase.com/) PostgreSQL with real-time subscriptions
- **Authentication**: [Clerk](https://clerk.com/) with organization-based multi-tenancy
- **API**: Next.js API routes with TypeScript and server actions
- **Security**: Row Level Security (RLS) policies for data isolation

### **Development & Quality**

- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **State Management**: Zustand stores with React Query for server state
- **Code Quality**: ESLint, Prettier, TypeScript strict mode, Husky git hooks
- **Testing**: TypeScript compilation and linting enforcement

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd health-drive
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables (Clerk, Supabase, etc.)

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser** Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start development server with Turbopack |
| `npm run build`        | Build the application for production    |
| `npm run start`        | Start the production server             |
| `npm run lint`         | Run ESLint to check for issues          |
| `npm run lint:fix`     | Run ESLint and fix auto-fixable issues  |
| `npm run format`       | Format code with Prettier               |
| `npm run format:check` | Check if code is formatted correctly    |
| `npm run type-check`   | Run TypeScript type checking            |
| `npm run pre-commit`   | Run all checks (types, lint, format)    |

### 🗄️ **Database Scripts**

| Script                                      | Description                                    |
| ------------------------------------------- | ---------------------------------------------- |
| `npx supabase start`                        | Start local Supabase instance                  |
| `npx supabase stop`                         | Stop local Supabase instance                   |
| `npx supabase reset`                        | Reset database with fresh schema and seed data |
| `npx supabase db push`                      | Push schema changes to remote database         |
| `npx supabase gen types typescript --local` | Generate TypeScript types from database        |

## 🧰 Development Workflow

### Code Quality

This project uses several tools to maintain high code quality:

- **ESLint**: Linting with rules for TypeScript, React, accessibility, and imports
- **Prettier**: Code formatting with Tailwind CSS class sorting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for automated code quality enforcement

### Git Hooks

Automated quality checks run at different Git stages:

- **pre-commit**: Type checking, linting with auto-fix, and formatting
- **pre-push**: Production build test and type checking
- **commit-msg**: Enforces conventional commit message format

#### Conventional Commits

All commit messages must follow the format: `type(scope): description`

**Valid types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`,
`revert`

**Examples**:

```bash
feat(auth): add user authentication
fix(ui): resolve button styling issue
docs: update README installation steps
chore: update dependencies
```

### Best Practices

1. **Run pre-commit checks**:

   ```bash
   npm run pre-commit
   ```

2. **Use TypeScript strictly**: Define proper types for all props and functions

3. **Follow naming conventions**:
   - Components: PascalCase (`UserProfile.tsx`)
   - Files/folders: kebab-case (`user-profile/`)
   - Functions/variables: camelCase (`getUserData`)

4. **Component organization**:
   ```
   src/
   ├── app/                    # Next.js App Router
   │   ├── (auth)/            # Authentication pages
   │   ├── (protected)/       # Protected routes with layouts
   │   │   ├── dashboard/     # Dashboard page and components
   │   │   ├── appointments/  # Appointments management
   │   │   ├── doctors/       # Doctors management
   │   │   ├── patients/      # Patients management
   │   │   └── analytics/     # Analytics dashboard
   │   └── api/               # API routes and webhooks
   ├── components/            # Reusable components
   │   ├── ui/               # Base UI components (shadcn/ui)
   │   ├── forms/            # Form components
   │   ├── modals/           # Modal components
   │   ├── tables/           # Data table components
   │   ├── cards/            # Card components
   │   ├── sidebars/         # Navigation components
   │   └── headers/          # Header components
   ├── hooks/                # Custom React hooks
   ├── lib/                  # Utilities and configurations
   └── middleware.ts         # Clerk authentication middleware
   ```

## 🎨 Healthcare UI System

The project uses a comprehensive healthcare-focused design system:

### **Design Foundation**

- **Radix UI**: Headless, accessible components for healthcare compliance
- **Tailwind CSS**: Utility-first styling with healthcare color palette
- **CVA**: Class variance authority for consistent component variants
- **Lucide React**: Medical and healthcare-specific icons

### **Healthcare Components**

- **Forms**: Patient intake, appointment scheduling, doctor management
- **Tables**: Patient lists, appointment schedules, analytics data
- **Cards**: Status summaries, metric displays, patient cards
- **Modals**: Appointment creation/editing, patient management
- **Navigation**: Healthcare-specific sidebar and navigation
- **Data Display**: Medical records, appointment status, analytics charts

### **Accessibility & Compliance**

- WCAG 2.1 AA compliant components
- Healthcare industry color contrast standards
- Keyboard navigation for all interactive elements
- Screen reader optimized for medical data

## 📱 PWA Features

Health Drive is built as a Progressive Web App with:

- **Offline functionality**: Core features work without internet
- **Install prompt**: Users can install the app on their devices
- **Push notifications**: Real-time updates and reminders
- **Background sync**: Data syncs when connection is restored

## 🔧 Configuration Files

- `eslint.config.mjs`: ESLint configuration with comprehensive rules
- `.prettierrc`: Prettier configuration for code formatting
- `tsconfig.json`: TypeScript compiler configuration
- `tailwind.config.js`: Tailwind CSS customization
- `next.config.ts`: Next.js configuration with PWA support

## 🗄️ Database Schema

### **Core Entities**

- **Organizations** - Multi-tenant isolation with billing status
- **Users** - Role-based access (admin, staff, doctor) with organization linking
- **Doctors** - Healthcare providers with specializations and contact info
- **Patients** - Patient records with demographics and medical info
- **Appointments** - Scheduling system with status tracking and notes

### **Security Features**

- **Row Level Security (RLS)** - Organization-based data isolation
- **Service Role Actions** - Secure server-side operations
- **Real-time Subscriptions** - Live data updates across clients
- **Audit Logging** - Analytics logs for performance tracking

## 📊 Key Features Implemented

### ✅ **Complete CRUD Operations**

- **Doctors**: Create, read, update, delete healthcare providers
- **Patients**: Full patient management with search capabilities
- **Appointments**: Comprehensive scheduling and status management

### ✅ **Advanced Workflows**

- **Dual Creation Modes**: New patient + appointment or existing patient scheduling
- **Real-time Updates**: Live appointment status changes
- **Search & Filter**: Patient search by name, phone, demographics
- **Analytics Dashboard**: Healthcare facility performance insights

### ✅ **Healthcare-Specific Features**

- **Status Tracking**: Pending → Confirmed → Completed/Cancelled workflows
- **Patient Demographics**: Age calculation, blood group tracking
- **Doctor Specializations**: Medical specialty management
- **Appointment Notes**: Clinical notes and observations

## 📚 Project Documentation

Detailed documentation is available in the `docs/` directory:

- [Project Requirements](./docs/project-requirements.md) - Feature specifications and requirements
- [Database Schema](./docs/database-schema.md) - Complete database structure and relationships
- [Business Model](./docs/business-model.md) - Healthcare business logic and workflows
- [Data Flow](./docs/data-flow.md) - Application data flow and state management
- [Wireframes](./docs/wireframes.md) - UI/UX design specifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run pre-commit checks (`npm run pre-commit`)
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
