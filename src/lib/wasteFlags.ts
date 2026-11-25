import type { MedicineReturn, PatientRecord } from "@/data/medicinesData";

export type WasteFlagType = "missed-collections" | "frequent-returns" | "oversupply";
export type WasteFlagSeverity = "high" | "medium";

export interface WasteFlag {
  type: WasteFlagType;
  label: string;
  severity: WasteFlagSeverity;
  detail: string;
}

export const MISSED_COLLECTION_THRESHOLD = 2;
export const FREQUENT_RETURN_THRESHOLD = 2;
export const OVERSUPPLY_RATIO_THRESHOLD = 2;

export function evaluatePatientFlags(
  patient: PatientRecord,
  returns: MedicineReturn[],
): WasteFlag[] {
  const flags: WasteFlag[] = [];
  const patientReturns = returns.filter((r) => r.patientId === patient.id);

  const missedEvents = patient.timeline.filter((e) => e.type === "missed");
  if (missedEvents.length >= MISSED_COLLECTION_THRESHOLD) {
    flags.push({
      type: "missed-collections",
      label: "Repeated missed collections",
      severity: "high",
      detail: `${missedEvents.length} uncollected prescriptions recorded; check practical barriers or adherence.`,
    });
  }

  if (patientReturns.length >= FREQUENT_RETURN_THRESHOLD) {
    const totalCost = patientReturns.reduce((sum, r) => sum + r.estimatedCostGbp, 0);
    flags.push({
      type: "frequent-returns",
      label: "Frequent medicines returns",
      severity: "high",
      detail: `${patientReturns.length} returned medicine events (£${totalCost} estimated waste).`,
    });
  }

  const oversuppliedMed = patient.medicines.find((med) => {
    const dispensedExcess = patient.timeline.some(
      (e) =>
        e.type === "dispensed" &&
        e.medicine === med.name &&
        typeof e.quantity === "number" &&
        e.quantity >= med.monthlyUnits * OVERSUPPLY_RATIO_THRESHOLD,
    );
    const returnedExcess = patientReturns.some(
      (r) =>
        r.medicine === med.name &&
        r.condition === "Unopened" &&
        r.quantity >= med.monthlyUnits * OVERSUPPLY_RATIO_THRESHOLD,
    );
    return dispensedExcess || returnedExcess;
  });

  if (oversuppliedMed) {
    flags.push({
      type: "oversupply",
      label: "Oversupply pattern",
      severity: "medium",
      detail: `${oversuppliedMed.name} shows supply or unopened returns at 2x+ monthly need.`,
    });
  }

  return flags;
}

export function computeReviewDueDate(fromDateIso: string, weeks = 5): string {
  const base = new Date(`${fromDateIso}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + weeks * 7);
  return base.toISOString().slice(0, 10);
}