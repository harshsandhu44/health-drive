import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error handling utilities
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleServerError(error: unknown, context: string): AppError {
  console.error(`Error in ${context}:`, error);

  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("Unauthorized")) {
      return new AppError("Access denied", "UNAUTHORIZED", 401);
    }

    if (error.message.includes("not found")) {
      return new AppError("Resource not found", "NOT_FOUND", 404);
    }

    return new AppError(error.message, "INTERNAL_ERROR", 500);
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 500);
}

// Form validation utilities
export function validateFormData(
  formData: FormData,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter((field) => !formData.get(field));

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(", ")}`,
      "VALIDATION_ERROR",
      400
    );
  }
}

// Date utilities
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Phone number utilities
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Async utilities
export function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          reject(error);
        } else {
          setTimeout(attempt, delay * retries);
        }
      }
    };

    attempt();
  });
}
