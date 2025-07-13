"use client";

import { useState, useEffect } from "react";

import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  totalAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  appointmentsByStatus: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  appointmentsByMonth: {
    month: string;
    appointments: number;
  }[];
  topDoctors: {
    name: string;
    appointments: number;
  }[];
  patientGrowth: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now - in real implementation, this would fetch from the server
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        setAnalytics({
          totalAppointments: 247,
          totalPatients: 156,
          totalDoctors: 8,
          appointmentsByStatus: {
            pending: 23,
            confirmed: 45,
            completed: 167,
            cancelled: 12,
          },
          appointmentsByMonth: [
            { month: "Jan", appointments: 28 },
            { month: "Feb", appointments: 34 },
            { month: "Mar", appointments: 42 },
            { month: "Apr", appointments: 38 },
            { month: "May", appointments: 51 },
            { month: "Jun", appointments: 54 },
          ],
          topDoctors: [
            { name: "Dr. Smith", appointments: 45 },
            { name: "Dr. Johnson", appointments: 38 },
            { name: "Dr. Williams", appointments: 32 },
            { name: "Dr. Brown", appointments: 28 },
            { name: "Dr. Davis", appointments: 24 },
          ],
          patientGrowth: {
            thisMonth: 23,
            lastMonth: 18,
            growth: 27.8,
          },
        });
        setIsLoading(false);
      }, 1000);
    };

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Healthcare facility performance insights
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Card key={`loading-card-${i}`} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-4 w-4 rounded bg-gray-200"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-32 rounded bg-gray-200"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Healthcare facility performance insights
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-center">
              Failed to load analytics data
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Healthcare facility performance insights
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appointments
            </CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalAppointments}
            </div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPatients}</div>
            <p className="text-muted-foreground text-xs">
              +{analytics.patientGrowth.thisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <BarChart3 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDoctors}</div>
            <p className="text-muted-foreground text-xs">
              Active practitioners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patient Growth
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{analytics.patientGrowth.growth.toFixed(1)}%
            </div>
            <p className="text-muted-foreground text-xs">vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Appointment Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {analytics.appointmentsByStatus.completed}
                </Badge>
                <div className="text-muted-foreground text-sm">
                  {(
                    (analytics.appointmentsByStatus.completed /
                      analytics.totalAppointments) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confirmed</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {analytics.appointmentsByStatus.confirmed}
                </Badge>
                <div className="text-muted-foreground text-sm">
                  {(
                    (analytics.appointmentsByStatus.confirmed /
                      analytics.totalAppointments) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {analytics.appointmentsByStatus.pending}
                </Badge>
                <div className="text-muted-foreground text-sm">
                  {(
                    (analytics.appointmentsByStatus.pending /
                      analytics.totalAppointments) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cancelled</span>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  {analytics.appointmentsByStatus.cancelled}
                </Badge>
                <div className="text-muted-foreground text-sm">
                  {(
                    (analytics.appointmentsByStatus.cancelled /
                      analytics.totalAppointments) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Doctors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Doctors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topDoctors.map((doctor, index) => (
              <div
                key={doctor.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{doctor.name}</span>
                </div>
                <Badge variant="outline">
                  {doctor.appointments} appointments
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Appointment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-4">
            {analytics.appointmentsByMonth.map(month => (
              <div key={month.month} className="text-center">
                <div className="text-muted-foreground mb-2 text-sm">
                  {month.month}
                </div>
                <div className="bg-primary/10 flex h-24 items-end justify-center rounded">
                  <div
                    className="bg-primary w-8 rounded-t"
                    style={{
                      height: `${(month.appointments / Math.max(...analytics.appointmentsByMonth.map(m => m.appointments))) * 100}%`,
                      minHeight: "4px",
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-sm font-medium">
                  {month.appointments}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
