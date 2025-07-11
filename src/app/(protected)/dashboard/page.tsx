import { currentUser } from "@clerk/nextjs/server";
import { Calendar, Users, BarChart3, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { fetchDashboardMetrics, fetchTodaysAppointments } from "./actions";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Fetch real dashboard metrics
  let metrics;
  let appointments = [];
  try {
    metrics = await fetchDashboardMetrics();
    appointments = await fetchTodaysAppointments();
  } catch {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }

  const stats = [
    {
      title: "Today's Appointments",
      value: metrics.todaysAppointments,
      description: undefined, // Optionally add a description if needed
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Patients This Week",
      value: metrics.patientsThisWeek,
      description: undefined,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Doctors",
      value: metrics.totalDoctors,
      description: undefined,
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Pending Appointments",
      value: metrics.pendingAppointments,
      description: undefined,
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here&apos;s what&apos;s happening with your healthcare facility today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appointments Table */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>
              All appointments scheduled for today
            </CardDescription>
            <div className="mt-2">
              <Button /* onClick={openCreateModal} */>
                + Create Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground text-center"
                    >
                      No appointments for today.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt: any) => (
                    <TableRow key={apt.id}>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.patient_name}</TableCell>
                      <TableCell>{apt.doctor_name}</TableCell>
                      <TableCell>{apt.department_name}</TableCell>
                      <TableCell>{apt.status}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                Change Status
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem /* onClick={() => handleChangeStatus(apt.id, 'pending')} */
                                >
                                  Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem /* onClick={() => handleChangeStatus(apt.id, 'confirmed')} */
                                >
                                  Confirmed
                                </DropdownMenuItem>
                                <DropdownMenuItem /* onClick={() => handleChangeStatus(apt.id, 'completed')} */
                                >
                                  Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem /* onClick={() => handleChangeStatus(apt.id, 'cancelled')} */
                                >
                                  Cancelled
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem /* onClick={() => openUpdateModal(apt)} */
                            >
                              Update Appointment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Quick Actions Card remains unchanged */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full rounded bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
              Schedule new appointment
            </button>
            <button className="w-full rounded bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
              Add new patient
            </button>
            <button className="w-full rounded bg-gray-50 p-2 text-left transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600">
              View analytics
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
