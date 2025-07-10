import { currentUser } from "@clerk/nextjs/server";
import { fetchTodaysAppointmentsAction } from "@/app/actions";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Appointment } from "@/types/appointment";

const DashboardPageRoute = async () => {
  const user = await currentUser();

  // Fetch today's appointments
  let todaysAppointments: Appointment[] = [];
  try {
    todaysAppointments = await fetchTodaysAppointmentsAction();
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
  }

  return (
    <DashboardPage
      initialAppointments={todaysAppointments}
      userName={user?.firstName || "User"}
    />
  );
};

export default DashboardPageRoute;
