import { PWADebug } from "@/components/shared/pwa-debug";
import { PWAStatus } from "@/components/shared/pwa-status";

export default function DebugPage() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Debug Console</h1>
        <p className="text-muted-foreground">
          Debug tools and diagnostics for development and testing purposes.
        </p>
      </div>

      <div className="grid gap-6">
        <PWAStatus />
        <PWADebug />
      </div>
    </div>
  );
}
