import { currentUser } from "@clerk/nextjs/server";
import { Calendar, Users, BarChart3, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // TODO: Replace with actual data from Supabase
  const stats = [
    {
      title: "Today's Appointments",
      value: "12",
      description: "3 more than yesterday",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Total Patients",
      value: "1,234",
      description: "Active patients this month",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Total Doctors",
      value: "23",
      description: "Available doctors",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Pending Appointments",
      value: "5",
      description: "Awaiting confirmation",
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
          Here's what's happening with your healthcare facility today.
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              Latest appointments scheduled today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              No appointments data available. Connect to Supabase to see real
              data.
            </div>
          </CardContent>
        </Card>

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
