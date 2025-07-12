"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react";
import Link from "next/link";
import { formatPhoneNumberIntl } from "react-phone-number-input";

import type { FullAppointment } from "@/app/(protected)/appointments/actions";
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

interface AppointmentColumnsProps {
  onStatusChange: (appointmentId: string, newStatus: string) => void;
  onEditAppointment: (appointment: FullAppointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const createFullAppointmentColumns = ({
  onStatusChange,
  onEditAppointment,
  onDeleteAppointment,
}: AppointmentColumnsProps): ColumnDef<FullAppointment>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      const time = row.getValue("time") as string;
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <div>
            <div className="font-medium">{formattedDate}</div>
            <div className="text-muted-foreground text-sm">{time}</div>
          </div>
        </div>
      );
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
            <Link
              href={`tel:${patientPhone}`}
              className="text-muted-foreground hover:text-primary text-sm"
            >
              {formatPhoneNumberIntl(patientPhone)}
            </Link>
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
      return <div>{doctorName || "—"}</div>;
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
      return (
        <div className="max-w-[200px] truncate" title={notes}>
          {notes || "—"}
        </div>
      );
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
            <DropdownMenuItem
              onClick={() => onEditAppointment(appointment)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit appointment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "pending")}
                  className="cursor-pointer"
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "confirmed")}
                  className="cursor-pointer"
                >
                  Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "completed")}
                  className="cursor-pointer"
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(appointment.id, "cancelled")}
                  className="cursor-pointer"
                >
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteAppointment(appointment.id)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
