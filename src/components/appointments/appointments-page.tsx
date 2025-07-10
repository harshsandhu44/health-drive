"use client";

import { PlusIcon } from "lucide-react";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { CreateAppointmentModal } from "@/components/appointments/create-appointment-modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Appointment } from "@/types/appointment";

interface AppointmentsPageProps {
  initialAppointments: Appointment[];
}

export function AppointmentsPage({
  initialAppointments,
}: AppointmentsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">
            View and manage all appointments for your organization.
          </p>
        </div>

        <CreateAppointmentModal
          triggerButton={
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          }
        />
      </div>

      <DataTable
        columns={appointmentColumns}
        data={initialAppointments}
        searchKey="patient_phone"
        searchPlaceholder="Search patients with phone number..."
      />
    </div>
  );
}
