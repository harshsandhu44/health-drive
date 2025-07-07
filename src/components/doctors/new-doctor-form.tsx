"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { createDoctorAction } from "@/app/actions";

interface NewDoctorFormProps {
  onSuccess?: () => void;
}

export function NewDoctorForm({ onSuccess }: NewDoctorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      // Add the phone number to the form data
      formData.set("phone_number", phoneNumber);

      await createDoctorAction(formData);
      toast.success("Doctor created successfully!");

      // Reset form
      setPhoneNumber("");
      const form = document.getElementById("doctor-form") as HTMLFormElement;
      form?.reset();

      // Call onSuccess callback
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create doctor");
      console.error("Error creating doctor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Doctor</CardTitle>
        <CardDescription>
          Fill in the details below to add a new doctor to your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="doctor-form" action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Doctor Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter doctor's full name"
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter doctor's address"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Doctor..." : "Create Doctor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
