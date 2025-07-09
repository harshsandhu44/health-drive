"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, Phone, MapPin } from "lucide-react";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { deleteDoctorAction } from "@/app/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { toast } from "@/lib/toast-with-sound";
import { Doctor } from "@/types/appointment";
import { EditDoctorModal } from "./edit-doctor-modal";

// Delete doctor function
const handleDeleteDoctor = async (
  doctorId: string,
  onDoctorDeleted?: () => void
) => {
  try {
    await deleteDoctorAction(doctorId);
    toast.success("Doctor deleted successfully!");
    onDoctorDeleted?.();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete doctor";
    toast.error(errorMessage);
    console.error("Error deleting doctor:", error);
  }
};

export const createDoctorColumns = (
  onDoctorUpdated?: () => void,
  onDoctorDeleted?: () => void
): ColumnDef<Doctor>[] => [
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
          <span className="text-sm">{formatPhoneNumberIntl(phone)}</span>
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
            <EditDoctorModal
              doctor={doctor}
              onDoctorUpdated={onDoctorUpdated}
              triggerButton={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit doctor
                </DropdownMenuItem>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete doctor
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the doctor &quot;{doctor.name}&quot; and remove all
                    associated data. The doctor cannot be deleted if they have
                    existing appointments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      handleDeleteDoctor(doctor.id, onDoctorDeleted)
                    }
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Default columns for backward compatibility
export const doctorColumns = createDoctorColumns();
