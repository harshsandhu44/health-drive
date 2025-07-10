import { fetchAppointmentsAction } from "@/app/actions";
import { AppointmentsPage } from "@/components/appointments/appointments-page";
import { Appointment } from "@/types/appointment";

const AppointmentsPageRoute = async () => {
  // Fetch all appointments
  let appointments: Appointment[] = [];
  try {
    appointments = await fetchAppointmentsAction();
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }

  return <AppointmentsPage initialAppointments={appointments} />;
};

export default AppointmentsPageRoute;
