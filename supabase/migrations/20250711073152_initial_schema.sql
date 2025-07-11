create table "public"."analytics_logs" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" text not null,
    "metric_type" character varying not null,
    "value" integer not null,
    "timestamp" timestamp without time zone default now()
);


alter table "public"."analytics_logs" enable row level security;

create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" text not null,
    "doctor_id" text,
    "patient_id" uuid not null,
    "date" date not null,
    "time" time without time zone not null,
    "status" character varying not null default 'pending'::character varying
);


alter table "public"."appointments" enable row level security;

create table "public"."departments" (
    "id" uuid not null default gen_random_uuid(),
    "organization_id" text not null,
    "name" character varying not null
);


alter table "public"."departments" enable row level security;

create table "public"."doctors" (
    "id" text not null default (gen_random_uuid())::text,
    "organization_id" text not null,
    "department_id" uuid,
    "name" character varying not null,
    "contact" character varying,
    "specialization" character varying
);


alter table "public"."doctors" enable row level security;

create table "public"."organizations" (
    "id" text not null,
    "name" character varying not null,
    "billing_status" character varying default 'inactive'::character varying,
    "created_at" timestamp without time zone default now()
);


alter table "public"."organizations" enable row level security;

create table "public"."patient_records" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" uuid not null,
    "medical_history" text,
    "last_updated" timestamp without time zone default now()
);


alter table "public"."patient_records" enable row level security;

create table "public"."patients" (
    "id" uuid not null default gen_random_uuid(),
    "phone_number" character varying not null,
    "name" character varying not null,
    "date_of_birth" date not null,
    "blood_group" character varying not null
);


alter table "public"."patients" enable row level security;

create table "public"."users" (
    "id" text not null,
    "organization_id" text not null,
    "email" character varying not null,
    "role" character varying not null,
    "created_at" timestamp without time zone default now()
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX analytics_logs_pkey ON public.analytics_logs USING btree (id);

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX departments_pkey ON public.departments USING btree (id);

CREATE UNIQUE INDEX doctors_pkey ON public.doctors USING btree (id);

CREATE INDEX idx_analytics_logs_organization_id ON public.analytics_logs USING btree (organization_id);

CREATE INDEX idx_analytics_logs_timestamp ON public.analytics_logs USING btree ("timestamp");

CREATE INDEX idx_appointments_date ON public.appointments USING btree (date);

CREATE INDEX idx_appointments_doctor_id ON public.appointments USING btree (doctor_id);

CREATE INDEX idx_appointments_organization_id ON public.appointments USING btree (organization_id);

CREATE INDEX idx_appointments_patient_id ON public.appointments USING btree (patient_id);

CREATE INDEX idx_departments_organization_id ON public.departments USING btree (organization_id);

CREATE INDEX idx_doctors_department_id ON public.doctors USING btree (department_id);

CREATE INDEX idx_doctors_organization_id ON public.doctors USING btree (organization_id);

CREATE INDEX idx_patient_records_patient_id ON public.patient_records USING btree (patient_id);

CREATE INDEX idx_patients_phone_number ON public.patients USING btree (phone_number);

CREATE INDEX idx_users_organization_id ON public.users USING btree (organization_id);

CREATE UNIQUE INDEX organizations_pkey ON public.organizations USING btree (id);

CREATE UNIQUE INDEX patient_records_pkey ON public.patient_records USING btree (id);

CREATE UNIQUE INDEX patients_phone_number_key ON public.patients USING btree (phone_number);

CREATE UNIQUE INDEX patients_pkey ON public.patients USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."analytics_logs" add constraint "analytics_logs_pkey" PRIMARY KEY using index "analytics_logs_pkey";

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."departments" add constraint "departments_pkey" PRIMARY KEY using index "departments_pkey";

alter table "public"."doctors" add constraint "doctors_pkey" PRIMARY KEY using index "doctors_pkey";

alter table "public"."organizations" add constraint "organizations_pkey" PRIMARY KEY using index "organizations_pkey";

alter table "public"."patient_records" add constraint "patient_records_pkey" PRIMARY KEY using index "patient_records_pkey";

alter table "public"."patients" add constraint "patients_pkey" PRIMARY KEY using index "patients_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."analytics_logs" add constraint "analytics_logs_metric_type_check" CHECK (((metric_type)::text = ANY ((ARRAY['total_appointments'::character varying, 'appointments_per_doctor'::character varying, 'returning_patients'::character varying])::text[]))) not valid;

alter table "public"."analytics_logs" validate constraint "analytics_logs_metric_type_check";

alter table "public"."analytics_logs" add constraint "analytics_logs_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."analytics_logs" validate constraint "analytics_logs_organization_id_fkey";

alter table "public"."appointments" add constraint "appointments_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL not valid;

alter table "public"."appointments" validate constraint "appointments_doctor_id_fkey";

alter table "public"."appointments" add constraint "appointments_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_organization_id_fkey";

alter table "public"."appointments" add constraint "appointments_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE not valid;

alter table "public"."appointments" validate constraint "appointments_patient_id_fkey";

alter table "public"."appointments" add constraint "appointments_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."appointments" validate constraint "appointments_status_check";

alter table "public"."departments" add constraint "departments_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."departments" validate constraint "departments_organization_id_fkey";

alter table "public"."doctors" add constraint "doctors_department_id_fkey" FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL not valid;

alter table "public"."doctors" validate constraint "doctors_department_id_fkey";

alter table "public"."doctors" add constraint "doctors_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."doctors" validate constraint "doctors_organization_id_fkey";

alter table "public"."organizations" add constraint "organizations_billing_status_check" CHECK (((billing_status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'past_due'::character varying])::text[]))) not valid;

