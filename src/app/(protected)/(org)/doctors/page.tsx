"use client";

import { useState, useEffect } from "react";
import { fetchDoctorsAction } from "@/app/actions";
import { DataTable } from "@/components/ui/data-table";
import { doctorColumns } from "@/components/doctors/doctor-columns";
import { Doctor } from "@/types/appointment";
import { NewDoctorModal } from "@/components/doctors/new-doctor-modal";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const fetchedDoctors = await fetchDoctorsAction();
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDoctorCreated = () => {
    // Refresh the doctors list after a new doctor is created
    fetchDoctors();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Doctors</h2>
          <p className="text-muted-foreground">
            View and manage all doctors for your organization.
          </p>
        </div>
        <NewDoctorModal onDoctorCreated={handleDoctorCreated} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Loading doctors...</div>
        </div>
      ) : (
        <DataTable
          columns={doctorColumns}
          data={doctors}
          searchKey="name"
          searchPlaceholder="Search doctors by name..."
        />
      )}
    </div>
  );
};

export default DoctorsPage;
