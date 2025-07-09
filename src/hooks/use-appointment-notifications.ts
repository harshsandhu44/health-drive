"use client";

import { useEffect, useRef } from "react";
import { toast } from "@/lib/toast-with-sound";
import { Appointment } from "@/types/appointment";

interface UseAppointmentNotificationsOptions {
  appointments: Appointment[];
  enabled?: boolean;
}

export function useAppointmentNotifications({
  appointments,
  enabled = true,
}: UseAppointmentNotificationsOptions) {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (!enabled || !appointments.length) {return;}

    const now = new Date();
    const timers = timersRef.current;

    // Clear existing timers
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();

    appointments.forEach((appointment) => {
      const appointmentTime = new Date(appointment.appointment_datetime);
      const appointmentId = appointment.id;

      // Skip past appointments
      if (appointmentTime <= now) {return;}

      const timeDiff = appointmentTime.getTime() - now.getTime();

      // For pending appointments: notifications at 24h and 12h before
      if (appointment.status === "pending") {
        // 24 hours before (in milliseconds: 24 * 60 * 60 * 1000)
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const twelveHours = 12 * 60 * 60 * 1000;

        if (timeDiff > twentyFourHours) {
          const timer24h = setTimeout(() => {
            toast.info(
              `⏰ Reminder: Pending appointment with ${
                appointment.doctor?.name || "Doctor"
              } in 24 hours (${appointmentTime.toLocaleString()})`
            );
          }, timeDiff - twentyFourHours);

          timers.set(`${appointmentId}-24h`, timer24h);
        }

        if (timeDiff > twelveHours) {
          const timer12h = setTimeout(() => {
            toast.warning(
              `⏰ Reminder: Pending appointment with ${
                appointment.doctor?.name || "Doctor"
              } in 12 hours (${appointmentTime.toLocaleString()})`
            );
          }, timeDiff - twelveHours);

          timers.set(`${appointmentId}-12h`, timer12h);
        }
      }

      // For confirmed appointments: notifications at 1h, 30min before and at appointment time
      if (appointment.status === "confirmed") {
        const oneHour = 60 * 60 * 1000;
        const thirtyMinutes = 30 * 60 * 1000;

        if (timeDiff > oneHour) {
          const timer1h = setTimeout(() => {
            toast.info(
              `🏥 Appointment reminder: See ${
                appointment.doctor?.name || "Doctor"
              } in 1 hour (${appointmentTime.toLocaleString()})`
            );
          }, timeDiff - oneHour);

          timers.set(`${appointmentId}-1h`, timer1h);
        }

        if (timeDiff > thirtyMinutes) {
          const timer30m = setTimeout(() => {
            toast.warning(
              `🏥 Appointment reminder: See ${
                appointment.doctor?.name || "Doctor"
              } in 30 minutes (${appointmentTime.toLocaleString()})`
            );
          }, timeDiff - thirtyMinutes);

          timers.set(`${appointmentId}-30m`, timer30m);
        }

        // At appointment time
        const timerNow = setTimeout(() => {
          toast.success(
            `🏥 Your appointment with ${
              appointment.doctor?.name || "Doctor"
            } is starting now!`
          );
        }, timeDiff);

        timers.set(`${appointmentId}-now`, timerNow);
      }
    });

    // Cleanup function
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [appointments, enabled]);

  // Manual cleanup function
  const clearAllNotifications = () => {
    const timers = timersRef.current;
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  };

  return {
    clearAllNotifications,
  };
}
