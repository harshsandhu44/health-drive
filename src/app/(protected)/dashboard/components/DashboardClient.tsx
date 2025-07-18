"use client";
import * as React from "react";

import {
  Calendar,
  Users,
  UserCheck,
  Activity,
  PlusCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

import { updateAppointmentStatus } from "../actions";

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  organization_id: string;
  date: string;
  time: string;
  appointment_date: string; // mapped from date
  appointment_time: string; // mapped from time
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patient_phone?: string;
  doctor_name?: string;
  department_name?: string;
}

interface DashboardClientProps {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses?: {
      emailAddress: string;
      id: string;
    }[];
  };
  initialMetrics: {
    todaysAppointments: number;
    patientsThisWeek: number;
    totalDoctors: number;
    completedAppointments: number;
    pendingAppointments: number;
    cancelledAppointments: number;
  };
  initialAppointments: Appointment[];
}

export function DashboardClient({
  user,
  initialMetrics,
  initialAppointments,
}: DashboardClientProps) {
  const router = useRouter();
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Appointment | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: string
  ) => {
    setIsUpdating(true);
    try {
      await updateAppointmentStatus(
        appointmentId,
        newStatus as "pending" | "confirmed" | "completed" | "cancelled"
      );

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update appointment status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setUpdateOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
        <p>
          Here&apos;s what&apos;s happening with your healthcare facility today.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Appointments
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialMetrics.todaysAppointments}
            </div>
            <p className="text-muted-foreground text-xs">
              {initialMetrics.pendingAppointments} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patients This Week
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialMetrics.patientsThisWeek}
            </div>
            <p className="text-muted-foreground text-xs">
              Unique patients served
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <UserCheck className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialMetrics.totalDoctors}
            </div>
            <p className="text-muted-foreground text-xs">
              Active practitioners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Today
            </CardTitle>
            <Activity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {initialMetrics.completedAppointments}
            </div>
            <p className="text-muted-foreground text-xs">
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
            <CreateAppointmentModal>
              <Button variant="outline" className="w-fit">
                <PlusCircleIcon /> Create Appointment
              </Button>
            </CreateAppointmentModal>
          </CardHeader>
          <CardContent>
            <AppointmentsTable
              data={initialAppointments}
              isLoading={isUpdating}
              onStatusChangeAction={handleStatusChange}
              onEditAppointmentAction={handleEditAppointment}
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <UpdateAppointmentModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        appointment={
          selectedAppointment
            ? {
                patient: selectedAppointment.patient_name,
                doctor: selectedAppointment.doctor_name,
                department: selectedAppointment.department_name,
                date: selectedAppointment.appointment_date,
                time: selectedAppointment.appointment_time,
                status: selectedAppointment.status,
              }
            : undefined
        }
      />
    </div>
  );
}
