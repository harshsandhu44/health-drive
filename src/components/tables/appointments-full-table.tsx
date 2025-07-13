"use client";

import type { FullAppointment } from "@/app/(protected)/appointments/actions";
import { DataTable } from "@/components/ui/data-table";

import { createFullAppointmentColumns } from "./appointments-full-columns";

interface AppointmentsFullTableProps {
  data: FullAppointment[];
  isLoading?: boolean;
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  onEditAppointment: (appointment: FullAppointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export function AppointmentsFullTable({
  data,
  isLoading = false,
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment,
}: AppointmentsFullTableProps) {
  const columns = createFullAppointmentColumns({
    onStatusChange,
    onEditAppointment,
    onDeleteAppointment,
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
