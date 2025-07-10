import { PWADebug } from "@/components/pwa/pwa-debug";
import { PWAStatus } from "@/components/pwa/pwa-status";

export default function DebugPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">PWA Debug Console</h1>
        <p className="text-muted-foreground">
          Debug tools and diagnostics for Progressive Web App functionality and
          push notifications. This page is separate from the main app for
          testing purposes.
        </p>
      </div>

      <div className="grid gap-6">
        <PWAStatus />
        <PWADebug />
      </div>
    </div>
  );
}
