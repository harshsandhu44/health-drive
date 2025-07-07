import { NewAppointmentForm } from "@/components/appointments/new-appointment-form";
import { ExistingPatientAppointmentForm } from "@/components/appointments/existing-patient-appointment-form";
import { fetchDoctorsAction } from "@/app/actions";
import { Doctor } from "@/types/appointment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewAppointmentPage = async () => {
  // Fetch doctors from doctors table
  let doctors: Doctor[] = [];
  try {
    doctors = await fetchDoctorsAction();
  } catch (error) {
    console.error("Error fetching doctors:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">New Appointment</h2>
        <p className="text-muted-foreground">
          Create a new appointment. All appointments created here are
          automatically confirmed.
        </p>
      </div>

      <div className="flex justify-center">
        <Tabs defaultValue="new-patient">
          <TabsList>
            <TabsTrigger value="new-patient">New Patient</TabsTrigger>
            <TabsTrigger value="existing-patient">Existing Patient</TabsTrigger>
          </TabsList>
          <TabsContent value="new-patient">
            <NewAppointmentForm doctors={doctors} />
          </TabsContent>
          <TabsContent value="existing-patient">
            <ExistingPatientAppointmentForm doctors={doctors} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewAppointmentPage;
