import * as React from "react";

import { ExistingPatientAppointment } from "@/components/forms/ExistingPatientAppointment";
import { NewPatientAppointment } from "@/components/forms/NewPatientAppointment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateAppointmentModalProps {
  children: React.ReactNode;
  doctors?: Array<{ id: string; name: string; specialization?: string }>;
  onSuccess?: () => void;
}

export function CreateAppointmentModal({
  children,
  doctors = [],
  onSuccess,
}: CreateAppointmentModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Create an appointment for existing patients or a new patient.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="new">
          <TabsList className="w-full">
            <TabsTrigger value="new">New Patient</TabsTrigger>
            <TabsTrigger value="existing">Existing Patients</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <NewPatientAppointment doctors={doctors} onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="existing">
            <ExistingPatientAppointment
              doctors={doctors}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
