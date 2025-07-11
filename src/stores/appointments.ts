import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSupabaseClient } from "@/lib/supabase";

const supabase = createSupabaseClient();

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  organization_id: string;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
  updated_at: string;
  // Related data for display
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
  department_name?: string;
}

interface AppointmentData {
  id: string;
  patient_id: string;
  doctor_id: string;
  organization_id: string;
  appointment_date: string;
  appointment_time: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
  updated_at: string;
  patients?: { name: string; phone: string };
  doctors?: { name: string };
  departments?: { name: string };
}

interface AppointmentsState {
  appointments: Appointment[];
  todaysAppointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  subscription: any;

  // Actions
  fetchAppointments: (organizationId: string) => Promise<void>;
  fetchTodaysAppointments: (organizationId: string) => Promise<void>;
  addAppointment: (
    appointment: Omit<Appointment, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateAppointment: (
    id: string,
    updates: Partial<Appointment>
  ) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  subscribeToRealtime: (organizationId: string) => void;
  unsubscribe: () => void;
  setError: (error: string | null) => void;
  clearAppointments: () => void;
}

export const useAppointmentsStore = create<AppointmentsState>()(
  devtools(
    (set, get) => ({
      appointments: [],
      todaysAppointments: [],
      isLoading: false,
      error: null,
      subscription: null,

      fetchAppointments: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("appointments")
            .select(
              `
              *,
              patients!inner(name, phone),
              doctors!inner(name),
              departments!inner(name)
            `
            )
            .eq("organization_id", organizationId)
            .order("appointment_date", { ascending: true });

          if (error) throw error;

          const formattedAppointments =
            (data as AppointmentData[])?.map(apt => ({
              ...apt,
              patient_name: apt.patients?.name,
              patient_phone: apt.patients?.phone,
              doctor_name: apt.doctors?.name,
              department_name: apt.departments?.name,
            })) || [];

          set({ appointments: formattedAppointments, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchTodaysAppointments: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const today = new Date().toISOString().split("T")[0];

          const { data, error } = await supabase
            .from("appointments")
            .select(
              `
              *,
              patients!inner(name, phone),
              doctors!inner(name),
              departments!inner(name)
            `
            )
            .eq("organization_id", organizationId)
            .eq("appointment_date", today)
            .order("appointment_time", { ascending: true });

          if (error) throw error;

          const formattedAppointments =
            (data as AppointmentData[])?.map(apt => ({
              ...apt,
              patient_name: apt.patients?.name,
              patient_phone: apt.patients?.phone,
              doctor_name: apt.doctors?.name,
              department_name: apt.departments?.name,
            })) || [];

          set({ todaysAppointments: formattedAppointments, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addAppointment: async appointment => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("appointments")
            .insert([appointment])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            appointments: [...state.appointments, data],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateAppointment: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("appointments")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            appointments: state.appointments.map(apt =>
              apt.id === id ? { ...apt, ...data } : apt
            ),
            todaysAppointments: state.todaysAppointments.map(apt =>
              apt.id === id ? { ...apt, ...data } : apt
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deleteAppointment: async id => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("appointments")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set(state => ({
            appointments: state.appointments.filter(apt => apt.id !== id),
            todaysAppointments: state.todaysAppointments.filter(
              apt => apt.id !== id
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      subscribeToRealtime: (organizationId: string) => {
        const { subscription } = get();
        if (subscription) return; // Already subscribed

        const channel = supabase
          .channel("appointments-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "appointments",
              filter: `organization_id=eq.${organizationId}`,
            },
            (payload: any) => {
              console.log("Appointment change:", payload);
              // Refetch data to ensure consistency
              get().fetchAppointments(organizationId);
              get().fetchTodaysAppointments(organizationId);
            }
          )
          .subscribe();

        set({ subscription: channel });
      },

      unsubscribe: () => {
        const { subscription } = get();
        if (subscription) {
          supabase.removeChannel(subscription);
          set({ subscription: null });
        }
      },

      setError: error => set({ error }),

      clearAppointments: () =>
        set({
          appointments: [],
          todaysAppointments: [],
          error: null,
        }),
    }),
    { name: "appointments-store" }
  )
);