alter table "public"."organizations" validate constraint "organizations_billing_status_check";

alter table "public"."patient_records" add constraint "patient_records_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_records" validate constraint "patient_records_patient_id_fkey";

alter table "public"."patients" add constraint "patients_blood_group_check" CHECK (((blood_group)::text = ANY ((ARRAY['A+'::character varying, 'A-'::character varying, 'B+'::character varying, 'B-'::character varying, 'AB+'::character varying, 'AB-'::character varying, 'O+'::character varying, 'O-'::character varying])::text[]))) not valid;

alter table "public"."patients" validate constraint "patients_blood_group_check";

alter table "public"."patients" add constraint "patients_phone_number_key" UNIQUE using index "patients_phone_number_key";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_organization_id_fkey";

alter table "public"."users" add constraint "users_role_check" CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'staff'::character varying, 'doctor'::character varying])::text[]))) not valid;

alter table "public"."users" validate constraint "users_role_check";

grant delete on table "public"."analytics_logs" to "anon";

grant insert on table "public"."analytics_logs" to "anon";

grant references on table "public"."analytics_logs" to "anon";

grant select on table "public"."analytics_logs" to "anon";

grant trigger on table "public"."analytics_logs" to "anon";

grant truncate on table "public"."analytics_logs" to "anon";

grant update on table "public"."analytics_logs" to "anon";

grant delete on table "public"."analytics_logs" to "authenticated";

grant insert on table "public"."analytics_logs" to "authenticated";

grant references on table "public"."analytics_logs" to "authenticated";

grant select on table "public"."analytics_logs" to "authenticated";

grant trigger on table "public"."analytics_logs" to "authenticated";

grant truncate on table "public"."analytics_logs" to "authenticated";

grant update on table "public"."analytics_logs" to "authenticated";

grant delete on table "public"."analytics_logs" to "service_role";

grant insert on table "public"."analytics_logs" to "service_role";

grant references on table "public"."analytics_logs" to "service_role";

grant select on table "public"."analytics_logs" to "service_role";

