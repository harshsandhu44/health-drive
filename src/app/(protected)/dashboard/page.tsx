import { currentUser } from "@clerk/nextjs/server";

import { fetchDashboardMetrics, fetchTodaysAppointments } from "./actions";
import { DashboardClient } from "./components/DashboardClient";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    return <div>Not authenticated</div>;
  }

  try {
    const [dashboardMetrics, appointments] = await Promise.all([
      fetchDashboardMetrics(),
      fetchTodaysAppointments(),
    ]);

    return (
      <DashboardClient
        user={user}
        initialMetrics={dashboardMetrics}
        initialAppointments={appointments}
      />
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="text-red-500">
        <h2>Failed to load dashboard data</h2>
        <details className="mt-2">
          <summary>Error details</summary>
          <pre className="mt-2 text-sm bg-red-50 p-2 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </details>
      </div>
    );
  }
}
