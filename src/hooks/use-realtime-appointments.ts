"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { useSupabaseClient } from "@/lib/db/client";
import { toast } from "@/lib/toast-with-sound";
import { Appointment } from "@/types/appointment";

interface RealtimeAppointmentsState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

interface UseRealtimeAppointmentsOptions {
  initialAppointments?: Appointment[];
  enableNotifications?: boolean;
  filter?: "today" | "all";
}

export function useRealtimeAppointments({
  initialAppointments = [],
  enableNotifications = true,
  filter = "all",
}: UseRealtimeAppointmentsOptions = {}) {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const supabase = useSupabaseClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

  const [state, setState] = useState<RealtimeAppointmentsState>({
    appointments: initialAppointments,
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const orgId = organization?.id;

  useEffect(() => {
    if (!orgId || !supabase) return;

    let mounted = true;

    const setupRealtimeSubscription = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Get auth token for realtime
        const token = await getToken();
        if (!token) {
          throw new Error("No auth token available");
        }

        // Clean up existing channel
        if (channelRef.current) {
          await supabase.removeChannel(channelRef.current);
        }

        // Create new channel for appointments
        const channel = supabase
          .channel(`appointments:${orgId}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "appointments",
              filter: `organization_id=eq.${orgId}`,
            },
            async (payload) => {
              if (!mounted) return;

              console.info("Realtime appointment change:", payload);

              try {
                if (payload.eventType === "INSERT") {
                  // Handle new appointment
                  const newAppointment = payload.new as Appointment;

                  setState((prev) => ({
                    ...prev,
                    appointments: [...prev.appointments, newAppointment],
                  }));

                  // Show notification for new appointments
                  if (enableNotifications) {
                    if (newAppointment.status === "pending") {
                      toast.info(
                        `New pending appointment for ${
                          newAppointment.patient?.name || "Unknown Patient"
                        }`
                      );
                    } else {
                      toast.success(
                        `New appointment created for ${
                          newAppointment.patient?.name || "Unknown Patient"
                        }`
                      );
                    }
                  }
                } else if (payload.eventType === "UPDATE") {
                  // Handle appointment update
                  const updatedAppointment = payload.new as Appointment;

                  setState((prev) => ({
                    ...prev,
                    appointments: prev.appointments.map((apt) =>
                      apt.id === updatedAppointment.id
                        ? updatedAppointment
                        : apt
                    ),
                  }));

                  // Show notification for status changes
                  if (enableNotifications) {
                    const oldAppointment = payload.old as Appointment;
                    if (oldAppointment.status !== updatedAppointment.status) {
                      toast.info(
                        `Appointment status changed to ${updatedAppointment.status}`
                      );
                    }
                  }
                } else if (payload.eventType === "DELETE") {
                  // Handle appointment deletion
                  const deletedAppointment = payload.old as Appointment;

                  setState((prev) => ({
                    ...prev,
                    appointments: prev.appointments.filter(
                      (apt) => apt.id !== deletedAppointment.id
                    ),
                  }));

                  if (enableNotifications) {
                    toast.info("Appointment deleted");
                  }
                }
              } catch (error) {
                console.error(
                  "Error handling realtime appointment change:",
                  error
                );
              }
            }
          )
          .subscribe(async (status) => {
            if (!mounted) return;

            console.info("Realtime subscription status:", status);

            if (status === "SUBSCRIBED") {
              setState((prev) => ({ ...prev, isConnected: true }));
            } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              setState((prev) => ({
                ...prev,
                isConnected: false,
                error: "Connection error",
              }));
            } else if (status === "CLOSED") {
              setState((prev) => ({ ...prev, isConnected: false }));
            }
          });

        channelRef.current = channel;

        if (mounted) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error setting up realtime subscription:", error);
        if (mounted) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : "Unknown error",
            isConnected: false,
          }));
        }
      }
    };

    setupRealtimeSubscription();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [orgId, supabase, getToken, enableNotifications]);

  // Filter appointments based on the filter option
  const filteredAppointments = state.appointments.filter((appointment) => {
    if (filter === "today") {
      const today = new Date();
      const appointmentDate = new Date(appointment.appointment_datetime);
      return appointmentDate.toDateString() === today.toDateString();
    }
    return true;
  });

  return {
    appointments: filteredAppointments,
    allAppointments: state.appointments,
    isLoading: state.isLoading,
    error: state.error,
    isConnected: state.isConnected,
    refreshConnection: () => {
      // Force reconnection by re-running the effect
      setState((prev) => ({ ...prev, isLoading: true }));
    },
  };
}
