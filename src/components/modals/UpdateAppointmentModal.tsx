import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface UpdateAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    patient?: string;
    doctor?: string;
    department?: string;
    date?: string;
    time?: string;
    status?: string;
  };
}

export function UpdateAppointmentModal({
  open,
  onOpenChange,
  appointment,
}: UpdateAppointmentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Appointment</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <Input
            placeholder="Patient"
            name="patient"
            defaultValue={appointment?.patient}
          />
          <Input
            placeholder="Doctor"
            name="doctor"
            defaultValue={appointment?.doctor}
          />
          <Input
            placeholder="Department"
            name="department"
            defaultValue={appointment?.department}
          />
          <Input type="date" name="date" defaultValue={appointment?.date} />
          <Input type="time" name="time" defaultValue={appointment?.time} />
          <Select name="status" defaultValue={appointment?.status || "pending"}>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
