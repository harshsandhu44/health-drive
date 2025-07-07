"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  updateAppointmentStatusAction,
  deleteAppointmentAction,
} from "@/app/actions";
import { toast } from "sonner";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { EditAppointmentModal } from "./edit-appointment-modal";

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const handleStatusUpdate = async (
  appointmentId: string,
  status: "pending" | "confirmed" | "cancelled" | "completed"
) => {
  try {
    await updateAppointmentStatusAction(appointmentId, status);
    toast.success(`Appointment ${status} successfully`);
  } catch (error) {
    toast.error("Failed to update appointment status");
    console.error("Error updating appointment status:", error);
  }
};

const handleDelete = async (appointmentId: string) => {
  try {
    await deleteAppointmentAction(appointmentId);
    toast.success("Appointment deleted successfully");
  } catch (error) {
    toast.error("Failed to delete appointment");
    console.error("Error deleting appointment:", error);
  }
};

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "patient.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => {
      const patient = row.original.patient;
      return <div className="font-medium">{patient?.name}</div>;
    },
  },
  {
    accessorKey: "patient.phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const patient = row.original.patient;
      return (
        <div className="text-sm">
          {patient?.phone && formatPhoneNumberIntl(patient.phone)}
        </div>
      );
    },
  },
  {
    accessorKey: "doctor.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      return (
        <div className="font-medium">
          <div>{doctor?.name}</div>
          {doctor?.specialization && (
            <div className="text-xs text-muted-foreground">
              {doctor.specialization}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "appointment_datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("appointment_datetime") as string;
      return (
        <div className="flex flex-col font-medium">
          {format(new Date(date), "MMM d, yyyy")}
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), "hh:mm a")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Note" />
    ),
    cell: ({ row }) => {
      const note = row.getValue("note") as string;
      return (
        <div className="max-w-[200px] truncate text-sm text-muted-foreground">
          {note || "No note"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const appointment = row.original;

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
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
            >
              Mark as Confirmed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(appointment.id, "completed")}
            >
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
            >
              Mark as Cancelled
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(appointment.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete Appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
