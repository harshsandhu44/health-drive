"use client";

import { Appointment } from "@/app/(protected)/dashboard/components/DashboardClient";
import { DataTable } from "@/components/ui/data-table";

import { createAppointmentColumns } from "./appointments-columns";

interface AppointmentsTableProps {
  data: Appointment[];
  isLoading?: boolean;
  onStatusChangeAction: (appointmentId: string, newStatus: string) => void;
  onEditAppointmentAction: (appointment: Appointment) => void;
}

export function AppointmentsTable({
  data,
  isLoading = false,
  onStatusChangeAction,
  onEditAppointmentAction,
}: AppointmentsTableProps) {
  const columns = createAppointmentColumns({
    onStatusChangeAction,
    onEditAppointmentAction,
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
