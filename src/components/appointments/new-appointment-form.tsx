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
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  createAppointmentAction,
  createAppointmentModalAction,
  fetchDoctorsAction,
  checkPhoneNumberExistsAction,
} from "@/app/actions";
import { Doctor } from "@/types/appointment";

interface NewAppointmentFormProps {
  doctors: Doctor[];
  onSuccess?: () => void;
}

export function NewAppointmentForm({
  doctors: initialDoctors,
  onSuccess,
}: NewAppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [phoneValidation, setPhoneValidation] = useState<{
    isChecking: boolean;
    exists: boolean;
    message: string;
  }>({ isChecking: false, exists: false, message: "" });

  // Fetch fresh doctors data on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const freshDoctors = await fetchDoctorsAction();
        setDoctors(freshDoctors);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      }
    };

    fetchDoctors();
  }, []);

  // Real-time phone number validation
  useEffect(() => {
    const validatePhoneNumber = async () => {
      // Only validate if phone number has exactly 10 digits (excluding country code and formatting)
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      if (isValidPhoneNumber(phoneNumber)) {
        console.log("**** phoneNumber", phoneNumber, cleanPhone);

        setPhoneValidation({
          isChecking: true,
          exists: false,
          message: "Checking...",
        });

        try {
          const exists = await checkPhoneNumberExistsAction(phoneNumber);
          if (exists) {
            setPhoneValidation({
              isChecking: false,
              exists: true,
              message:
                "A patient with this phone number already exists. Please use the 'Existing Patient' tab.",
            });
          } else {
            setPhoneValidation({
              isChecking: false,
              exists: false,
              message: "Phone number is available",
            });
          }
        } catch (validationError) {
          console.error("Phone validation error:", validationError);
          setPhoneValidation({
            isChecking: false,
            exists: false,
            message: "Unable to validate phone number",
          });
        }
      } else if (cleanPhone.length > 0) {
        setPhoneValidation({
          isChecking: false,
          exists: false,
          message: "",
        });
      } else {
        setPhoneValidation({
          isChecking: false,
          exists: false,
          message: "",
        });
      }
    };

    const timeoutId = setTimeout(validatePhoneNumber, 500);
    return () => clearTimeout(timeoutId);
  }, [phoneNumber]);

  const handleSubmit = async (formData: FormData) => {
    // Prevent submission if phone number already exists
    if (phoneValidation.exists) {
      toast.error("Cannot create appointment. Phone number already exists.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSuccess) {
        // Use modal action if onSuccess is provided (modal context)
        await createAppointmentModalAction(formData);
      } else {
        // Use regular action for page context
        await createAppointmentAction(formData);
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
        <CardTitle>Create New Appointment</CardTitle>
        <CardDescription>
          Fill in the details below to create a new appointment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient_name">Patient Name</Label>
              <Input
                id="patient_name"
                name="patient_name"
                type="text"
                placeholder="Enter patient name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient_email">Patient Email (Optional)</Label>
              <Input
                id="patient_email"
                name="patient_email"
                type="email"
                placeholder="Enter patient email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="patient_phone">Patient Phone</Label>
            <PhoneNumberInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter patient phone number"
              defaultCountry="IN"
            />
            <input
              type="hidden"
              name="patient_phone"
              id="patient_phone"
              value={phoneNumber}
              required
            />
            {phoneValidation.message && (
              <div
                className={`text-sm ${
                  phoneValidation.exists
                    ? "text-red-600"
                    : phoneValidation.isChecking
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {phoneValidation.isChecking && (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                )}
                {phoneValidation.message}
              </div>
            )}
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
            disabled={
              isSubmitting ||
              phoneValidation.exists ||
              phoneValidation.isChecking
            }
          >
            {isSubmitting ? "Creating Appointment..." : "Create Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
