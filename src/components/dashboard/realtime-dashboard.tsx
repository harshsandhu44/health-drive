"use client";

import { TrendingDownIcon, TrendingUpIcon, WifiOffIcon } from "lucide-react";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications";
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";
import { Appointment } from "@/types/appointment";

interface RealtimeDashboardProps {
  initialAppointments: Appointment[];
  userName?: string;
}

export function RealtimeDashboard({
  initialAppointments,
  userName = "User",
}: RealtimeDashboardProps) {
  const {
    appointments: todaysAppointments,
    allAppointments,
    isLoading,
    error,
    isConnected,
    refreshConnection,
  } = useRealtimeAppointments({
    initialAppointments,
    enableNotifications: true,
    filter: "today",
  });

  // Set up appointment notifications for all appointments
  useAppointmentNotifications({
    appointments: allAppointments,
    enabled: true,
  });

  // Calculate stats from real-time data
  const totalAppointments = todaysAppointments.length;
  const confirmedAppointments = todaysAppointments.filter(
    (apt) => apt.status === "confirmed"
  ).length;
  const pendingAppointments = todaysAppointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const completedAppointments = todaysAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {userName}!</h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your appointments today.
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              ● Live Updates
            </Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="bg-red-100 text-red-800">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Appointments for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedAppointments}</div>
            <p className="text-xs text-muted-foreground">Ready for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>
              View and manage appointments scheduled for today
            </CardDescription>
          </div>
          {isLoading && <Badge variant="secondary">Updating...</Badge>}
        </CardHeader>
        <CardContent>
          <DataTable
            columns={appointmentColumns}
            data={todaysAppointments}
            searchKey="patient_phone"
            searchPlaceholder="Search patients with phone number..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
