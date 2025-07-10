"use client";

import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Appointment } from "@/types/appointment";

interface DashboardPageProps {
  initialAppointments: Appointment[];
  userName?: string;
}

export function DashboardPage({
  initialAppointments,
  userName = "User",
}: DashboardPageProps) {
  // Calculate stats from appointments data
  const totalAppointments = initialAppointments.length;
  const confirmedAppointments = initialAppointments.filter(
    (apt) => apt.status === "confirmed"
  ).length;
  const pendingAppointments = initialAppointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const completedAppointments = initialAppointments.filter(
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedAppointments}</div>
            <p className="text-xs text-muted-foreground">Ready to go</p>
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
        <CardHeader>
          <CardTitle>Today&apos;s Appointments</CardTitle>
          <CardDescription>
            View and manage appointments scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={appointmentColumns}
            data={initialAppointments}
            searchKey="patient_phone"
            searchPlaceholder="Search patients with phone number..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
