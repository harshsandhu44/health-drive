import React from "react";
import { useUser, useOrganization } from "@clerk/nextjs";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

interface ClerkOrganization {
  id: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  membersCount?: number;
}

interface AuthState {
  // Clerk data
  user: ClerkUser | null;
  organization: ClerkOrganization | null;
  isSignedIn: boolean;
  isLoaded: boolean;

  // Permission states
  permissions: {
    canManageAppointments: boolean;
    canManageDoctors: boolean;
    canManagePatients: boolean;
    canViewAnalytics: boolean;
    canManageBilling: boolean;
    isAdmin: boolean;
  };

  // Actions
  setUser: (user: ClerkUser | null) => void;
  setOrganization: (organization: ClerkOrganization | null) => void;
  setIsSignedIn: (isSignedIn: boolean) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  updatePermissions: (permissions: Partial<AuthState["permissions"]>) => void;
  clearAuth: () => void;

  // Helper functions
  getUserDisplayName: () => string;
  getUserEmail: () => string;
  getOrganizationId: () => string | null;
  hasPermission: (permission: keyof AuthState["permissions"]) => boolean;
}

const defaultPermissions = {
  canManageAppointments: false,
  canManageDoctors: false,
  canManagePatients: false,
  canViewAnalytics: false,
  canManageBilling: false,
  isAdmin: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      organization: null,
      isSignedIn: false,
      isLoaded: false,
      permissions: defaultPermissions,

      // Actions
      setUser: user => {
        set({ user });
        // Update permissions based on user role
        if (user) {
          // Default permissions for signed-in users
          const basePermissions = {
            canManageAppointments: true,
            canManageDoctors: false,
            canManagePatients: true,
            canViewAnalytics: true,
            canManageBilling: false,
            isAdmin: false,
          };
          set({ permissions: basePermissions });
        } else {
          set({ permissions: defaultPermissions });
        }
      },

      setOrganization: organization => {
        set({ organization });
        // Update permissions based on organization membership
        if (organization) {
          const { user } = get();
          if (user) {
            // For now, assume admin permissions for organization members
            // This would typically be determined by role in the organization
            set(state => ({
              permissions: {
                ...state.permissions,
                canManageDoctors: true,
                canManageBilling: true,
                isAdmin: true,
              },
            }));
          }
        }
      },

      setIsSignedIn: isSignedIn => set({ isSignedIn }),

      setIsLoaded: isLoaded => set({ isLoaded }),

      updatePermissions: newPermissions =>
        set(state => ({
          permissions: {
            ...state.permissions,
            ...newPermissions,
          },
        })),

      clearAuth: () =>
        set({
          user: null,
          organization: null,
          isSignedIn: false,
          isLoaded: false,
          permissions: defaultPermissions,
        }),

      // Helper functions
      getUserDisplayName: () => {
        const { user } = get();
        if (!user) return "Guest";

        if (user.firstName && user.lastName) {
          return `${user.firstName} ${user.lastName}`;
        }
        if (user.firstName) return user.firstName;
        if (user.emailAddresses?.[0]) {
          return user.emailAddresses[0].emailAddress.split("@")[0];
        }
        return "User";
      },

      getUserEmail: () => {
        const { user } = get();
        return user?.emailAddresses?.[0]?.emailAddress || "";
      },

      getOrganizationId: () => {
        const { organization } = get();
        return organization?.id || null;
      },

      hasPermission: permission => {
        const { permissions } = get();
        return permissions[permission];
      },
    }),
    { name: "auth-store" }
  )
);

// Hook to sync Clerk state with Zustand store
export const useAuthSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { organization } = useOrganization();
  const { setUser, setOrganization, setIsSignedIn, setIsLoaded } =
    useAuthStore();

  // Sync user state
  React.useEffect(() => {
    if (isLoaded) {
      setUser(user as ClerkUser | null);
      setIsSignedIn(!!isSignedIn);
      setIsLoaded(true);
    }
  }, [user, isSignedIn, isLoaded, setUser, setIsSignedIn, setIsLoaded]);

  // Sync organization state
  React.useEffect(() => {
    setOrganization(organization as ClerkOrganization | null);
  }, [organization, setOrganization]);
};
