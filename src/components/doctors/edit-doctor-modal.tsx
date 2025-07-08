"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Doctor } from "@/types/appointment";
import { EditDoctorForm } from "./edit-doctor-form";

interface EditDoctorModalProps {
  doctor: Doctor;
  onDoctorUpdated?: () => void;
  triggerButton?: React.ReactNode;
}

export function EditDoctorModal({
  doctor,
  onDoctorUpdated,
  triggerButton,
}: EditDoctorModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onDoctorUpdated?.();
  };

  const defaultTriggerButton = (
    <Button variant="ghost" size="sm">
      <Edit className="mr-2 h-4 w-4" />
      Edit doctor
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTriggerButton}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <EditDoctorForm doctor={doctor} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
