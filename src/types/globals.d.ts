export {};

declare global {
  interface OrganizationPublicMetadata {
    address: string;
    phone: string;
    plan: "starter" | "pro" | "business";
    plan_expires_at: Date;
    plan_status: "active" | "inactive" | "expired";
  }

  interface OrganizationPrivateMetadata {
    transaction_id: string;
  }
}

// Utility types for better type safety
export type PlanType = "starter" | "pro" | "business";
export type PlanStatus = "active" | "inactive" | "expired";
export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  message?: string;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Error types
export interface AppErrorType {
  code: string;
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

// Environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_KEY: string;
      CLERK_SECRET_KEY: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: string;
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: string;
    }
  }
}
