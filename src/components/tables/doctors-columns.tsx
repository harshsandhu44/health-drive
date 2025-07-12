"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatPhoneNumberIntl } from "react-phone-number-input";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Doctor } from "@/lib/supabase";

interface DoctorColumnsProps {
  onEditDoctor: (doctor: Doctor) => void;
  onDeleteDoctor: (doctorId: string) => void;
}

export const createDoctorColumns = ({
  onEditDoctor,
  onDeleteDoctor,
}: DoctorColumnsProps): ColumnDef<Doctor>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2 font-medium">
          <Avatar>
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
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
      return <div>{specialization || "—"}</div>;
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue("contact") as string;
      return (
        <Link href={`tel:${contact}`}>
          {formatPhoneNumberIntl(contact) || "—"}
        </Link>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
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
            <DropdownMenuItem
              onClick={() => onEditDoctor(doctor)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit doctor
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteDoctor(doctor.id)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete doctor
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
