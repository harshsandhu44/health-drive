"use client";

import { useState, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createAppointment } from "@/app/(protected)/appointments/actions";
import {
  fetchPatients,
  searchPatients,
} from "@/app/(protected)/patients/actions";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  appointment: z.object({
    date: z
      .date()
      .min(new Date())
      .max(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    time: z.string().min(5).max(5),
    doctor: z.string(),
    notes: z.string().optional(),
  }),
});

interface ExistingPatientAppointmentProps {
  doctors?: Array<{ id: string; name: string; specialization?: string }>;
  onSuccess?: () => void;
}

interface Patient {
  id: string;
  name: string;
  phone_number: string;
  date_of_birth: string;
  blood_group: string;
}

export const ExistingPatientAppointment = ({
  doctors = [],
  onSuccess,
}: ExistingPatientAppointmentProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPatientSelectOpen, setIsPatientSelectOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      appointment: {
        date: new Date(),
        time: "10:00",
        doctor: "",
        notes: "",
      },
    },
  });

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientsData = await fetchPatients();
        setPatients(patientsData);
      } catch (error) {
        console.error("Failed to load patients:", error);
      }
    };

    loadPatients();
  }, []);

  const handlePatientSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      const patientsData = await fetchPatients();
      setPatients(patientsData);
      return;
    }

    try {
      const searchResults = await searchPatients(term);
      setPatients(searchResults);
    } catch (error) {
      console.error("Search patients error:", error);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patient_id", patient.id);
    setIsPatientSelectOpen(false);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const appointmentFormData = new FormData();
      appointmentFormData.append("patient_id", data.patient_id);
      appointmentFormData.append("doctor_id", data.appointment.doctor);
      appointmentFormData.append(
        "date",
        data.appointment.date.toISOString().split("T")[0]
      );
      appointmentFormData.append("time", data.appointment.time);
      appointmentFormData.append("notes", data.appointment.notes || "");

      const appointmentResult = await createAppointment(appointmentFormData);

      if (!appointmentResult.success) {
        toast.error(appointmentResult.error || "Failed to create appointment");
        return;
      }

      toast.success("Appointment created successfully!");
      form.reset();
      setSelectedPatient(null);
      onSuccess?.();
    } catch (error) {
      console.error("Create appointment error:", error);
      toast.error("Failed to create appointment");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient Selection */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Patient</FormLabel>
              <Popover
                open={isPatientSelectOpen}
                onOpenChange={setIsPatientSelectOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectedPatient
                        ? `${selectedPatient.name} - ${selectedPatient.phone_number}`
                        : "Select patient..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search patients..."
                      value={searchTerm}
                      onValueChange={handlePatientSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No patients found.</CommandEmpty>
                      <CommandGroup>
                        {patients.map(patient => (
                          <CommandItem
                            key={patient.id}
                            value={patient.id}
                            onSelect={() => handlePatientSelect(patient)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPatient?.id === patient.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-muted-foreground text-sm">
                                {patient.phone_number} • {patient.blood_group}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Appointment Details */}
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

        <FormField
          control={form.control}
          name="appointment.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional notes..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
          <Button type="submit" className="w-full">
            Create Appointment
          </Button>
          <Button variant="outline" className="w-full" onClick={() => {}}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
