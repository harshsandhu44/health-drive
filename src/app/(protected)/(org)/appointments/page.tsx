import { fetchAppointmentsAction } from "@/app/actions";
import { RealtimeAppointments } from "@/components/appointments/realtime-appointments";
import { Appointment } from "@/types/appointment";

const AppointmentsPage = async () => {
  // Fetch all appointments
  let appointments: Appointment[] = [];
  try {
    appointments = await fetchAppointmentsAction();
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }

  return <RealtimeAppointments initialAppointments={appointments} />;
};

export default AppointmentsPage;
