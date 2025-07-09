import { PWADebug } from "@/components/shared/pwa-debug";
import { PWAStatus } from "@/components/shared/pwa-status";

export default function PWATestPage() {
  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">PWA Test Page</h1>
      <p className="text-muted-foreground">
        This page is for testing PWA functionality without authentication.
      </p>

      <div className="space-y-4">
        <PWAStatus />
        <PWADebug />
      </div>
    </div>
  );
}
