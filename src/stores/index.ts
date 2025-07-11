// Export all stores
export { useAppointmentsStore } from "./appointments";
export type { Appointment } from "./appointments";

export { useAnalyticsStore } from "./analytics";
export type { AnalyticsMetric } from "./analytics";

export { useUIStore } from "./ui";

export { usePatientsStore } from "./patients";
export type { Patient } from "./patients";

export { useAuthStore, useAuthSync } from "./auth";

export { useDoctorsStore } from "./doctors";
export type { Doctor } from "./doctors";
