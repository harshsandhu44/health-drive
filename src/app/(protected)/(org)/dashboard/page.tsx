import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

const DashboardPage = async () => {
  const user = await currentUser();

  const appointments = [
    {
      id: "1",
      patient: {
        name: "John Doe",
        phone: "+1234567890",
      },
      doctor: {
        name: "Dr. Jane Smith",
        specialization: "Cardiologist",
      },
      date: new Date(),
      status: "Pending",
    },
    {
      id: "2",
      patient: {
        name: "Jane Doe",
        phone: "+1234567890",
      },
      doctor: {
        name: "Dr. John Smith",
        specialization: "Cardiologist",
      },
      date: new Date(),
      status: "Completed",
    },
    {
      id: "3",
      patient: {
        name: "John Doe",
        phone: "+1234567890",
      },
      doctor: {
        name: "Dr. Jane Smith",
        specialization: "Cardiologist",
      },
      date: new Date(),
      status: "Confirmed",
    },
  ];

  const todayAppointments = appointments.filter(
    (appointment) => appointment.status === "Confirmed"
  );

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>New Appointments</CardTitle>
            <CardDescription>
              Total appointments for the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">54</span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingDownIcon className="size-4" />
                <span>3% decrease</span>
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Patients</CardTitle>
            <CardDescription>
              New patients for the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <span className="text-4xl font-bold">76</span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUpIcon className="size-4" />
                <span>10% increase</span>
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Total doctors in the facility.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-bold">10</span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-none space-y-6">
              {todayAppointments.map((appointment) => {
                const date = format(appointment.date, "MMM d, yyyy");
                const time = format(appointment.date, "hh:mm a");

                return (
                  <li
                    key={appointment.id}
                    className="flex justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold">{appointment.patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {date} {time}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.doctor.specialization}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <ul className="list-none space-y-6">
                {pendingAppointments.map((appointment) => {
                  const date = format(appointment.date, "MMM d, yyyy");
                  const time = format(appointment.date, "hh:mm a");

                  return (
                    <li
                      key={appointment.id}
                      className="flex justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h3 className="font-bold">
                          {appointment.patient.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {date} {time}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctor.specialization}
                        </p>
                        <Badge variant="outline">{appointment.status}</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
