"use client";

import { useState, useEffect, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { AppointmentStatusCards } from "@/components/cards/AppointmentStatusCards";
import { CreateAppointmentFullModal } from "@/components/modals/CreateAppointmentFullModal";
import { UpdateAppointmentFullModal } from "@/components/modals/UpdateAppointmentFullModal";
import { AppointmentsFullTable } from "@/components/tables/appointments-full-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  fetchAppointments,
  fetchAppointmentStats,
  updateAppointmentStatus,
  deleteAppointment,
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
  const [selectedAppointment, setSelectedAppointment] = useState<
    FullAppointment | undefined
  >();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Mock data for now - in real implementation, these would be fetched from the server
  const [patients] = useState([
    { id: "1", name: "John Doe", phone_number: "+1234567890" },
    { id: "2", name: "Jane Smith", phone_number: "+0987654321" },
  ]);

  const [doctors] = useState([
    { id: "1", name: "Dr. Smith", specialization: "Cardiology" },
    { id: "2", name: "Dr. Johnson", specialization: "Pediatrics" },
  ]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsData, statsData] = await Promise.all([
        fetchAppointments(),
        fetchAppointmentStats(),
      ]);
      setAppointments(appointmentsData);
      setAppointmentStats(statsData);
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
    setSelectedAppointment(appointment);
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
        <CreateAppointmentFullModal
          onSuccess={handleSuccess}
          patients={patients}
          doctors={doctors}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </CreateAppointmentFullModal>
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
      <UpdateAppointmentFullModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        appointment={selectedAppointment}
        onSuccess={handleSuccess}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
}
