import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createSupabaseClient } from "@/lib/supabase";

const supabase = createSupabaseClient();

export interface AnalyticsMetric {
  id: string;
  organization_id: string;
  metric_type:
    | "total_appointments"
    | "appointments_per_doctor"
    | "returning_patients";
  value: number;
  timestamp: string;
}

interface DashboardMetrics {
  todaysAppointments: number;
  patientsThisWeek: number;
  totalDoctors: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}

interface DoctorAppointmentStats {
  doctor_id: string;
  doctor_name: string;
  total_appointments: number;
  completed_appointments: number;
  pending_appointments: number;
}

interface AnalyticsState {
  metrics: AnalyticsMetric[];
  dashboardMetrics: DashboardMetrics;
  doctorStats: DoctorAppointmentStats[];
  isLoading: boolean;
  error: string | null;
  subscription: any;

  // Actions
  fetchDashboardMetrics: (organizationId: string) => Promise<void>;
  fetchDoctorStats: (organizationId: string) => Promise<void>;
  fetchAnalyticsLogs: (organizationId: string) => Promise<void>;
  logMetric: (
    metric: Omit<AnalyticsMetric, "id" | "timestamp">
  ) => Promise<void>;
  subscribeToRealtime: (organizationId: string) => void;
  unsubscribe: () => void;
  setError: (error: string | null) => void;
  clearAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
  devtools(
    (set, get) => ({
      metrics: [],
      dashboardMetrics: {
        todaysAppointments: 0,
        patientsThisWeek: 0,
        totalDoctors: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0,
      },
      doctorStats: [],
      isLoading: false,
      error: null,
      subscription: null,

      fetchDashboardMetrics: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const today = new Date().toISOString().split("T")[0];
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

          // Fetch today's appointments
          const { data: todaysAppts, error: todaysError } = await supabase
            .from("appointments")
            .select("id")
            .eq("organization_id", organizationId)
            .eq("appointment_date", today);

          if (todaysError) throw todaysError;

          // Fetch total doctors
          const { data: doctors, error: doctorsError } = await supabase
            .from("doctors")
            .select("id")
            .eq("organization_id", organizationId);

          if (doctorsError) throw doctorsError;

          // Fetch patients this week
          const { data: weeklyPatients, error: weeklyError } = await supabase
            .from("appointments")
            .select("patient_id")
            .eq("organization_id", organizationId)
            .gte("appointment_date", weekAgo);

          if (weeklyError) throw weeklyError;

          // Fetch appointment status counts
          const { data: allAppts, error: apptsError } = await supabase
            .from("appointments")
            .select("status")
            .eq("organization_id", organizationId);

          if (apptsError) throw apptsError;

          const uniquePatients = new Set(
            weeklyPatients?.map(p => p.patient_id) || []
          ).size;
          const statusCounts =
            allAppts?.reduce((acc: any, apt) => {
              acc[apt.status] = (acc[apt.status] || 0) + 1;
              return acc;
            }, {}) || {};

          const dashboardMetrics: DashboardMetrics = {
            todaysAppointments: todaysAppts?.length || 0,
            patientsThisWeek: uniquePatients,
            totalDoctors: doctors?.length || 0,
            completedAppointments: statusCounts.completed || 0,
            pendingAppointments: statusCounts.pending || 0,
            cancelledAppointments: statusCounts.cancelled || 0,
          };

          set({ dashboardMetrics, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchDoctorStats: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("appointments")
            .select(
              `
              doctor_id,
              status,
              doctors!inner(name)
            `
            )
            .eq("organization_id", organizationId);

          if (error) throw error;

          const doctorStatsMap = new Map<string, DoctorAppointmentStats>();

          data?.forEach((apt: any) => {
            const doctorId = apt.doctor_id;
            if (!doctorStatsMap.has(doctorId)) {
              doctorStatsMap.set(doctorId, {
                doctor_id: doctorId,
                doctor_name: apt.doctors?.name || "Unknown",
                total_appointments: 0,
                completed_appointments: 0,
                pending_appointments: 0,
              });
            }

            const stats = doctorStatsMap.get(doctorId)!;
            stats.total_appointments++;
            if (apt.status === "completed") stats.completed_appointments++;
            if (apt.status === "pending") stats.pending_appointments++;
          });

          const doctorStats = Array.from(doctorStatsMap.values());
          set({ doctorStats, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      fetchAnalyticsLogs: async (organizationId: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("analytics_logs")
            .select("*")
            .eq("organization_id", organizationId)
            .order("timestamp", { ascending: false })
            .limit(100);

          if (error) throw error;

          set({ metrics: data || [], isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
        }
      },

      logMetric: async metric => {
        try {
          const { error } = await supabase.from("analytics_logs").insert([
            {
              ...metric,
              timestamp: new Date().toISOString(),
            },
          ]);

          if (error) throw error;
        } catch (error) {
          set({ error: (error as Error).message });
        }
      },

      subscribeToRealtime: (organizationId: string) => {
        const { subscription } = get();
        if (subscription) return; // Already subscribed

        const channel = supabase
          .channel("analytics-changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "analytics_logs",
              filter: `organization_id=eq.${organizationId}`,
            },
            (payload: any) => {
              console.log("Analytics change:", payload);
              // Refetch data to ensure consistency
              get().fetchAnalyticsLogs(organizationId);
              get().fetchDashboardMetrics(organizationId);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "appointments",
              filter: `organization_id=eq.${organizationId}`,
            },
            () => {
              // Refresh dashboard metrics when appointments change
              get().fetchDashboardMetrics(organizationId);
              get().fetchDoctorStats(organizationId);
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

      clearAnalytics: () =>
        set({
          metrics: [],
          dashboardMetrics: {
            todaysAppointments: 0,
            patientsThisWeek: 0,
            totalDoctors: 0,
            completedAppointments: 0,
            pendingAppointments: 0,
            cancelledAppointments: 0,
          },
          doctorStats: [],
          error: null,
        }),
    }),
    { name: "analytics-store" }
  )
);