grant trigger on table "public"."analytics_logs" to "service_role";

grant truncate on table "public"."analytics_logs" to "service_role";

grant update on table "public"."analytics_logs" to "service_role";

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."departments" to "anon";

grant insert on table "public"."departments" to "anon";

grant references on table "public"."departments" to "anon";

grant select on table "public"."departments" to "anon";

grant trigger on table "public"."departments" to "anon";

grant truncate on table "public"."departments" to "anon";

grant update on table "public"."departments" to "anon";

grant delete on table "public"."departments" to "authenticated";

grant insert on table "public"."departments" to "authenticated";

grant references on table "public"."departments" to "authenticated";

grant select on table "public"."departments" to "authenticated";

grant trigger on table "public"."departments" to "authenticated";

grant truncate on table "public"."departments" to "authenticated";

grant update on table "public"."departments" to "authenticated";

grant delete on table "public"."departments" to "service_role";

grant insert on table "public"."departments" to "service_role";

grant references on table "public"."departments" to "service_role";

grant select on table "public"."departments" to "service_role";

grant trigger on table "public"."departments" to "service_role";

grant truncate on table "public"."departments" to "service_role";

grant update on table "public"."departments" to "service_role";

grant delete on table "public"."doctors" to "anon";

grant insert on table "public"."doctors" to "anon";

grant references on table "public"."doctors" to "anon";

grant select on table "public"."doctors" to "anon";

grant trigger on table "public"."doctors" to "anon";

grant truncate on table "public"."doctors" to "anon";

grant update on table "public"."doctors" to "anon";

grant delete on table "public"."doctors" to "authenticated";

grant insert on table "public"."doctors" to "authenticated";

grant references on table "public"."doctors" to "authenticated";

grant select on table "public"."doctors" to "authenticated";

grant trigger on table "public"."doctors" to "authenticated";

grant truncate on table "public"."doctors" to "authenticated";

grant update on table "public"."doctors" to "authenticated";

grant delete on table "public"."doctors" to "service_role";

grant insert on table "public"."doctors" to "service_role";

grant references on table "public"."doctors" to "service_role";

grant select on table "public"."doctors" to "service_role";

grant trigger on table "public"."doctors" to "service_role";

grant truncate on table "public"."doctors" to "service_role";

grant update on table "public"."doctors" to "service_role";

grant delete on table "public"."organizations" to "anon";

grant insert on table "public"."organizations" to "anon";

grant references on table "public"."organizations" to "anon";

grant select on table "public"."organizations" to "anon";

grant trigger on table "public"."organizations" to "anon";

grant truncate on table "public"."organizations" to "anon";

grant update on table "public"."organizations" to "anon";

grant delete on table "public"."organizations" to "authenticated";

grant insert on table "public"."organizations" to "authenticated";

grant references on table "public"."organizations" to "authenticated";

grant select on table "public"."organizations" to "authenticated";

grant trigger on table "public"."organizations" to "authenticated";

grant truncate on table "public"."organizations" to "authenticated";

grant update on table "public"."organizations" to "authenticated";

grant delete on table "public"."organizations" to "service_role";

grant insert on table "public"."organizations" to "service_role";

grant references on table "public"."organizations" to "service_role";

grant select on table "public"."organizations" to "service_role";

grant trigger on table "public"."organizations" to "service_role";

grant truncate on table "public"."organizations" to "service_role";

grant update on table "public"."organizations" to "service_role";

grant delete on table "public"."patient_records" to "anon";

grant insert on table "public"."patient_records" to "anon";

grant references on table "public"."patient_records" to "anon";

grant select on table "public"."patient_records" to "anon";

grant trigger on table "public"."patient_records" to "anon";

grant truncate on table "public"."patient_records" to "anon";

grant update on table "public"."patient_records" to "anon";

grant delete on table "public"."patient_records" to "authenticated";

