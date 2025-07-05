import { fetchAppointmentsAction } from "@/app/actions";
import { DataTable } from "@/components/ui/data-table";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const AppointmentsPage = async () => {
  // Fetch all appointments
  let appointments: Appointment[] = [];
  try {
    appointments = await fetchAppointmentsAction();
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointments</h2>
          <p className="text-muted-foreground">
            View and manage all appointments for your organization.
          </p>
        </div>
        <Button asChild>
          <Link href="/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <DataTable
        columns={appointmentColumns}
        data={appointments}
        searchKey="patient.name"
        searchPlaceholder="Search patients..."
      />
    </div>
  );
};

export default AppointmentsPage;
