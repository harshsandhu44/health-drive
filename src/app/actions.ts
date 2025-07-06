"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerClient } from "@/lib/db/server";
import { CreateAppointmentData, Appointment } from "@/types/appointment";

// Fetch all appointments
export async function fetchAppointmentsAction(): Promise<Appointment[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:patients(*)
      `
      )
      .eq("organization_id", orgId)
      .order("appointment_datetime", { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      throw new Error("Failed to fetch appointments");
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

// Fetch today's appointments
export async function fetchTodaysAppointmentsAction(): Promise<Appointment[]> {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const supabase = await createServerClient();
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:patients(*)
      `
      )
      .eq("organization_id", orgId)
      .gte("appointment_datetime", startOfDay.toISOString())
      .lt("appointment_datetime", endOfDay.toISOString())
      .order("appointment_datetime", { ascending: true });

    if (error) {
      console.error("Error fetching today's appointments:", error);
      throw new Error("Failed to fetch today's appointments");
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    throw error;
  }
}

// Fetch organization members
export async function fetchOrganizationMembersAction() {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const client = await clerkClient();
    const members = await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

    const formattedMembers = members.data
      .filter((member) => member.publicUserData)
      .map((member) => {
        const userData = member.publicUserData!;
        const firstName = userData.firstName || "";
        const lastName = userData.lastName || "";
        const fullName =
          `${firstName} ${lastName}`.trim() || userData.identifier;

        return {
          id: userData.userId,
          name: fullName,
          email: userData.identifier,
          role: member.role,
        };
      });

    return formattedMembers;
  } catch (error) {
    console.error("Error fetching organization members:", error);
    throw error;
  }
}

// Create appointment
export async function createAppointmentAction(formData: FormData) {
  try {
    const { orgId, userId } = await auth();
    if (!orgId || !userId) {
      throw new Error("Unauthorized");
    }

    const patient_email = formData.get("patient_email") as string;
    const patient_note = formData.get("patient_note") as string;

    const appointmentData: CreateAppointmentData = {
      patient_name: formData.get("patient_name") as string,
      patient_email: patient_email || undefined,
      patient_phone: formData.get("patient_phone") as string,
      patient_note: patient_note || undefined,
      doctor_id: formData.get("doctor_id") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      status: "confirmed",
    };

    // Validate required fields
    if (
      !appointmentData.patient_name ||
      !appointmentData.patient_phone ||
      !appointmentData.doctor_id ||
      !appointmentData.date ||
      !appointmentData.time
    ) {
      throw new Error("Missing required fields");
    }

    // Convert date and time to UTC datetime
    const localDateTime = new Date(
      `${appointmentData.date}T${appointmentData.time}`
    );
    const utcDateTime = localDateTime.toISOString();

    const supabase = await createServerClient();

    // First, create or find the patient (only if email is provided)
    let patient;
    if (appointmentData.patient_email) {
      const { data: existingPatient, error: patientFetchError } = await supabase
        .from("patients")
        .select("*")
        .eq("email", appointmentData.patient_email)
        .eq("organization_id", orgId)
        .single();

      if (patientFetchError && patientFetchError.code !== "PGRST116") {
        console.error("Error fetching patient:", patientFetchError);
        throw new Error("Failed to fetch patient");
      }

      if (existingPatient) {
        patient = existingPatient;
      } else {
        // Create new patient
        const { data: newPatient, error: patientCreateError } = await supabase
          .from("patients")
          .insert({
            name: appointmentData.patient_name,
            email: appointmentData.patient_email,
            phone: appointmentData.patient_phone,
            note: appointmentData.patient_note,
            organization_id: orgId,
          })
          .select()
          .single();

        if (patientCreateError) {
          console.error("Error creating patient:", patientCreateError);
          throw new Error("Failed to create patient");
        }

        patient = newPatient;
      }
    } else {
      // Create new patient without email
      const { data: newPatient, error: patientCreateError } = await supabase
        .from("patients")
        .insert({
          name: appointmentData.patient_name,
          phone: appointmentData.patient_phone,
          note: appointmentData.patient_note,
          organization_id: orgId,
        })
        .select()
        .single();

      if (patientCreateError) {
        console.error("Error creating patient:", patientCreateError);
        throw new Error("Failed to create patient");
      }

      patient = newPatient;
    }

    // Create the appointment
    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        patient_id: patient.id,
        doctor_id: appointmentData.doctor_id,
        appointment_datetime: utcDateTime,
        status: appointmentData.status || "confirmed",
        organization_id: orgId,
      });

    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError);
      throw new Error("Failed to create appointment");
    }

    // Revalidate the appointments page and dashboard
    revalidatePath("/appointments");
    revalidatePath("/dashboard");

    // Redirect to appointments page
    redirect("/appointments");
  } catch (error) {
    console.error("Error in createAppointmentAction:", error);
    throw error;
  }
}

// Update appointment status
export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId)
      .eq("organization_id", orgId)
      .select(
        `
        *,
        patient:patients(*)
      `
      )
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      throw new Error("Failed to update appointment");
    }

    if (!data) {
      throw new Error("Appointment not found");
    }

    // Revalidate the appointments page and dashboard
    revalidatePath("/appointments");
    revalidatePath("/dashboard");

    return { success: true, data };
  } catch (error) {
    console.error("Error in updateAppointmentStatusAction:", error);
    throw error;
  }
}

// Delete appointment
export async function deleteAppointmentAction(appointmentId: string) {
  try {
    const { orgId } = await auth();
    if (!orgId) {
      throw new Error("Unauthorized");
    }

    const supabase = await createServerClient();

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointmentId)
      .eq("organization_id", orgId);

    if (error) {
      console.error("Error deleting appointment:", error);
      throw new Error("Failed to delete appointment");
    }

    // Revalidate the appointments page and dashboard
    revalidatePath("/appointments");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteAppointmentAction:", error);
    throw error;
  }
}
