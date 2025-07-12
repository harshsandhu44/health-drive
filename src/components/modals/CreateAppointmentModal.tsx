import * as React from "react";

import { NewPatientForm } from "@/components/forms/NewPatientForm";
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
}

export function CreateAppointmentModal({
  children,
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
            <NewPatientForm />
          </TabsContent>
          <TabsContent value="existing">Existing Patients</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
