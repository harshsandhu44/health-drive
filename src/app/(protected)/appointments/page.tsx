"use client";

import { useState, useEffect, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { AppointmentStatusCards } from "@/components/cards/AppointmentStatusCards";
import { CreateAppointmentModal } from "@/components/modals/CreateAppointmentModal";
import { UpdateAppointmentModal } from "@/components/modals/UpdateAppointmentModal";
import { AppointmentsFullTable } from "@/components/tables/appointments-full-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  fetchAppointments,
  fetchAppointmentStats,
  updateAppointmentStatus,
  deleteAppointment,
  fetchDoctorsForAppointments,
  type FullAppointment,
} from "./actions";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<FullAppointment[]>([]);
  const [appointmentStats, setAppointmentStats] = useState({
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id?: string;
    patient?: string;
    doctor?: string;
    department?: string;
    date?: string;
    time?: string;
    status?: string;
    notes?: string;
  }>();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<
    Array<{ id: string; name: string; specialization?: string }>
  >([]);
  const [, startTransition] = useTransition();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsData, statsData, doctorsData] = await Promise.all([
        fetchAppointments(),
        fetchAppointmentStats(),
        fetchDoctorsForAppointments(),
      ]);
      setAppointments(appointmentsData);
      setAppointmentStats(statsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Failed to load appointments data:", error);
      toast.error("Failed to load appointments data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(
          appointmentId,
          newStatus as "pending" | "confirmed" | "completed" | "cancelled"
        );
        if (result.success) {
          toast.success("Appointment status updated successfully");
          loadData();
        } else {
          toast.error(result.error || "Failed to update appointment status");
        }
      } catch (error) {
        console.error("Update appointment status error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleEditAppointment = (appointment: FullAppointment) => {
    setSelectedAppointment({
      id: appointment.id,
      patient: appointment.patient_name,
      doctor: appointment.doctor_id,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes,
    });
    setUpdateModalOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteAppointment(appointmentId);
        if (result.success) {
          toast.success("Appointment deleted successfully");
          loadData();
        } else {
          toast.error(result.error || "Failed to delete appointment");
        }
      } catch (error) {
        console.error("Delete appointment error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleSuccess = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s appointments
          </p>
        </div>
        <CreateAppointmentModal doctors={doctors} onSuccess={handleSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </CreateAppointmentModal>
      </div>

      {/* Status Cards */}
      <AppointmentStatusCards stats={appointmentStats} isLoading={isLoading} />

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsFullTable
            data={appointments}
            isLoading={isLoading}
            onStatusChange={handleStatusChange}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </CardContent>
      </Card>

      {/* Update Modal */}
      <UpdateAppointmentModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        appointment={selectedAppointment}
        doctors={doctors}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
