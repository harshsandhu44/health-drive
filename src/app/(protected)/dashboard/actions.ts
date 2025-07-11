"use server";

import { currentUser } from "@clerk/nextjs/server";

import { createSupabaseServerClient } from "@/lib/supabase";

export async function fetchDashboardMetrics() {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");
  
  // Get organization_id from Clerk user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organization_id = (user as any).organizationId || (user as any).orgId;
  if (!organization_id) {
    console.error("User object:", user);
    throw new Error("No organization_id found on user");
  }

  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Fetch today's appointments (using correct column name 'date')
  const { data: todaysAppts, error: todaysError } = await supabase
    .from("appointments")
    .select("id")
    .eq("organization_id", organization_id)
    .eq("date", today);
  if (todaysError) throw todaysError;

  // Fetch total doctors
  const { data: doctors, error: doctorsError } = await supabase
    .from("doctors")
    .select("id")
    .eq("organization_id", organization_id);
  if (doctorsError) throw doctorsError;

  // Fetch patients this week (using correct column name 'date')
  const { data: weeklyPatients, error: weeklyError } = await supabase
    .from("appointments")
    .select("patient_id")
    .eq("organization_id", organization_id)
    .gte("date", weekAgo);
  if (weeklyError) throw weeklyError;

  // Fetch appointment status counts
  const { data: allAppts, error: apptsError } = await supabase
    .from("appointments")
    .select("status")
    .eq("organization_id", organization_id);
  if (apptsError) throw apptsError;

  const uniquePatients = new Set(weeklyPatients?.map(p => p.patient_id) || [])
    .size;
  const statusCounts =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allAppts?.reduce((acc: any, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {}) || {};

  return {
    todaysAppointments: todaysAppts?.length || 0,
    patientsThisWeek: uniquePatients,
    totalDoctors: doctors?.length || 0,
    completedAppointments: statusCounts.completed || 0,
    pendingAppointments: statusCounts.pending || 0,
    cancelledAppointments: statusCounts.cancelled || 0,
  };
}

export async function fetchTodaysAppointments() {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");
  
  // Get organization_id from Clerk user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organization_id = (user as any).organizationId || (user as any).orgId;
  if (!organization_id) {
    console.error("User object:", user);
    throw new Error("No organization_id found on user");
  }

  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("appointments")
    .select(
      `*,
      patients!inner(name, phone_number),
      doctors(name),
      departments(name)
    `
    )
    .eq("organization_id", organization_id)
    .eq("date", today)
    .order("time", { ascending: true });

  if (error) throw error;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?.map((apt: any) => ({
      ...apt,
      appointment_date: apt.date,
      appointment_time: apt.time,
      patient_name: apt.patients?.name,
      patient_phone: apt.patients?.phone_number,
      doctor_name: apt.doctors?.name,
      department_name: apt.departments?.name,
    })) || []
  );
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
) {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");
  
  // Get organization_id from Clerk user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const organization_id = (user as any).organizationId || (user as any).orgId;
  if (!organization_id) {
    console.error("User object:", user);
    throw new Error("No organization_id found on user");
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", appointmentId)
    .eq("organization_id", organization_id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
