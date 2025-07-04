export {};

declare global {
  interface UserPublicMetadata {
    role: "admin" | "doctor" | "staff";
    facility_id: string;
  }

  interface OrganizationPublicMetadata {
    address: string;
    phone: string;
    plan: "starter" | "pro" | "business";
    plan_expires_at: Date;
    plan_status: "active" | "inactive" | "expired";
  }

  interface OrganizationPrivateMetadata {
    transaction_id: string;
  }
}
