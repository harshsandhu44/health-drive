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
  } catch {
    return <div className="text-red-500">Failed to load dashboard data.</div>;
  }
}

