import { describe, expect, it } from "vitest";
import { INITIAL_PATIENTS, INITIAL_RETURNS, type PatientRecord } from "@/data/medicinesData";
import { computeReviewDueDate, evaluatePatientFlags } from "@/lib/wasteFlags";

describe("evaluatePatientFlags", () => {
  it("flags repeated missed collections and frequent returns for Margaret Holloway", () => {
    const margaret = INITIAL_PATIENTS[0]!;
    const flags = evaluatePatientFlags(margaret, INITIAL_RETURNS);
    const types = flags.map((f) => f.type);

    expect(types).toContain("missed-collections");
    expect(types).toContain("frequent-returns");
    expect(types).toContain("oversupply");
  });

  it("flags oversupply pattern when dispensed quantity is 2x or more of monthly need", () => {
    const david = INITIAL_PATIENTS[1]!;
    const flags = evaluatePatientFlags(david, INITIAL_RETURNS);
    const types = flags.map((f) => f.type);

    expect(types).toContain("oversupply");
    expect(types).not.toContain("missed-collections");
  });

  it("returns no flags for a patient with regular collections and zero returns", () => {
    const thomas = INITIAL_PATIENTS[3]!;
    const flags = evaluatePatientFlags(thomas, INITIAL_RETURNS);

    expect(flags).toHaveLength(0);
  });

  it("does not trigger missed-collections flag on a single missed collection", () => {
    const singleMissPatient: PatientRecord = {
      ...INITIAL_PATIENTS[3]!,
      id: "pt-single-miss",
      timeline: [
        {
          id: "t-miss-1",
          date: "2026-11-10",
          type: "missed",
          medicine: "Ramipril 5mg capsules",
          source: "High Street Pharmacy",
          note: "Single missed pickup.",
        },
      ],
    };

    expect(evaluatePatientFlags(singleMissPatient, [])).toHaveLength(0);
  });

  it("schedules structured medication reviews within the 4 to 6 week window", () => {
    expect(computeReviewDueDate("2026-11-25", 4)).toBe("2026-12-23");
    expect(computeReviewDueDate("2026-11-25", 6)).toBe("2027-01-06");
  });
});