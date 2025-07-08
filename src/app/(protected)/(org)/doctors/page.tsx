"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchDoctorsAction } from "@/app/actions";
import { createDoctorColumns } from "@/components/doctors/doctor-columns";
import { NewDoctorModal } from "@/components/doctors/new-doctor-modal";
import { DataTable } from "@/components/ui/data-table";
import { Doctor } from "@/types/appointment";

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

  const handleDoctorCreated = useCallback(() => {
    // Refresh the doctors list after a new doctor is created
    fetchDoctors();
  }, []);

  const handleDoctorUpdated = useCallback(() => {
    // Refresh the doctors list after a doctor is updated
    fetchDoctors();
  }, []);

  const handleDoctorDeleted = useCallback(() => {
    // Refresh the doctors list after a doctor is deleted
    fetchDoctors();
  }, []);

  // Memoize columns with callbacks to prevent unnecessary re-renders
  const doctorColumns = useMemo(
    () => createDoctorColumns(handleDoctorUpdated, handleDoctorDeleted),
    [handleDoctorUpdated, handleDoctorDeleted]
  );

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
