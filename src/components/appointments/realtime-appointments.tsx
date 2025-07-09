"use client";

import { PlusIcon, WifiOffIcon } from "lucide-react";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { CreateAppointmentModal } from "@/components/appointments/create-appointment-modal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications";
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";
import { Appointment } from "@/types/appointment";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface RealtimeAppointmentsProps {
  initialAppointments: Appointment[];
}

export function RealtimeAppointments({
  initialAppointments,
}: RealtimeAppointmentsProps) {
  const { appointments, isLoading, error, isConnected, refreshConnection } =
    useRealtimeAppointments({
      initialAppointments,
      enableNotifications: true,
      filter: "all",
    });

  // Set up appointment notifications
  useAppointmentNotifications({
    appointments,
    enabled: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">
            View and manage all appointments for your organization.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                ● Live Updates
              </Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Badge
                  variant="destructive"
                  className="bg-red-100 text-red-800"
                >
                  <WifiOffIcon className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshConnection}
                  disabled={isLoading}
                >
                  Reconnect
                </Button>
              </div>
            )}
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
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Error connecting to live updates: {error}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute top-0 right-0 z-10">
            <Badge variant="secondary">Updating...</Badge>
          </div>
        )}

        <DataTable
          columns={appointmentColumns}
          data={appointments}
          searchKey="patient_phone"
          searchPlaceholder="Search patients with phone number..."
        />
      </div>
    </div>
  );
}
