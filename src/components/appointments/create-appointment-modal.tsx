"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { fetchDoctorsAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doctor } from "@/types/appointment";
import { ExistingPatientAppointmentForm } from "./existing-patient-appointment-form";
import { NewAppointmentForm } from "./new-appointment-form";

interface CreateAppointmentModalProps {
  onAppointmentCreated?: () => void;
  triggerButton?: React.ReactNode;
}

export function CreateAppointmentModal({
  onAppointmentCreated,
  triggerButton,
}: CreateAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors when modal opens
  useEffect(() => {
    if (open) {
      const fetchDoctors = async () => {
        try {
          setLoading(true);
          const doctorsData = await fetchDoctorsAction();
          setDoctors(doctorsData);
        } catch (error) {
          console.error("Error fetching doctors:", error);
          toast.error("Failed to load doctors");
        } finally {
          setLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [open]);

  const handleSuccess = () => {
    setOpen(false);
    onAppointmentCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Appointment</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading doctors...</div>
            </div>
          ) : (
            <Tabs defaultValue="new-patient" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new-patient">New Patient</TabsTrigger>
                <TabsTrigger value="existing-patient">
                  Existing Patient
                </TabsTrigger>
              </TabsList>
              <TabsContent value="new-patient" className="mt-4">
                <NewAppointmentForm
                  doctors={doctors}
                  onSuccess={handleSuccess}
                />
              </TabsContent>
              <TabsContent value="existing-patient" className="mt-4">
                <ExistingPatientAppointmentForm
                  doctors={doctors}
                  onSuccess={handleSuccess}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
