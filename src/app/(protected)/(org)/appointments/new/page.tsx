import { NewAppointmentForm } from "@/components/appointments/new-appointment-form";
import { fetchOrganizationMembersAction } from "@/app/actions";

interface Doctor {
  id: string;
  name: string;
  email: string;
}

const NewAppointmentPage = async () => {
  // Fetch organization members (doctors)
  let doctors: Doctor[] = [];
  try {
    doctors = await fetchOrganizationMembersAction();
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Appointment</h2>
        <p className="text-muted-foreground">
          Create a new appointment. All appointments created here are
          automatically confirmed.
        </p>
      </div>

      <div className="flex justify-center">
        <NewAppointmentForm doctors={doctors} />
      </div>
    </div>
  );
};

export default NewAppointmentPage;
