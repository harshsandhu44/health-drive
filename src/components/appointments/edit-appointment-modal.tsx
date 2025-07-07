"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Edit2 } from "lucide-react";
import { toast } from "sonner";
import { fetchDoctorsAction, updateAppointmentAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Doctor, Appointment } from "@/types/appointment";

interface EditAppointmentModalProps {
  appointment: Appointment;
  onAppointmentUpdated?: () => void;
  triggerButton?: React.ReactNode;
}

export function EditAppointmentModal({
  appointment,
  onAppointmentUpdated,
  triggerButton,
}: EditAppointmentModalProps) {
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    onAppointmentUpdated?.();
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const appointmentNote = formData.get("appointment_note") as string;
      const doctorId = formData.get("doctor_id") as string;
      const date = formData.get("date") as string;
      const time = formData.get("time") as string;

      // Validate required fields
      if (!doctorId || !date || !time) {
        throw new Error("Missing required fields");
      }

      // Convert date and time to UTC datetime
      const localDateTime = new Date(`${date}T${time}`);
      const utcDateTime = localDateTime.toISOString();

      // For now, let's create a simple update using the existing action
      // We'll need to create a proper update action in actions.ts
      await updateAppointmentAction(
        appointment.id,
        doctorId,
        utcDateTime,
        appointmentNote || undefined
      );

      toast.success("Appointment updated successfully!");
      handleSuccess();
    } catch (error) {
      toast.error("Failed to update appointment");
      console.error("Error updating appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract date and time from appointment datetime
  const appointmentDate = appointment.appointment_datetime
    ? format(new Date(appointment.appointment_datetime), "yyyy-MM-dd")
    : "";
  const appointmentTime = appointment.appointment_datetime
    ? format(new Date(appointment.appointment_datetime), "HH:mm")
    : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading doctors...</div>
            </div>
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Edit Appointment Details</CardTitle>
                <CardDescription>
                  Update the appointment information for{" "}
                  {appointment.patient?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleSubmit} className="space-y-6">
                  {/* Patient Info - Read Only */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Patient Name</Label>
                      <Input
                        value={appointment.patient?.name || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Patient Phone</Label>
                      <Input
                        value={appointment.patient?.phone || ""}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointment_note">
                      Appointment Note (Optional)
                    </Label>
                    <Textarea
                      id="appointment_note"
                      name="appointment_note"
                      defaultValue={appointment.note || ""}
                      placeholder="Enter any additional notes about the appointment"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor_id">Doctor</Label>
                    <Select
                      name="doctor_id"
                      required
                      defaultValue={appointment.doctor_id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex flex-col">
                              <span>{doctor.name}</span>
                              {doctor.specialization && (
                                <span className="text-xs text-muted-foreground">
                                  {doctor.specialization}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        required
                        defaultValue={appointmentDate}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        required
                        defaultValue={appointmentTime}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Updating Appointment..."
                      : "Update Appointment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
