# HealthDrive ASCII Wireframes

Below are updated ASCII wireframes for each page of the HealthDrive application, reflecting the
removal of the logo and user profile (to be replaced by a sidebar), action buttons for appointments,
and updated Add Appointment popup functionality.

## 1. Dashboard Page

```
+--------------------------------------------------+
| HealthDrive Dashboard                            |
+--------------------------------------------------+
| Analytics Cards                                  |
| +----------------+ +----------------+ +---------+ |
| | Today's Appts | | Patients/Week | | Doctors | |
| |       25      | |      120      | |   10    | |
| +----------------+ +----------------+ +---------+ |
+--------------------------------------------------+
| Today's Appointments                             |
| +------------------------------------------------+ |
| | ID | Patient | Doctor | Time | Status | Actions  | |
| | 1  | John D  | Dr. A  | 10AM | Conf.  | [U|C|V]  | |
| | 2  | Jane S  | Dr. B  | 11AM | Pend.  | [U|C|V]  | |
| +------------------------------------------------+ |
| [U: Update Status, C: Cancel, V: View Details]     |
+--------------------------------------------------+
```

## 2. Appointments Page

```
+--------------------------------------------------+
| Appointments                                     |
+--------------------------------------------------+
| [Add Appointment Button]                         |
+--------------------------------------------------+
| All Appointments                                 |
| +------------------------------------------------+ |
| | ID | Patient | Doctor | Date  | Time | Stat | Act | |
| | 1  | John D  | Dr. A  | 7/10  | 10AM | Conf |[U|C|V]| |
| | 2  | Jane S  | Dr. B  | 7/11  | 11AM | Pend |[U|C|V]| |
| +------------------------------------------------+ |
| [U: Update Status, C: Cancel, V: View Details]     |
| [Popup: Add/Edit Appointment]                    |
| +---------------------------------------------+  |
| | Search Patient by Phone: [________] [Search]|  |
| | [ ] Existing Patient: [John D]             |  |
| | [ ] New Patient:                          |  |
| |   Name: [________]                        |  |
| |   Phone: [________]                       |  |
| |   DOB: [MM/DD/YYYY]                       |  |
| |   Blood Group: [A+]                       |  |
| | Doctor: [Dr. A]  Dept: [Cardiology]       |  |
| | Date: [7/10/25]  Time: [10:00 AM]         |  |
| | [Save] [Cancel]                           |  |
| +---------------------------------------------+  |
+--------------------------------------------------+
```

## 3. Doctors Page

```
+--------------------------------------------------+
| Doctors                                          |
+--------------------------------------------------+
| [Add Doctor Button]                              |
+--------------------------------------------------+
| All Doctors                                      |
| +---------------------------------------------+  |
| | ID | Name     | Dept       | Contact       |  |
| | 1  | Dr. A    | Cardiology | 123-456-7890  |  |
| | 2  | Dr. B    | Neurology  | 098-765-4321  |  |
| +---------------------------------------------+  |
| [Popup: Add/Edit Doctor]                         |
| +---------------------------------------------+  |
| | Name: [Dr. A]                              |  |
| | Department: [Cardiology]                   |  |
| | Contact: [123-456-7890]                   |  |
| | Specialization: [Heart Surgery]            |  |
| | [Save] [Cancel]                           |  |
| +---------------------------------------------+  |
+--------------------------------------------------+
```

## 4. Analytics Page

```
+--------------------------------------------------+
| Analytics                                        |
+--------------------------------------------------+
| [Download CSV] [Download PDF]                    |
+--------------------------------------------------+
| Analytics Overview                               |
| +---------------------------------------------+  |
| | Total Appointments: 500                     |  |
| | Returning Patients: 200                    |  |
| | Appts by Doctor:                           |  |
| | - Dr. A: 250                               |  |
| | - Dr. B: 150                               |  |
| +---------------------------------------------+  |
+--------------------------------------------------+
```

## 5. Help Page

```
+--------------------------------------------------+
| Help                                             |
+--------------------------------------------------+
| Contact Support                                  |
| +---------------------------------------------+  |
| | Email: support@healthdrive.in              |  |
| | [Send Email Button]                        |  |
| +---------------------------------------------+  |
| FAQ                                              |
| +---------------------------------------------+  |
| | Q: How to add a doctor?                    |  |
| | A: Click "Add Doctor" on Doctors page...   |  |
| +---------------------------------------------+  |
+--------------------------------------------------+
```
