import { currentUser } from "@clerk/nextjs/server";
import { fetchTodaysAppointmentsAction } from "@/app/actions";
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard";
import { Appointment } from "@/types/appointment";

const DashboardPage = async () => {
  const user = await currentUser();

  // Fetch today's appointments
  let todaysAppointments: Appointment[] = [];
  try {
    todaysAppointments = await fetchTodaysAppointmentsAction();
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }

  return (
    <RealtimeDashboard
      initialAppointments={todaysAppointments}
      userName={user?.firstName || "User"}
    />
  );
};

export default DashboardPage;
