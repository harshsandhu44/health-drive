"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient, type Doctor } from "@/lib/supabase";

export async function createDoctor(
  formData: FormData
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const specialization = formData.get("specialization") as string;

    if (!name) {
      return { success: false, error: "Name is required" };
    }

    const supabase = createSupabaseServiceClient();

    const { data: doctor, error } = await supabase
      .from("doctors")
      .insert({
        organization_id: organizationId,
        name,
        contact: contact || null,
        specialization: specialization || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Create doctor error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/doctors");
    return { success: true, doctor };
  } catch (error) {
    console.error("Create doctor error:", error);
    return { success: false, error: "Failed to create doctor" };
  }
}

export async function updateDoctor(
  doctorId: string,
  formData: FormData
): Promise<{ success: boolean; doctor?: Doctor; error?: string }> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return {
        success: false,
        error: "User not authenticated or not part of an organization",
      };
    }

    const organizationId = orgId;
    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const specialization = formData.get("specialization") as string;

    if (!name) {
      return { success: false, error: "Name is required" };
    }

    const supabase = createSupabaseServiceClient();

    const { data: doctor, error } = await supabase
      .from("doctors")
      .update({
        name,
        contact: contact || null,
        specialization: specialization || null,
      })
      .eq("id", doctorId)
      .eq("organization_id", organizationId)
      .select()
      .single();

    if (error) {
      console.error("Update doctor error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/doctors");
    return { success: true, doctor };
  } catch (error) {
    console.error("Update doctor error:", error);
    return { success: false, error: "Failed to update doctor" };
  }
}

export async function deleteDoctor(
  doctorId: string
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
      .from("doctors")
      .delete()
      .eq("id", doctorId)
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Delete doctor error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/doctors");
    return { success: true };
  } catch (error) {
    console.error("Delete doctor error:", error);
    return { success: false, error: "Failed to delete doctor" };
  }
}

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      return [];
    }

    const organizationId = orgId;
    const supabase = createSupabaseServiceClient();

    const { data: doctors, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch doctors error:", error);
      return [];
    }

    return doctors || [];
  } catch (error) {
    console.error("Fetch doctors error:", error);
    return [];
  }
}
