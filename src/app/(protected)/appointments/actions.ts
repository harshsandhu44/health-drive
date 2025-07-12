"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient, type Appointment } from "@/lib/supabase";

// Extended appointment interface for the full appointments page
export interface FullAppointment {
  id: string;
  patient_id: string;
  doctor_id?: string;
  organization_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
}

export async function fetchAppointments(): Promise<FullAppointment[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return [];
    }

    const organizationId = orgId;
    const supabase = createSupabaseServiceClient();

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(
        `*,
        patients!inner(name, phone_number),
        doctors(name)
      `
      )
      .eq("organization_id", organizationId)
      .order("date", { ascending: false })
      .order("time", { ascending: true });

    if (error) {
      console.error("Fetch appointments error:", error);
      return [];
    }

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      appointments?.map((apt: any) => ({
        id: apt.id,
        patient_id: apt.patient_id,
        doctor_id: apt.doctor_id,
        organization_id: apt.organization_id,
        date: apt.date,
        time: apt.time,
        status: apt.status,
        notes: apt.notes,
        created_at: apt.created_at,
        updated_at: apt.updated_at,
        appointment_date: apt.date,
        appointment_time: apt.time,
        patient_name: apt.patients?.name,
        patient_phone: apt.patients?.phone_number,
        doctor_name: apt.doctors?.name,
      })) || []
    );
  } catch (error) {
    console.error("Fetch appointments error:", error);
    return [];
  }
}

export async function fetchAppointmentStats(): Promise<{
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }

    const organizationId = orgId;
    const supabase = createSupabaseServiceClient();

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("status")
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Fetch appointment stats error:", error);
      return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }

    const stats = appointments?.reduce(
      (acc, apt) => {
        acc[apt.status as keyof typeof acc] =
          (acc[apt.status as keyof typeof acc] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
    ) || { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

    return stats;
  } catch (error) {
    console.error("Fetch appointment stats error:", error);
    return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  }
}

export async function createAppointment(
  formData: FormData
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const patientId = formData.get("patient_id") as string;
    const doctorId = formData.get("doctor_id") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const notes = formData.get("notes") as string;

    if (!patientId || !date || !time) {
      return { success: false, error: "Patient, date, and time are required" };
    }

    const supabase = createSupabaseServiceClient();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        organization_id: organizationId,
        patient_id: patientId,
        doctor_id: doctorId || null,
        date,
        time,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Create appointment error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Create appointment error:", error);
    return { success: false, error: "Failed to create appointment" };
  }
}

export async function updateAppointment(
  appointmentId: string,
  formData: FormData
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const patientId = formData.get("patient_id") as string;
    const doctorId = formData.get("doctor_id") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const status = formData.get("status") as string;
    const notes = formData.get("notes") as string;

    if (!patientId || !date || !time) {
      return { success: false, error: "Patient, date, and time are required" };
    }

    const supabase = createSupabaseServiceClient();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .update({
        patient_id: patientId,
        doctor_id: doctorId || null,
        date,
        time,
        status: status || "pending",
        notes: notes || null,
      })
      .eq("id", appointmentId)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error) {
      console.error("Update appointment error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Update appointment error:", error);
    return { success: false, error: "Failed to update appointment" };
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<{ success: boolean; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId)
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Update appointment status error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
  } catch (error) {
    console.error("Update appointment status error:", error);
    return { success: false, error: "Failed to update appointment status" };
  }
}

export async function deleteAppointment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Delete appointment error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/appointments");
    return { success: true };
  } catch (error) {
    console.error("Delete appointment error:", error);
    return { success: false, error: "Failed to delete appointment" };
  }
}
