"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient, type Patient } from "@/lib/supabase";

export async function createPatient(
  formData: FormData
): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const dateOfBirth = formData.get("date_of_birth") as string;
    const bloodGroup = formData.get("blood_group") as string;

    if (!name || !phoneNumber || !dateOfBirth || !bloodGroup) {
      return {
        success: false,
        error:
          "Name, phone number, date of birth, and blood group are required",
      };
    }

    const supabase = createSupabaseServiceClient();

    const { data: patient, error } = await supabase
      .from("patients")
      .insert({
        name,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        blood_group: bloodGroup as Patient["blood_group"],
      })
      .select()
      .single();

    if (error) {
      console.error("Create patient error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/patients");
    return { success: true, patient };
  } catch (error) {
    console.error("Create patient error:", error);
    return { success: false, error: "Failed to create patient" };
  }
}

export async function updatePatient(
  patientId: string,
  formData: FormData
): Promise<{ success: boolean; patient?: Patient; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const dateOfBirth = formData.get("date_of_birth") as string;
    const bloodGroup = formData.get("blood_group") as string;

    if (!name || !phoneNumber || !dateOfBirth || !bloodGroup) {
      return {
        success: false,
        error:
          "Name, phone number, date of birth, and blood group are required",
      };
    }

    const supabase = createSupabaseServiceClient();

    const { data: patient, error } = await supabase
      .from("patients")
      .update({
        name,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        blood_group: bloodGroup as Patient["blood_group"],
      })
      .eq("id", patientId)
      .select()
      .single();

    if (error) {
      console.error("Update patient error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/patients");
    return { success: true, patient };
  } catch (error) {
    console.error("Update patient error:", error);
    return { success: false, error: "Failed to update patient" };
  }
}

export async function deletePatient(
  patientId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const supabase = createSupabaseServiceClient();

    // Check if patient has appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select("id")
      .eq("patient_id", patientId)
      .limit(1);

    if (appointmentsError) {
      console.error("Check appointments error:", appointmentsError);
      return { success: false, error: "Failed to check patient appointments" };
    }

    if (appointments && appointments.length > 0) {
      return {
        success: false,
        error: "Cannot delete patient with existing appointments",
      };
    }

    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", patientId);

    if (error) {
      console.error("Delete patient error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/patients");
    return { success: true };
  } catch (error) {
    console.error("Delete patient error:", error);
    return { success: false, error: "Failed to delete patient" };
  }
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return [];
    }

    const supabase = createSupabaseServiceClient();

    const { data: patients, error } = await supabase
      .from("patients")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Fetch patients error:", error);
      return [];
    }

    return patients || [];
  } catch (error) {
    console.error("Fetch patients error:", error);
    return [];
  }
}

export async function fetchPatientById(
  patientId: string
): Promise<Patient | null> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return null;
    }

    const supabase = createSupabaseServiceClient();

    const { data: patient, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) {
      console.error("Fetch patient error:", error);
      return null;
    }

    return patient;
  } catch (error) {
    console.error("Fetch patient error:", error);
    return null;
  }
}

export async function searchPatients(searchTerm: string): Promise<Patient[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return [];
    }

    const supabase = createSupabaseServiceClient();

    const { data: patients, error } = await supabase
      .from("patients")
      .select("*")
      .or(`name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
      .order("name", { ascending: true });

    if (error) {
      console.error("Search patients error:", error);
      return [];
    }

    return patients || [];
  } catch (error) {
    console.error("Search patients error:", error);
    return [];
  }
}
