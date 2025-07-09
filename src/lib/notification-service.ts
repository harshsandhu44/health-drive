"use client";

import { Appointment } from "@/types/appointment";

interface NotificationData {
  title: string;
  body: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  tag?: string;
}

export class NotificationService {
  private static instance: NotificationService | null = null;

  static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = new NotificationService();
    }
    return this.instance;
  }

  private constructor() {}

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  async showNotification(data: NotificationData): Promise<boolean> {
    if (!("Notification" in window)) {
      return false;
    }

    if (Notification.permission !== "granted") {
      const granted = await this.requestPermission();
      if (!granted) {
        return false;
      }
    }

    try {
      new Notification(data.title, {
        body: data.body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: data.tag || "healthdrive-notification",
        data: data.data,
        requireInteraction: false,
      });
      return true;
    } catch (error) {
      console.error("Error showing notification:", error);
      return false;
    }
  }

  scheduleAppointmentReminders(appointment: Appointment): void {
    const appointmentTime = new Date(appointment.appointment_datetime);
    const now = new Date();

    // Skip past appointments
    if (appointmentTime <= now) {
      return;
    }

    const timeDiff = appointmentTime.getTime() - now.getTime();
    const appointmentId = appointment.id;
    const doctorName = appointment.doctor?.name || "Doctor";
    const patientName = appointment.patient?.name || "Unknown Patient";

    // For pending appointments: notifications at 24h and 12h before
    if (appointment.status === "pending") {
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const twelveHours = 12 * 60 * 60 * 1000;

      if (timeDiff > twentyFourHours) {
        setTimeout(() => {
          this.showNotification({
            title: "Pending Appointment Reminder",
            body: `Appointment with ${doctorName} for ${patientName} in 24 hours`,
            tag: `${appointmentId}-24h`,
            data: { appointmentId, type: "24h-reminder" },
          });
        }, timeDiff - twentyFourHours);
      }

      if (timeDiff > twelveHours) {
        setTimeout(() => {
          this.showNotification({
            title: "Pending Appointment Reminder",
            body: `Appointment with ${doctorName} for ${patientName} in 12 hours`,
            tag: `${appointmentId}-12h`,
            data: { appointmentId, type: "12h-reminder" },
          });
        }, timeDiff - twelveHours);
      }
    }

    // For confirmed appointments: notifications at 1h, 30min before and at appointment time
    if (appointment.status === "confirmed") {
      const oneHour = 60 * 60 * 1000;
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeDiff > oneHour) {
        setTimeout(() => {
          this.showNotification({
            title: "Appointment Reminder",
            body: `Appointment with ${doctorName} for ${patientName} in 1 hour`,
            tag: `${appointmentId}-1h`,
            data: { appointmentId, type: "1h-reminder" },
          });
        }, timeDiff - oneHour);
      }

      if (timeDiff > thirtyMinutes) {
        setTimeout(() => {
          this.showNotification({
            title: "Appointment Reminder",
            body: `Appointment with ${doctorName} for ${patientName} in 30 minutes`,
            tag: `${appointmentId}-30m`,
            data: { appointmentId, type: "30m-reminder" },
          });
        }, timeDiff - thirtyMinutes);
      }

      // At appointment time
      setTimeout(() => {
        this.showNotification({
          title: "Appointment Starting",
          body: `Appointment with ${doctorName} for ${patientName} is starting now!`,
          tag: `${appointmentId}-now`,
          data: { appointmentId, type: "appointment-start" },
        });
      }, timeDiff);
    }
  }

  async showNewAppointmentNotification(
    appointment: Appointment
  ): Promise<void> {
    const doctorName = appointment.doctor?.name || "Doctor";
    const patientName = appointment.patient?.name || "Unknown Patient";
    const status = appointment.status;

    await this.showNotification({
      title: "New Appointment Created",
      body: `${
        status === "pending" ? "Pending" : "Confirmed"
      } appointment for ${patientName} with ${doctorName}`,
      tag: `new-appointment-${appointment.id}`,
      data: { appointmentId: appointment.id, type: "new-appointment" },
    });
  }

  async showAppointmentStatusChangeNotification(
    appointment: Appointment,
    oldStatus: string
  ): Promise<void> {
    const doctorName = appointment.doctor?.name || "Doctor";
    const patientName = appointment.patient?.name || "Unknown Patient";

    await this.showNotification({
      title: "Appointment Status Changed",
      body: `Appointment for ${patientName} with ${doctorName} changed from ${oldStatus} to ${appointment.status}`,
      tag: `status-change-${appointment.id}`,
      data: { appointmentId: appointment.id, type: "status-change" },
    });
  }
}
