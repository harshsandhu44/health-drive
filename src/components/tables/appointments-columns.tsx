"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment } from "@/stores/appointments";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "scheduled":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "no_show":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

interface AppointmentColumnsProps {
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  onEditAppointment: (appointment: Appointment) => void;
}

export const createAppointmentColumns = ({
  onStatusChange,
  onEditAppointment,
}: AppointmentColumnsProps): ColumnDef<Appointment>[] => [
  {
    accessorKey: "appointment_time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("appointment_time") as string;
      return <div className="font-medium">{time}</div>;
    },
  },
  {
    accessorKey: "patient_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" />
    ),
    cell: ({ row }) => {
      const patientName = row.getValue("patient_name") as string;
      const patientPhone = row.original.patient_phone;
      return (
        <div>
          <div className="font-medium">{patientName}</div>
          {patientPhone && (
            <div className="text-muted-foreground text-sm">{patientPhone}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "doctor_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ row }) => {
      const doctorName = row.getValue("doctor_name") as string;
      return <div>{doctorName}</div>;
    },
  },
  {
    accessorKey: "department_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => {
      const departmentName = row.getValue("department_name") as string;
      return <div>{departmentName}</div>;
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
          {status.replace("_", " ")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string;
      return <div className="max-w-[200px] truncate">{notes || "—"}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
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
            <DropdownMenuItem onClick={() => onEditAppointment(appointment)}>
              Edit appointment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "scheduled")}
                >
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "completed")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "cancelled")}
                >
                  Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "no_show")}
                >
                  No show
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
