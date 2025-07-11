import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSupabaseClient } from "@/lib/supabase";

const supabase = createSupabaseClient();

export interface Patient {
  id: string;
  phone_number: string;
  name: string;
  date_of_birth: string;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  created_at?: string;
  updated_at?: string;
}

interface SearchCache {
  [query: string]: {
    results: Patient[];
    timestamp: number;
  };
}

interface PatientsState {
  patients: Patient[];
  searchResults: Patient[];
  searchCache: SearchCache;
  searchQuery: string;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  // Actions
  fetchPatients: () => Promise<void>;
  searchPatients: (query: string) => Promise<void>;
  searchByPhone: (phoneNumber: string) => Promise<Patient | null>;
  addPatient: (
    patient: Omit<Patient, "id" | "created_at" | "updated_at">
  ) => Promise<Patient>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  clearSearch: () => void;
  clearCache: () => void;
  setError: (error: string | null) => void;
  clearPatients: () => void;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const usePatientsStore = create<PatientsState>()(
  devtools(
    (set, get) => ({
      patients: [],
      searchResults: [],
      searchCache: {},
      searchQuery: "",
      isLoading: false,
      isSearching: false,
      error: null,

      fetchPatients: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("patients")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) throw error;

          set({ patients: data || [], isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      searchPatients: async (query: string) => {
        if (!query.trim()) {
          set({ searchResults: [], searchQuery: "" });
          return;
        }

        // Check cache first
        const { searchCache } = get();
        const cachedResult = searchCache[query.toLowerCase()];
        const now = Date.now();

        if (cachedResult && now - cachedResult.timestamp < CACHE_EXPIRY) {
          set({
            searchResults: cachedResult.results,
            searchQuery: query,
            isSearching: false,
          });
          return;
        }

        set({ isSearching: true, error: null, searchQuery: query });
        try {
          const { data, error } = await supabase
            .from("patients")
            .select("*")
            .or(`name.ilike.%${query}%,phone_number.ilike.%${query}%`)
            .order("name", { ascending: true })
            .limit(50);

          if (error) throw error;

          const results = data || [];

          // Update cache
          set(state => ({
            searchResults: results,
            searchCache: {
              ...state.searchCache,
              [query.toLowerCase()]: {
                results,
                timestamp: now,
              },
            },
            isSearching: false,
          }));
        } catch (error) {
          set({ error: (error as Error).message, isSearching: false });
        }
      },

      searchByPhone: async (phoneNumber: string) => {
        try {
          const { data, error } = await supabase
            .from("patients")
            .select("*")
            .eq("phone_number", phoneNumber)
            .single();

          if (error) {
            if (error.code === "PGRST116") {
              // No rows returned
              return null;
            }
            throw error;
          }

          return data;
        } catch (error) {
          set({ error: (error as Error).message });
          return null;
        }
      },

      addPatient: async patient => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("patients")
            .insert([patient])
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            patients: [data, ...state.patients],
            isLoading: false,
          }));

          // Clear relevant search cache
          const { searchCache } = get();
          const filteredCache: SearchCache = {};
          Object.keys(searchCache).forEach(key => {
            if (
              !patient.name.toLowerCase().includes(key) &&
              !patient.phone_number.includes(key)
            ) {
              filteredCache[key] = searchCache[key];
            }
          });
          set({ searchCache: filteredCache });

          return data;
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      updatePatient: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("patients")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

          if (error) throw error;

          set(state => ({
            patients: state.patients.map(patient =>
              patient.id === id ? { ...patient, ...data } : patient
            ),
            searchResults: state.searchResults.map(patient =>
              patient.id === id ? { ...patient, ...data } : patient
            ),
            isLoading: false,
          }));

          // Clear search cache as patient data changed
          set({ searchCache: {} });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      deletePatient: async id => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from("patients")
            .delete()
            .eq("id", id);

          if (error) throw error;

          set(state => ({
            patients: state.patients.filter(patient => patient.id !== id),
            searchResults: state.searchResults.filter(
              patient => patient.id !== id
            ),
            isLoading: false,
          }));

          // Clear search cache as patient was deleted
          set({ searchCache: {} });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      clearSearch: () =>
        set({
          searchResults: [],
          searchQuery: "",
          isSearching: false,
        }),

      clearCache: () => set({ searchCache: {} }),

      setError: error => set({ error }),

      clearPatients: () =>
        set({
          patients: [],
          searchResults: [],
          searchCache: {},
          searchQuery: "",
          error: null,
        }),
    }),
    { name: "patients-store" }
  )
);
