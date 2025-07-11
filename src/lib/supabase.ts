/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createServerClient, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side client for API routes or server components
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

// Client-side client for browser use
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Database types
export interface Organization {
  id: string;
  name: string;
  billing_status: "active" | "inactive" | "past_due";
  created_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  role: "admin" | "staff" | "doctor";
  created_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
}

export interface Doctor {
  id: string;
  organization_id: string;
  department_id?: string;
  name: string;
  contact?: string;
  specialization?: string;
}

export interface Patient {
  id: string;
  phone_number: string;
  name: string;
  date_of_birth: string;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
}

export interface Appointment {
  id: string;
  organization_id: string;
  doctor_id?: string;
  patient_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface PatientRecord {
  id: string;
  patient_id: string;
  medical_history?: string;
  last_updated: string;
}

export interface AnalyticsLog {
  id: string;
  organization_id: string;
  metric_type:
    | "total_appointments"
    | "appointments_per_doctor"
    | "returning_patients";
  value: number;
  timestamp: string;
}
