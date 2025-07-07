"use client";

import React, { useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { toast } from "sonner";
import {
  updateAppointmentStatusAction,
  deleteAppointmentAction,
} from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "@/types/appointment";
import type { AppointmentStatus } from "@/types/globals";
import { EditAppointmentModal } from "./edit-appointment-modal";

// Memoized status color mapping for better performance
const STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-800 hover:bg-green-200",
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
  completed: "bg-blue-100 text-blue-800 hover:bg-blue-200",
} as const;

const getStatusColor = (status: string): string => {
  return (
    STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
    "bg-gray-100 text-gray-800 hover:bg-gray-200"
  );
};

// Memoized action handlers
const createStatusUpdateHandler =
  (appointmentId: string, status: AppointmentStatus) => async () => {
    try {
      await updateAppointmentStatusAction(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error("Error updating appointment status:", error);
    }
  };

const createDeleteHandler = (appointmentId: string) => async () => {
  try {
    await deleteAppointmentAction(appointmentId);
    toast.success("Appointment deleted successfully");
  } catch (error) {
    toast.error("Failed to delete appointment");
    console.error("Error deleting appointment:", error);
  }
};

// Memoized cell components for better performance
const PatientCell = React.memo(
  ({ patient }: { patient?: Appointment["patient"] }) => (
    <div className="font-medium">{patient?.name}</div>
  )
);
PatientCell.displayName = "PatientCell";

const PhoneCell = React.memo(
  ({ patient }: { patient?: Appointment["patient"] }) => (
    <div className="text-sm">
      {patient?.phone && formatPhoneNumberIntl(patient.phone)}
    </div>
  )
);
PhoneCell.displayName = "PhoneCell";

const DoctorCell = React.memo(
  ({ doctor }: { doctor?: Appointment["doctor"] }) => (
    <div className="font-medium">
      <div>{doctor?.name}</div>
      {doctor?.specialization && (
        <div className="text-xs text-muted-foreground">
          {doctor.specialization}
        </div>
      )}
    </div>
  )
);
DoctorCell.displayName = "DoctorCell";

const DateCell = React.memo(({ date }: { date: string }) => (
  <div className="flex flex-col font-medium">
    {format(new Date(date), "MMM d, yyyy")}
    <span className="text-xs text-muted-foreground">
      {format(new Date(date), "hh:mm a")}
    </span>
  </div>
));
DateCell.displayName = "DateCell";

const StatusCell = React.memo(({ status }: { status: string }) => (
  <Badge className={getStatusColor(status)}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
));
StatusCell.displayName = "StatusCell";

const NoteCell = React.memo(({ note }: { note?: string }) => (
  <div className="max-w-[200px] truncate text-sm text-muted-foreground">
    {note || "No note"}
  </div>
));
NoteCell.displayName = "NoteCell";

const ActionsCell = React.memo(
  ({ appointment }: { appointment: Appointment }) => {
    const handleConfirm = useCallback(
      () => createStatusUpdateHandler(appointment.id, "confirmed")(),
      [appointment.id]
    );

    const handleComplete = useCallback(
      () => createStatusUpdateHandler(appointment.id, "completed")(),
      [appointment.id]
    );

    const handleCancel = useCallback(
      () => createStatusUpdateHandler(appointment.id, "cancelled")(),
      [appointment.id]
    );

    const handleDelete = useCallback(
      () => createDeleteHandler(appointment.id)(),
      [appointment.id]
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <EditAppointmentModal
            appointment={appointment}
            triggerButton={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit Appointment
              </DropdownMenuItem>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleConfirm}>
            Mark as Confirmed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleComplete}>
            Mark as Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCancel}>
            Mark as Cancelled
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800"
          >
            Delete Appointment
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ActionsCell.displayName = "ActionsCell";

// Memoized column definitions
export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => <PatientCell patient={row.original.patient} />,
  },
  {
    accessorKey: "patient.phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <PhoneCell patient={row.original.patient} />,
  },
  {
    accessorKey: "doctor.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => <DoctorCell doctor={row.original.doctor} />,
  },
  {
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <DateCell date={row.getValue("appointment_datetime") as string} />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusCell status={row.getValue("status") as string} />,
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
    cell: ({ row }) => <NoteCell note={row.getValue("note") as string} />,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell appointment={row.original} />,
  },
];
