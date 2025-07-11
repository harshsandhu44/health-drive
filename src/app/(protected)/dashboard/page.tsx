// Move React import to the top
"use client";
import * as React from "react";

import { currentUser } from "@clerk/nextjs/server";

import { CreateAppointmentModal } from "@/components/modals/CreateAppointmentModal";
import { UpdateAppointmentModal } from "@/components/modals/UpdateAppointmentModal";
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

import { fetchTodaysAppointments } from "./actions";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    return <div>Not authenticated</div>;
  }
  let appointments = [];
  try {
    appointments = await fetchTodaysAppointments();
  } catch {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }
  return <DashboardClient user={user} appointments={appointments} />;
}

function DashboardClient({
  user,
  appointments,
}: {
  user: any;
  appointments: any[];
}) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<
    any | null
  >(null);

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
      {/* Stats Grid (removed unused stats) */}
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
              <Button onClick={() => setCreateOpen(true)}>
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
                                <DropdownMenuItem>Pending</DropdownMenuItem>
                                <DropdownMenuItem>Confirmed</DropdownMenuItem>
                                <DropdownMenuItem>Completed</DropdownMenuItem>
                                <DropdownMenuItem>Cancelled</DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setUpdateOpen(true);
                              }}
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
      {/* Modals */}
      <CreateAppointmentModal open={createOpen} onOpenChange={setCreateOpen} />
      <UpdateAppointmentModal
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        appointment={selectedAppointment}
      />
    </div>
  );
}
