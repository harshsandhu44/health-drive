export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  phone_number: string;
  address?: string;
  organization_id: string;
  patient_ids?: string[];
  specialization?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_datetime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  note?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_email?: string;
  patient_phone: string;
  appointment_note?: string;
  doctor_id: string;
  date: string;
  time: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
}
