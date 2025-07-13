"use client";

import { useEffect, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { updateDoctor } from "@/app/(protected)/doctors/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Doctor } from "@/lib/supabase";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  contact: z.string().optional(),
  specialization: z.string().optional(),
});

interface UpdateDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor;
  onSuccess?: () => void;
}

export function UpdateDoctorModal({
  open,
  onOpenChange,
  doctor,
  onSuccess,
}: UpdateDoctorModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      specialization: "",
    },
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.name,
        contact: doctor.contact || "",
        specialization: doctor.specialization || "",
      });
    }
  }, [doctor, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!doctor) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("contact", data.contact || "");
        formData.append("specialization", data.specialization || "");

        const result = await updateDoctor(doctor.id, formData);

        if (result.success) {
          toast.success("Doctor updated successfully");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || "Something went wrong");
        }
      } catch (error) {
        console.error("Update doctor error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Doctor</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter doctor's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialization</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter specialization" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Doctor"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
