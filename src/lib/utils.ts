import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValideDateOfBirth(date: Date): boolean {
  const now = new Date();
  return date < now && date.getFullYear() >= 1900;
}

export function isValidBloodGroup(bloodGroup: string): boolean {
  return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(
    bloodGroup
  );
}
