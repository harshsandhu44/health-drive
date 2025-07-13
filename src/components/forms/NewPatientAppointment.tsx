"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { toast } from "sonner";
import * as z from "zod";

import { createAppointment } from "@/app/(protected)/appointments/actions";
import { createPatient } from "@/app/(protected)/patients/actions";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as CONSTANTS from "@/lib/contants";
import { isValidBloodGroup, isValideDateOfBirth } from "@/lib/utils";

const formSchema = z.object({
  patient: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().refine(val => isValidPhoneNumber(val), {
      message: "Invalid phone number",
    }),
    dateOfBirth: z.date().refine(val => isValideDateOfBirth(val), {
      message: "Invalid date of birth",
    }),
    bloodGroup: z.string().refine(val => isValidBloodGroup(val), {
      message: "Invalid blood group",
    }),
  }),
  appointment: z.object({
    date: z
      .date()
      .min(new Date())
      .max(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    time: z.string().min(5).max(5),
    doctor: z.string(),
  }),
});

interface NewPatientAppointmentProps {
  doctors?: Array<{ id: string; name: string; specialization?: string }>;
  onSuccess?: () => void;
}

export const NewPatientAppointment = ({
  doctors = [],
  onSuccess,
}: NewPatientAppointmentProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient: {
        name: "",
        phone: "",
        dateOfBirth: new Date(),
        bloodGroup: "",
      },
      appointment: {
        date: new Date(),
        time: "10:00",
        doctor: "",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // First create the patient
      const patientFormData = new FormData();
      patientFormData.append("name", data.patient.name);
      patientFormData.append("phone_number", data.patient.phone);
      patientFormData.append(
        "date_of_birth",
        data.patient.dateOfBirth.toISOString().split("T")[0]
      );
      patientFormData.append("blood_group", data.patient.bloodGroup);

      const patientResult = await createPatient(patientFormData);

      if (!patientResult.success || !patientResult.patient) {
        toast.error(patientResult.error || "Failed to create patient");
        return;
      }

      // Then create the appointment with the new patient
      const appointmentFormData = new FormData();
      appointmentFormData.append("patient_id", patientResult.patient.id);
      appointmentFormData.append("doctor_id", data.appointment.doctor);
      appointmentFormData.append(
        "date",
        data.appointment.date.toISOString().split("T")[0]
      );
      appointmentFormData.append("time", data.appointment.time);
      appointmentFormData.append("notes", "");

      const appointmentResult = await createAppointment(appointmentFormData);

      if (!appointmentResult.success) {
        toast.error(appointmentResult.error || "Failed to create appointment");
        return;
      }

      toast.success("Patient and appointment created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Create patient appointment error:", error);
      toast.error("Failed to create patient and appointment");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patient.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient.dateOfBirth"
            render={() => (
              <FormItem>
                <FormLabel>Patient Date of Birth</FormLabel>
                <Controller
                  name="patient.dateOfBirth"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      showMonthYearPicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select birth date"
                      maxDate={new Date()}
                      dateFormat="PPP"
                      inputDateFormat="yyyy-MM-dd"
                      error={!!form.formState.errors.patient?.dateOfBirth}
                      errorMessage={
                        form.formState.errors.patient?.dateOfBirth?.message
                      }
                      inputProps={{
                        id: "birth-date",
                        name: field.name,
                      }}
                    />
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient.bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Blood Group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONSTANTS.BLOOD_GROUPS.map(group => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="appointment.date"
            render={() => (
              <FormItem>
                <FormLabel>Appointment Date</FormLabel>
                <Controller
                  name="appointment.date"
                  control={form.control}
                  render={({ field }) => (
                    <DateInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select appointment date"
                      minDate={new Date()}
                      dateFormat="PPP"
                      inputDateFormat="yyyy-MM-dd"
                      error={!!form.formState.errors.appointment?.date}
                      errorMessage={
                        form.formState.errors.appointment?.date?.message
                      }
                      inputProps={{
                        id: "appointment-date",
                        name: field.name,
                      }}
                    />
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointment.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    placeholder="Select appointment time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="appointment.doctor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}{" "}
                      {doctor.specialization && `- ${doctor.specialization}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          <Button type="submit" className="w-full">
            Create
          </Button>

          <Button variant="outline" className="w-full" onClick={() => {}}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
