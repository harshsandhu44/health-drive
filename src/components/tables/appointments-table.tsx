"use client";

import { DataTable } from "@/components/ui/data-table";
import { Appointment } from "@/stores/appointments";

import { createAppointmentColumns } from "./appointments-columns";

interface AppointmentsTableProps {
  data: Appointment[];
  isLoading?: boolean;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
}

export function AppointmentsTable({
  data,
  isLoading = false,
  onStatusChange,
  onEditAppointment,
}: AppointmentsTableProps) {
  const columns = createAppointmentColumns({
    onStatusChange,
    onEditAppointment,
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="patient_name"
      searchPlaceholder="Search patients..."
      isLoading={isLoading}
    />
  );
}
