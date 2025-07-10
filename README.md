# Health Drive 🏥

A modern health management platform built with Next.js 15, React 19, and TypeScript. Health Drive
provides a comprehensive solution for managing health records, appointments, and wellness tracking.

## ✨ Features

- **📱 Progressive Web App (PWA)** - Works offline and can be installed on devices
- **🔐 Secure Authentication** - Powered by Clerk
- **📊 Real-time Data** - Integrated with Supabase for real-time updates
- **🎨 Modern UI** - Built with Radix UI components and Tailwind CSS
- **📈 Analytics & Charts** - Interactive charts with Recharts
- **🌙 Dark Mode** - Theme switching with next-themes
- **♿ Accessibility** - WCAG compliant components
- **📱 Responsive Design** - Mobile-first approach

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Runtime**: [React 19](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

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

## 🧰 Development Workflow

### Code Quality

This project uses several tools to maintain high code quality:

- **ESLint**: Linting with rules for TypeScript, React, accessibility, and imports
- **Prettier**: Code formatting with Tailwind CSS class sorting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks (optional)

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
   ├── app/              # Next.js App Router pages
   ├── components/       # Reusable components
   │   ├── ui/          # Base UI components
   │   └── features/    # Feature-specific components
   ├── hooks/           # Custom React hooks
   ├── lib/             # Utilities and configurations
   └── types/           # TypeScript type definitions
   ```

## 🎨 UI Components

The project uses a comprehensive design system built on:

- **Radix UI**: Headless, accessible components
- **Tailwind CSS**: Utility-first styling
- **CVA**: Class variance authority for component variants
- **Lucide React**: Beautiful, customizable icons

### Available Components

- Forms: Input, Select, Checkbox, Radio, Switch
- Navigation: Breadcrumb, Pagination, Tabs
- Overlays: Dialog, Popover, Tooltip, Sheet
- Data Display: Table, Card, Badge, Avatar
- Feedback: Alert, Progress, Skeleton
- And many more...

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

## 📚 Project Documentation

Detailed documentation is available in the `docs/` directory:

- [Project Requirements](./docs/project-requirements.md)
- [Database Schema](./docs/database-schema.md)
- [Business Model](./docs/business-model.md)
- [Data Flow](./docs/data-flow.md)
- [Wireframes](./docs/wireframes.md)

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
