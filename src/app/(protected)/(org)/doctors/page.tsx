import { fetchDoctorsAction } from "@/app/actions";
import { DataTable } from "@/components/ui/data-table";
import { doctorColumns } from "@/components/doctors/doctor-columns";
import { Doctor } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DoctorsPage = async () => {
  // Fetch all doctors
  let doctors: Doctor[] = [];
  try {
    doctors = await fetchDoctorsAction();
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Doctors</h2>
          <p className="text-muted-foreground">
            View and manage all doctors for your organization.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Doctor
        </Button>
      </div>

      <DataTable
        columns={doctorColumns}
        data={doctors}
        searchKey="name"
        searchPlaceholder="Search doctors by name..."
      />
    </div>
  );
};

export default DoctorsPage;
