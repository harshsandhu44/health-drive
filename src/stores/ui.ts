import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modal/Dialog states
  modals: {
    addAppointment: boolean;
    editAppointment: boolean;
    appointmentDetails: boolean;
    addDoctor: boolean;
    editDoctor: boolean;
    addPatient: boolean;
    editPatient: boolean;
    deleteConfirmation: boolean;
  };

  // Loading states
  loading: {
    appointments: boolean;
    doctors: boolean;
    patients: boolean;
    analytics: boolean;
  };

  // Selected items
  selectedAppointmentId: string | null;
  selectedDoctorId: string | null;
  selectedPatientId: string | null;

  // Toast/notification state
  toast: {
    show: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  };

  // Page states
  currentPage: string;
  pageHistory: string[];

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (modalName: keyof UIState["modals"]) => void;
  closeModal: (modalName: keyof UIState["modals"]) => void;
  closeAllModals: () => void;
  setLoading: (section: keyof UIState["loading"], isLoading: boolean) => void;
  setSelectedAppointment: (id: string | null) => void;
  setSelectedDoctor: (id: string | null) => void;
  setSelectedPatient: (id: string | null) => void;
  showToast: (message: string, type: UIState["toast"]["type"]) => void;
  hideToast: () => void;
  setCurrentPage: (page: string) => void;
  goBack: () => void;
  resetUI: () => void;
}

const initialModalsState = {
  addAppointment: false,
  editAppointment: false,
  appointmentDetails: false,
  addDoctor: false,
  editDoctor: false,
  addPatient: false,
  editPatient: false,
  deleteConfirmation: false,
};

const initialLoadingState = {
  appointments: false,
  doctors: false,
  patients: false,
  analytics: false,
};

const initialToastState = {
  show: false,
  message: "",
  type: "info" as const,
};

export const useUIStore = create<UIState>()(
  devtools(
    set => ({
      // Initial state
      sidebarOpen: true,
      sidebarCollapsed: false,
      modals: initialModalsState,
      loading: initialLoadingState,
      selectedAppointmentId: null,
      selectedDoctorId: null,
      selectedPatientId: null,
      toast: initialToastState,
      currentPage: "dashboard",
      pageHistory: [],

      // Actions
      toggleSidebar: () =>
        set(state => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarCollapsed: collapsed =>
        set({
          sidebarCollapsed: collapsed,
        }),

      openModal: modalName =>
        set(state => ({
          modals: {
            ...state.modals,
            [modalName]: true,
          },
        })),

      closeModal: modalName =>
        set(state => ({
          modals: {
            ...state.modals,
            [modalName]: false,
          },
        })),

      closeAllModals: () =>
        set({
          modals: initialModalsState,
          selectedAppointmentId: null,
          selectedDoctorId: null,
          selectedPatientId: null,
        }),

      setLoading: (section, isLoading) =>
        set(state => ({
          loading: {
            ...state.loading,
            [section]: isLoading,
          },
        })),

      setSelectedAppointment: id =>
        set({
          selectedAppointmentId: id,
        }),

      setSelectedDoctor: id =>
        set({
          selectedDoctorId: id,
        }),

      setSelectedPatient: id =>
        set({
          selectedPatientId: id,
        }),

      showToast: (message, type) =>
        set({
          toast: {
            show: true,
            message,
            type,
          },
        }),

      hideToast: () =>
        set({
          toast: initialToastState,
        }),

      setCurrentPage: page =>
        set(state => ({
          currentPage: page,
          pageHistory: [...state.pageHistory, state.currentPage].slice(-10), // Keep last 10 pages
        })),

      goBack: () =>
        set(state => {
          const newHistory = [...state.pageHistory];
          const previousPage = newHistory.pop() || "dashboard";
          return {
            currentPage: previousPage,
            pageHistory: newHistory,
          };
        }),

      resetUI: () =>
        set({
          sidebarOpen: true,
          sidebarCollapsed: false,
          modals: initialModalsState,
          loading: initialLoadingState,
          selectedAppointmentId: null,
          selectedDoctorId: null,
          selectedPatientId: null,
          toast: initialToastState,
          currentPage: "dashboard",
          pageHistory: [],
        }),
    }),
    { name: "ui-store" }
  )
);
