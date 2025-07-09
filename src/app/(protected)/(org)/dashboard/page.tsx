import { currentUser } from "@clerk/nextjs/server";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { fetchTodaysAppointmentsAction } from "@/app/actions";
import { appointmentColumns } from "@/components/appointments/appointment-columns";
import { PWADebug } from "@/components/shared/pwa-debug";
import { PWAStatus } from "@/components/shared/pwa-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
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

  // Calculate stats
  const totalAppointments = todaysAppointments.length;
  const confirmedAppointments = todaysAppointments.filter(
    (apt) => apt.status === "confirmed"
  ).length;
  const pendingAppointments = todaysAppointments.filter(
    (apt) => apt.status === "pending"
  ).length;
  const completedAppointments = todaysAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your appointments today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Appointments for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedAppointments}</div>
            <p className="text-xs text-muted-foreground">Ready for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Finished today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>
              View and manage appointments scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={appointmentColumns}
              data={todaysAppointments}
              searchKey="patient_phone"
              searchPlaceholder="Search patients with phone number..."
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <PWAStatus />
          <PWADebug />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
