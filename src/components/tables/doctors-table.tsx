"use client";

import { DataTable } from "@/components/ui/data-table";
import type { Doctor } from "@/lib/supabase";

import { createDoctorColumns } from "./doctors-columns";

interface DoctorsTableProps {
  data: Doctor[];
  isLoading?: boolean;
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
}

export function DoctorsTable({
  data,
  isLoading = false,
  onEditDoctor,
  onDeleteDoctor,
}: DoctorsTableProps) {
  const columns = createDoctorColumns({
    onEditDoctor,
    onDeleteDoctor,
  });

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search doctors..."
      isLoading={isLoading}
    />
  );
}
