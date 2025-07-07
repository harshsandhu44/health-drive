"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createExistingPatientAppointmentAction,
  createExistingPatientAppointmentModalAction,
  fetchDoctorsAction,
  fetchPatientsAction,
} from "@/app/actions";
import { Doctor, Patient } from "@/types/appointment";

interface ExistingPatientAppointmentFormProps {
  doctors: Doctor[];
  onSuccess?: () => void;
}

export function ExistingPatientAppointmentForm({
  doctors: initialDoctors,
  onSuccess,
}: ExistingPatientAppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openPatientCombo, setOpenPatientCombo] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");

  // Fetch fresh doctors and patients data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [freshDoctors, freshPatients] = await Promise.all([
          fetchDoctorsAction(),
          fetchPatientsAction(),
        ]);
        setDoctors(freshDoctors);
        setPatients(freshPatients);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  // Search patients when query changes
  useEffect(() => {
    const searchPatients = async () => {
      if (patientSearchQuery.trim()) {
        try {
          const searchResults = await fetchPatientsAction(patientSearchQuery);
          setPatients(searchResults);
        } catch (error) {
          console.error("Error searching patients:", error);
        }
      } else {
        try {
          const allPatients = await fetchPatientsAction();
          setPatients(allPatients);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      }
    };

    const timeoutId = setTimeout(searchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [patientSearchQuery]);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    // Add patient_id to formData
    formData.append("patient_id", selectedPatient.id);

    setIsSubmitting(true);

    try {
      if (onSuccess) {
        // Use modal action if onSuccess is provided (modal context)
        await createExistingPatientAppointmentModalAction(formData);
      } else {
        // Use regular action for page context
        await createExistingPatientAppointmentAction(formData);
      }
      toast.success("Appointment created successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create appointment");
      console.error("Error creating appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Appointment for Existing Patient</CardTitle>
        <CardDescription>
          Select an existing patient and fill in the appointment details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Popover open={openPatientCombo} onOpenChange={setOpenPatientCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPatientCombo}
                  className="w-full justify-between"
                >
                  {selectedPatient ? (
                    <div className="flex flex-col items-start">
                      <span>{selectedPatient.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {selectedPatient.phone}
                        {selectedPatient.email && ` • ${selectedPatient.email}`}
                      </span>
                    </div>
                  ) : (
                    "Select a patient..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search patients by name, phone, or email..."
                    value={patientSearchQuery}
                    onValueChange={setPatientSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No patient found.</CommandEmpty>
                    <CommandGroup>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.name} ${patient.phone} ${
                            patient.email || ""
                          }`}
                          onSelect={() => {
                            setSelectedPatient(patient);
                            setOpenPatientCombo(false);
                          }}
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
                            <span>{patient.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {patient.phone}
                              {patient.email && ` • ${patient.email}`}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment_note">
              Appointment Note (Optional)
            </Label>
            <Textarea
              id="appointment_note"
              name="appointment_note"
              placeholder="Enter any additional notes about the appointment"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctor_id">Doctor</Label>
            <Select name="doctor_id" required>
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
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedPatient}
          >
            {isSubmitting ? "Creating Appointment..." : "Create Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
