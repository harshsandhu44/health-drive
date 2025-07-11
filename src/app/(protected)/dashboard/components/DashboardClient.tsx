"use client";
import * as React from "react";

import { useAuth } from "@clerk/nextjs";
import { Calendar, Users, UserCheck, Activity } from "lucide-react";

import { CreateAppointmentModal } from "@/components/modals/CreateAppointmentModal";
import { UpdateAppointmentModal } from "@/components/modals/UpdateAppointmentModal";
import { AppointmentsTable } from "@/components/tables/appointments-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalyticsStore } from "@/stores/analytics";
import { useAppointmentsStore, Appointment } from "@/stores/appointments";

interface DashboardClientProps {
  user: any;
  initialMetrics: any;
  initialAppointments: any[];
}

export function DashboardClient({
  user,
  initialMetrics,
  initialAppointments,
}: DashboardClientProps) {
  const { orgId } = useAuth();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<
    Appointment | null
  >(null);

  const {
    dashboardMetrics,
    isLoading: metricsLoading,
    error: metricsError,
    fetchDashboardMetrics,
    subscribeToRealtime: subscribeToAnalytics,
    unsubscribe: unsubscribeAnalytics,
  } = useAnalyticsStore();

  const {
    todaysAppointments,
    isLoading: appointmentsLoading,
    error: appointmentsError,
    fetchTodaysAppointments,
    subscribeToRealtime: subscribeToAppointments,
    unsubscribe: unsubscribeAppointments,
    updateAppointment,
  } = useAppointmentsStore();

  React.useEffect(() => {
    if (!orgId) return;

    fetchDashboardMetrics(orgId);
    fetchTodaysAppointments(orgId);
    subscribeToAnalytics(orgId);
    subscribeToAppointments(orgId);

    return () => {
      unsubscribeAnalytics();
      unsubscribeAppointments();
    };
  }, [orgId]);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus as "scheduled" | "completed" | "cancelled" | "no_show" });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to update appointment status:", error);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setUpdateOpen(true);
  };

  const currentMetrics = dashboardMetrics.todaysAppointments > 0 ? dashboardMetrics : initialMetrics;
  const currentAppointments = todaysAppointments.length > 0 ? todaysAppointments : initialAppointments;

  if (metricsError || appointmentsError) {
    return (
      <div className="text-red-500">
        Error loading dashboard: {metricsError || appointmentsError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here&apos;s what&apos;s happening with your healthcare facility today.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "..." : currentMetrics.todaysAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentMetrics.pendingAppointments} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients This Week</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "..." : currentMetrics.patientsThisWeek}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique patients served
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "..." : currentMetrics.totalDoctors}
            </div>
            <p className="text-xs text-muted-foreground">
              Active practitioners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricsLoading ? "..." : currentMetrics.completedAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              Appointments finished
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Appointments Table */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>
              All appointments scheduled for today with search and filtering
            </CardDescription>
            <div className="mt-2">
              <Button onClick={() => setCreateOpen(true)}>
                + Create Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AppointmentsTable
              data={currentAppointments}
              isLoading={appointmentsLoading}
              onStatusChange={handleStatusChange}
              onEditAppointment={handleEditAppointment}
            />
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCreateOpen(true)}
            >
              Schedule new appointment
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Add patient creation modal
              }}
            >
              Add new patient
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                // TODO: Navigate to analytics page
              }}
            >
              View analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateAppointmentModal open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateAppointmentModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        appointment={selectedAppointment ? {
          patient: selectedAppointment.patient_name,
          doctor: selectedAppointment.doctor_name,
          department: selectedAppointment.department_name,
          date: selectedAppointment.appointment_date,
          time: selectedAppointment.appointment_time,
          status: selectedAppointment.status,
        } : undefined}
      />
    </div>
  );
}