"use client";

import { useState, useEffect, useTransition } from "react";

import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  fetchPatients,
  deletePatient,
  searchPatients,
  type Patient,
} from "./actions";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [, startTransition] = useTransition();

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const patientsData = await fetchPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error("Failed to load patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      loadPatients();
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchPatients(term);
      setPatients(searchResults);
    } catch (error) {
      console.error("Search patients error:", error);
      toast.error("Failed to search patients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = (patientId: string) => {
    if (!confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deletePatient(patientId);
        if (result.success) {
          toast.success("Patient deleted successfully");
          loadPatients();
        } else {
          toast.error(result.error || "Failed to delete patient");
        }
      } catch (error) {
        console.error("Delete patient error:", error);
        toast.error("Something went wrong");
      }
    });
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s patient records
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search patients by name or phone number..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Patients ({patients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground text-sm">
                Loading patients...
              </div>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground text-sm">
                {searchTerm
                  ? "No patients found matching your search."
                  : "No patients found."}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      {patient.name}
                    </TableCell>
                    <TableCell>{patient.phone_number}</TableCell>
                    <TableCell>
                      {calculateAge(patient.date_of_birth)} years
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.blood_group}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(patient.date_of_birth)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePatient(patient.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
