import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  INITIAL_PATIENTS,
  INITIAL_RETURNS,
  INITIAL_REVIEWS,
  type MedicationReview,
  type MedicineReturn,
  type PatientRecord,
  type ReviewCause,
  type ReviewStatus,
} from "@/data/medicinesData";
import { computeReviewDueDate } from "@/lib/wasteFlags";

const STORAGE_KEY = "medloop-platform-state-v1";

interface PersistedState {
  patients: PatientRecord[];
  returns: MedicineReturn[];
  reviews: MedicationReview[];
}

interface PlatformContextValue extends PersistedState {
  addReturn: (entry: Omit<MedicineReturn, "id">) => MedicineReturn;
  scheduleReview: (input: {
    patientId: string;
    suspectedCause: ReviewCause;
    weeksWindow: number;
    assignedTeam: string;
    notes: string;
  }) => MedicationReview;
  updateReviewStatus: (reviewId: string, status: ReviewStatus) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (Array.isArray(parsed.patients) && Array.isArray(parsed.returns) && Array.isArray(parsed.reviews)) {
        return { patients: parsed.patients, returns: parsed.returns, reviews: parsed.reviews };
      }
    }
  } catch {
    // Fall through to seed data if storage is unavailable or malformed.
  }
  return {
    patients: INITIAL_PATIENTS,
    returns: INITIAL_RETURNS,
    reviews: INITIAL_REVIEWS,
  };
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors in restricted browsers.
    }
  }, [state]);

  const addReturn: PlatformContextValue["addReturn"] = (entry) => {
    const created: MedicineReturn = { ...entry, id: `ret-${Date.now()}` };
    setState((prev) => ({ ...prev, returns: [created, ...prev.returns] }));
    return created;
  };

  const scheduleReview: PlatformContextValue["scheduleReview"] = ({
    patientId,
    suspectedCause,
    weeksWindow,
    assignedTeam,
    notes,
  }) => {
    const today = new Date().toISOString().slice(0, 10);
    const created: MedicationReview = {
      id: `rev-${Date.now()}`,
      patientId,
      scheduledDate: today,
      dueDate: computeReviewDueDate(today, weeksWindow),
      suspectedCause,
      status: "Scheduled",
      assignedTeam: assignedTeam.trim() || "Oakfield Clinical Pharmacist",
      notes: notes.trim(),
    };
    setState((prev) => ({ ...prev, reviews: [created, ...prev.reviews] }));
    return created;
  };

  const updateReviewStatus: PlatformContextValue["updateReviewStatus"] = (reviewId, status) => {
    setState((prev) => ({
      ...prev,
      reviews: prev.reviews.map((rev) => (rev.id === reviewId ? { ...rev, status } : rev)),
    }));
  };

  return (
    <PlatformContext.Provider value={{ ...state, addReturn, scheduleReview, updateReviewStatus }}>
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
}