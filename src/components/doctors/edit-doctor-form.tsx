"use client";

import { useState } from "react";
import { updateDoctorAction } from "@/app/actions";
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
import { toast } from "@/lib/toast-with-sound";
import { Doctor } from "@/types/appointment";

interface EditDoctorFormProps {
  doctor: Doctor;
  onSuccess?: () => void;
}

export function EditDoctorForm({ doctor, onSuccess }: EditDoctorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(doctor.phone_number);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      // Add the phone number to the form data
      formData.set("phone_number", phoneNumber);

      await updateDoctorAction(doctor.id, formData);
      toast.success("Doctor updated successfully!");

      // Call onSuccess callback
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to update doctor");
      console.error("Error updating doctor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Doctor</CardTitle>
        <CardDescription>
          Update the details below to modify the doctor&apos;s information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Doctor Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter doctor's full name"
              defaultValue={doctor.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <PhoneNumberInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter doctor's phone number"
              defaultCountry="IN"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization (Optional)</Label>
            <Input
              id="specialization"
              name="specialization"
              type="text"
              placeholder="e.g., Cardiology, Pediatrics, General Medicine"
              defaultValue={doctor.specialization || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter doctor's address"
              rows={3}
              defaultValue={doctor.address || ""}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating Doctor..." : "Update Doctor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
