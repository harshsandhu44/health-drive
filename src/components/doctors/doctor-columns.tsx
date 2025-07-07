"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doctor } from "@/types/appointment";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
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
import { MoreHorizontal, Edit, Trash2, Phone, MapPin } from "lucide-react";

export const doctorColumns: ColumnDef<Doctor>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const doctor = row.original;
      return (
        <div className="font-medium">
          <div>{doctor.name}</div>
          {doctor.specialization && (
            <div className="text-xs text-muted-foreground">
              {doctor.specialization}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string;
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "specialization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Specialization" />
    ),
    cell: ({ row }) => {
      const specialization = row.getValue("specialization") as string;
      return specialization ? (
        <Badge variant="secondary">{specialization}</Badge>
      ) : (
        <span className="text-muted-foreground text-sm">Not specified</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return address ? (
        <div className="flex items-center gap-2 max-w-[200px]">
          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm truncate">{address}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">Not provided</span>
      );
    },
  },
  {
    accessorKey: "patient_ids",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patients" />
    ),
    cell: ({ row }) => {
      const patientIds = row.getValue("patient_ids") as string[];
      const patientCount = patientIds?.length || 0;
      return (
        <div className="text-center">
          <Badge variant="outline">{patientCount}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const doctor = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(doctor.id)}
            >
              Copy doctor ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit doctor
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete doctor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