grant insert on table "public"."patient_records" to "authenticated";

grant references on table "public"."patient_records" to "authenticated";

grant select on table "public"."patient_records" to "authenticated";

grant trigger on table "public"."patient_records" to "authenticated";

grant truncate on table "public"."patient_records" to "authenticated";

grant update on table "public"."patient_records" to "authenticated";

grant delete on table "public"."patient_records" to "service_role";

grant insert on table "public"."patient_records" to "service_role";

grant references on table "public"."patient_records" to "service_role";

grant select on table "public"."patient_records" to "service_role";

grant trigger on table "public"."patient_records" to "service_role";

grant truncate on table "public"."patient_records" to "service_role";

grant update on table "public"."patient_records" to "service_role";

grant delete on table "public"."patients" to "anon";

grant insert on table "public"."patients" to "anon";

grant references on table "public"."patients" to "anon";

grant select on table "public"."patients" to "anon";

grant trigger on table "public"."patients" to "anon";

grant truncate on table "public"."patients" to "anon";

grant update on table "public"."patients" to "anon";

grant delete on table "public"."patients" to "authenticated";

grant insert on table "public"."patients" to "authenticated";

grant references on table "public"."patients" to "authenticated";

grant select on table "public"."patients" to "authenticated";

grant trigger on table "public"."patients" to "authenticated";

grant truncate on table "public"."patients" to "authenticated";

grant update on table "public"."patients" to "authenticated";

grant delete on table "public"."patients" to "service_role";

grant insert on table "public"."patients" to "service_role";

grant references on table "public"."patients" to "service_role";

grant select on table "public"."patients" to "service_role";

grant trigger on table "public"."patients" to "service_role";

grant truncate on table "public"."patients" to "service_role";

grant update on table "public"."patients" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "analytics_access"
on "public"."analytics_logs"
as permissive
for all
to public
using ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))))
with check ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))));


create policy "appt_access"
on "public"."appointments"
as permissive
for all
to public
using ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))))
with check ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))));


create policy "dept_access"
on "public"."departments"
as permissive
for all
to public
using ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))))
with check ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))));


create policy "doctor_access"
on "public"."doctors"
as permissive
for all
to public
using ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))))
with check ((organization_id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))));


create policy "org_access"
on "public"."organizations"
as permissive
for all
to public
using ((id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))))
with check ((id = ( SELECT users.organization_id
   FROM users
  WHERE (users.id = (auth.uid())::text))));


create policy "record_access"
on "public"."patient_records"
as permissive
for all
to public
using ((patient_id IN ( SELECT DISTINCT appointments.patient_id
   FROM appointments
  WHERE (appointments.organization_id = ( SELECT users.organization_id
           FROM users
          WHERE (users.id = (auth.uid())::text))))))
with check ((patient_id IN ( SELECT DISTINCT appointments.patient_id
   FROM appointments
  WHERE (appointments.organization_id = ( SELECT users.organization_id
           FROM users
          WHERE (users.id = (auth.uid())::text))))));


create policy "patient_access"
on "public"."patients"
as permissive
for all
to public
using ((id IN ( SELECT DISTINCT appointments.patient_id
   FROM appointments
  WHERE (appointments.organization_id = ( SELECT users.organization_id
           FROM users
          WHERE (users.id = (auth.uid())::text))))))
with check ((id IN ( SELECT DISTINCT appointments.patient_id
   FROM appointments
  WHERE (appointments.organization_id = ( SELECT users.organization_id
           FROM users
          WHERE (users.id = (auth.uid())::text))))));


create policy "user_access"
on "public"."users"
as permissive
for all
to public
using ((organization_id = ( SELECT users_1.organization_id
   FROM users users_1
  WHERE (users_1.id = (auth.uid())::text))))
with check ((organization_id = ( SELECT users_1.organization_id
   FROM users users_1
  WHERE (users_1.id = (auth.uid())::text))));



