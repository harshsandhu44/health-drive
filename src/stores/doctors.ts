import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSupabaseClient } from "@/lib/supabase";

const supabase = createSupabaseClient();

export interface Doctor {
  id: string;
  organization_id: string;
  department_id?: string;
  name: string;
  contact?: string;
  specialization?: string;
  created_at?: string;
  updated_at?: string;
  // Related data for display
  department_name?: string;
}

interface DoctorData {
  id: string;
  organization_id: string;
  department_id?: string;
  name: string;
  contact?: string;
  specialization?: string;
  created_at?: string;
  updated_at?: string;
  departments?: { name: string };
}

interface DoctorsState {
  doctors: Doctor[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDoctors: (organizationId: string) => Promise<void>;
  addDoctor: (
    doctor: Omit<Doctor, "id" | "created_at" | "updated_at">
  ) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  deleteDoctor: (id: string) => Promise<void>;
  getDoctorById: (id: string) => Doctor | undefined;
  getDoctorsByDepartment: (departmentId: string) => Doctor[];
  setError: (error: string | null) => void;
  clearDoctors: () => void;
}

export const useDoctorsStore = create<DoctorsState>()(
  devtools(
    (set, get) => ({
      doctors: [],
      isLoading: false,
      error: null,

      fetchDoctors: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("doctors")
            .select(
              `
              *,
              departments(name)
            `
            )
            .eq("organization_id", organizationId)
            .order("name", { ascending: true });

          if (error) throw error;

          const formattedDoctors =
            (data as DoctorData[])?.map(doctor => ({
              ...doctor,
              department_name: doctor.departments?.name,
            })) || [];

          set({ doctors: formattedDoctors, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      addDoctor: async doctor => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("doctors")
            .insert([doctor])
            .select(
              `
              *,
              departments(name)
            `
            )
            .single();

          if (error) throw error;

          const formattedDoctor = {
            ...data,
            department_name: (data as DoctorData).departments?.name,
          };

          set(state => ({
            doctors: [...state.doctors, formattedDoctor],
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      updateDoctor: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("doctors")
            .update(updates)
            .eq("id", id)
            .select(
              `
              *,
              departments(name)
            `
            )
            .single();

          if (error) throw error;

          const formattedDoctor = {
            ...data,
            department_name: (data as DoctorData).departments?.name,
          };

          set(state => ({
            doctors: state.doctors.map(doctor =>
              doctor.id === id ? { ...doctor, ...formattedDoctor } : doctor
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deleteDoctor: async id => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("doctors")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set(state => ({
            doctors: state.doctors.filter(doctor => doctor.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      getDoctorById: id => {
        const { doctors } = get();
        return doctors.find(doctor => doctor.id === id);
      },

      getDoctorsByDepartment: departmentId => {
        const { doctors } = get();
        return doctors.filter(doctor => doctor.department_id === departmentId);
      },

      setError: error => set({ error }),

      clearDoctors: () =>
        set({
          doctors: [],
          error: null,
        }),
    }),
    { name: "doctors-store" }
  )
);
