"use client";

import { useState, useEffect, useTransition } from "react";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { CreateDoctorModal } from "@/components/modals/CreateDoctorModal";
import { UpdateDoctorModal } from "@/components/modals/UpdateDoctorModal";
import { DoctorsTable } from "@/components/tables/doctors-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Doctor } from "@/lib/supabase";

import { fetchDoctors, deleteDoctor } from "./actions";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | undefined>();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [, startTransition] = useTransition();

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      toast.error("Failed to load doctors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setUpdateModalOpen(true);
  };

  const handleDeleteDoctor = (doctorId: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteDoctor(doctorId);
        if (result.success) {
          toast.success("Doctor deleted successfully");
          loadDoctors();
        } else {
          toast.error(result.error || "Failed to delete doctor");
        }
      } catch (error) {
        console.error("Delete doctor error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  const handleSuccess = () => {
    loadDoctors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s doctors
          </p>
        </div>
        <CreateDoctorModal onSuccess={handleSuccess}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </CreateDoctorModal>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorsTable
            data={doctors}
            isLoading={isLoading}
            onEditDoctor={handleEditDoctor}
            onDeleteDoctor={handleDeleteDoctor}
          />
        </CardContent>
      </Card>

      <UpdateDoctorModal
        open={updateModalOpen}
        onOpenChange={setUpdateModalOpen}
        doctor={selectedDoctor}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
