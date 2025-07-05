export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  organization_id: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  date: string;
  time: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}
