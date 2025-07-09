"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppointmentNotifications } from "@/hooks/use-appointment-notifications";
import { useRealtimeAppointments } from "@/hooks/use-realtime-appointments";
import { NotificationService } from "@/lib/notification-service";
import { Appointment } from "@/types/appointment";

export function RealtimeTest() {
  const [testStatus, setTestStatus] = useState<string[]>([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const { appointments, isConnected, isLoading, error, refreshConnection } =
    useRealtimeAppointments({
      initialAppointments: [],
      enableNotifications: true,
      filter: "all",
    });

  useAppointmentNotifications({
    appointments,
    enabled: true,
  });

  const addTestStatus = (message: string) => {
    setTestStatus((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testNotificationPermission = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      const granted = await notificationService.requestPermission();
      setPermissionGranted(granted);
      addTestStatus(
        `Notification permission: ${granted ? "Granted" : "Denied"}`
      );
    } catch (error) {
      addTestStatus(`Error requesting permission: ${error}`);
    }
  };

  const testPushNotification = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      const success = await notificationService.showNotification({
        title: "Test Notification",
        body: "This is a test notification from HealthDrive",
        tag: "test-notification",
      });
      addTestStatus(`Test notification: ${success ? "Sent" : "Failed"}`);
    } catch (error) {
      addTestStatus(`Error sending test notification: ${error}`);
    }
  };

  const testAppointmentNotification = async () => {
    try {
      const notificationService = NotificationService.getInstance();

      // Create a mock appointment for testing
      const testAppointment: Appointment = {
        id: "test-appointment",
        patient_id: "test-patient",
        doctor_id: "test-doctor",
        appointment_datetime: new Date(
          Date.now() + 5 * 60 * 1000
        ).toISOString(), // 5 minutes from now
        status: "confirmed",
        organization_id: "test-org",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patient: {
          id: "test-patient",
          name: "Test Patient",
          phone: "+1234567890",
          organization_id: "test-org",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        doctor: {
          id: "test-doctor",
          name: "Dr. Test",
          phone_number: "+1234567890",
          organization_id: "test-org",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };

      await notificationService.showNewAppointmentNotification(testAppointment);
      addTestStatus("Test appointment notification sent");
    } catch (error) {
      addTestStatus(`Error sending appointment notification: ${error}`);
    }
  };

  const clearTestStatus = () => {
    setTestStatus([]);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Realtime & Notification Test</CardTitle>
        <CardDescription>
          Test the realtime appointment system and notification functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Realtime Connection:</span>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isLoading && <Badge variant="secondary">Loading...</Badge>}
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            Error: {error}
          </div>
        )}

        {/* Notification Permission */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Notification Permission:</span>
          <Badge variant={permissionGranted ? "default" : "secondary"}>
            {permissionGranted ? "Granted" : "Not Granted"}
          </Badge>
        </div>

        {/* Appointment Count */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active Appointments:</span>
          <Badge variant="outline">{appointments.length}</Badge>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={testNotificationPermission}
            variant="outline"
            size="sm"
          >
            Request Permission
          </Button>
          <Button
            onClick={testPushNotification}
            variant="outline"
            size="sm"
            disabled={!permissionGranted}
          >
            Test Push Notification
          </Button>
          <Button
            onClick={testAppointmentNotification}
            variant="outline"
            size="sm"
            disabled={!permissionGranted}
          >
            Test Appointment Notification
          </Button>
          <Button
            onClick={refreshConnection}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            Refresh Connection
          </Button>
        </div>

        {/* Test Status Log */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Test Log:</h4>
            <Button onClick={clearTestStatus} variant="ghost" size="sm">
              Clear
            </Button>
          </div>
          <div className="max-h-40 overflow-y-auto bg-muted/50 p-2 rounded text-xs space-y-1">
            {testStatus.length === 0 ? (
              <div className="text-muted-foreground">
                No test results yet...
              </div>
            ) : (
              testStatus.map((status, index) => (
                <div key={index} className="break-words">
                  {status}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• First, request notification permission</p>
          <p>• Test push notifications to verify they work</p>
          <p>• Create new appointments to test realtime updates</p>
          <p>• Check that appointment reminders are scheduled</p>
        </div>
      </CardContent>
    </Card>
  );
}
