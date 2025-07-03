export {};

export type Roles = "admin" | "doctor" | "staff";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
