// Realistic NHS-style demo data for MediTrack platform.
// All patients, NHS numbers and clinical details are fictional.

export type ReturnReason =
  | "Side effects"
  | "Medication change"
  | "Symptom resolved"
  | "Confusion"
  | "Forgetfulness"
  | "Over-ordering"
  | "Patient deceased"
  | "Other";

export type PackCondition = "Unopened" | "Partly used" | "Expired";

export type MissedReason =
  | "I forgot"
  | "I no longer think I need it"
  | "I am worried about side effects"
  | "I do not understand what it is for"
  | "I already have enough at home"
  | "I was unable to collect it"
  | "No response";

export type AlertSeverity = "critical" | "high" | "moderate" | "low";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  form: string;
  indication: string;
  startDate: string; // ISO
  expectedCollection: string;
  actualCollection: string | null;
  prescriber: string;
  quantity: string;
  status: "active" | "missed" | "discontinued";
}

export interface ReturnedMedicine {
  id: string;
  patientId: string;
  patientName: string;
  medicine: string;
  quantity: string;
  dateReturned: string;
  condition: PackCondition;
  reason: ReturnReason;
  pharmacy: string;
  loggedBy: string;
  notes?: string;
}

export interface PatientResponse {
  medicationName: string;
  reason: MissedReason;
  respondedAt: string;
}

export interface Patient {
  id: string;
  nhsNumber: string;
  name: string;
  dob: string;
  age: number;
  sex: "Male" | "Female";
  gpPractice: string;
  pharmacy: string;
  conditions: string[];
  allergies: { substance: string; reaction: string; severity: "Mild" | "Moderate" | "Severe" }[];
  medications: Medication[];
  recentResponses: PatientResponse[];
  flags: AlertSeverity[];
  reviewDue?: string; // ISO if review recommended
}

export interface WasteAlert {
  id: string;
  patientId: string;
  patientName: string;
  nhsNumber: string;
  type:
    | "Repeated missed collection"
    | "Frequent returns"
    | "Oversupply pattern"
    | "Side effect cluster"
    | "No-longer-needed reports";
  detail: string;
  severity: AlertSeverity;
  detectedAt: string;
  recommendedAction: string;
  estimatedWasteValue: number; // £
}

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(today.getTime() + n * 86400000).toISOString();

export const patients: Patient[] = [
  {
    id: "p1",
    nhsNumber: "485 777 3456",
    name: "Margaret Whitfield",
    dob: "1942-03-14",
    age: 83,
    sex: "Female",
    gpPractice: "Riverside Medical Centre",
    pharmacy: "Boots — High Street",
    conditions: ["Type 2 diabetes", "Hypertension", "Atrial fibrillation", "Mild cognitive impairment"],
    allergies: [
      { substance: "Penicillin", reaction: "Urticaria", severity: "Moderate" },
      { substance: "Codeine", reaction: "Nausea & vomiting", severity: "Mild" },
    ],
    medications: [
      { id: "m1", name: "Metformin", dose: "500mg", form: "Tablet (BD)", indication: "Type 2 diabetes", startDate: "2018-06-12", expectedCollection: daysAgo(8), actualCollection: null, prescriber: "Dr R. Patel", quantity: "56 tablets", status: "missed" },
      { id: "m2", name: "Apixaban", dose: "5mg", form: "Tablet (BD)", indication: "Stroke prevention in AF", startDate: "2021-02-04", expectedCollection: daysAgo(3), actualCollection: daysAgo(2), prescriber: "Dr R. Patel", quantity: "56 tablets", status: "active" },
      { id: "m3", name: "Ramipril", dose: "5mg", form: "Capsule (OD)", indication: "Hypertension", startDate: "2016-09-01", expectedCollection: daysAgo(12), actualCollection: null, prescriber: "Dr R. Patel", quantity: "28 capsules", status: "missed" },
      { id: "m4", name: "Atorvastatin", dose: "20mg", form: "Tablet (OD nocte)", indication: "CV risk reduction", startDate: "2019-11-22", expectedCollection: daysAhead(2), actualCollection: null, prescriber: "Dr R. Patel", quantity: "28 tablets", status: "active" },
    ],
    recentResponses: [
      { medicationName: "Metformin", reason: "I forgot", respondedAt: daysAgo(7) },
      { medicationName: "Ramipril", reason: "I already have enough at home", respondedAt: daysAgo(11) },
    ],
    flags: ["high", "moderate"],
    reviewDue: daysAhead(21),
  },
  {
    id: "p2",
    nhsNumber: "612 004 8821",
    name: "James O'Connor",
    dob: "1958-07-29",
    age: 67,
    sex: "Male",
    gpPractice: "Parkview Surgery",
    pharmacy: "Lloyds — Market Square",
    conditions: ["COPD", "Anxiety", "Osteoarthritis"],
    allergies: [{ substance: "Aspirin", reaction: "Bronchospasm", severity: "Severe" }],
    medications: [
      { id: "m5", name: "Tiotropium", dose: "18mcg", form: "Inhaler (OD)", indication: "COPD maintenance", startDate: "2020-01-15", expectedCollection: daysAgo(2), actualCollection: daysAgo(1), prescriber: "Dr S. Khan", quantity: "1 inhaler", status: "active" },
      { id: "m6", name: "Sertraline", dose: "50mg", form: "Tablet (OD)", indication: "Generalised anxiety", startDate: "2023-04-10", expectedCollection: daysAgo(5), actualCollection: null, prescriber: "Dr S. Khan", quantity: "28 tablets", status: "missed" },
      { id: "m7", name: "Naproxen", dose: "500mg", form: "Tablet (BD PRN)", indication: "Osteoarthritis pain", startDate: "2022-08-03", expectedCollection: daysAgo(1), actualCollection: daysAgo(1), prescriber: "Dr S. Khan", quantity: "56 tablets", status: "active" },
    ],
    recentResponses: [
      { medicationName: "Sertraline", reason: "I am worried about side effects", respondedAt: daysAgo(4) },
    ],
    flags: ["high"],
    reviewDue: daysAhead(14),
  },
  {
    id: "p3",
    nhsNumber: "203 998 1147",
    name: "Aisha Rahman",
    dob: "1989-11-02",
    age: 35,
    sex: "Female",
    gpPractice: "Riverside Medical Centre",
    pharmacy: "Boots — High Street",
    conditions: ["Asthma", "Eczema"],
    allergies: [],
    medications: [
      { id: "m8", name: "Salbutamol", dose: "100mcg", form: "Inhaler (PRN)", indication: "Asthma reliever", startDate: "2010-05-20", expectedCollection: daysAhead(5), actualCollection: null, prescriber: "Dr R. Patel", quantity: "1 inhaler", status: "active" },
      { id: "m9", name: "Beclometasone", dose: "200mcg", form: "Inhaler (BD)", indication: "Asthma preventer", startDate: "2015-03-11", expectedCollection: daysAgo(1), actualCollection: daysAgo(1), prescriber: "Dr R. Patel", quantity: "1 inhaler", status: "active" },
    ],
    recentResponses: [],
    flags: [],
  },
  {
    id: "p4",
    nhsNumber: "771 332 5099",
    name: "David Thompson",
    dob: "1951-12-08",
    age: 73,
    sex: "Male",
    gpPractice: "Beechwood Health",
    pharmacy: "Well Pharmacy — Clifton Rd",
    conditions: ["Heart failure", "CKD stage 3", "Type 2 diabetes", "Gout"],
    allergies: [{ substance: "Sulfonamides", reaction: "Rash", severity: "Moderate" }],
    medications: [
      { id: "m10", name: "Furosemide", dose: "40mg", form: "Tablet (OD)", indication: "Heart failure", startDate: "2019-08-04", expectedCollection: daysAgo(15), actualCollection: null, prescriber: "Dr M. Lewis", quantity: "28 tablets", status: "missed" },
      { id: "m11", name: "Bisoprolol", dose: "2.5mg", form: "Tablet (OD)", indication: "Heart failure", startDate: "2020-02-18", expectedCollection: daysAgo(15), actualCollection: null, prescriber: "Dr M. Lewis", quantity: "28 tablets", status: "missed" },
      { id: "m12", name: "Allopurinol", dose: "100mg", form: "Tablet (OD)", indication: "Gout prophylaxis", startDate: "2017-06-30", expectedCollection: daysAgo(18), actualCollection: null, prescriber: "Dr M. Lewis", quantity: "28 tablets", status: "missed" },
      { id: "m13", name: "Gliclazide", dose: "80mg", form: "Tablet (BD)", indication: "Type 2 diabetes", startDate: "2018-04-12", expectedCollection: daysAgo(10), actualCollection: daysAgo(8), prescriber: "Dr M. Lewis", quantity: "56 tablets", status: "active" },
    ],
    recentResponses: [
      { medicationName: "Furosemide", reason: "I already have enough at home", respondedAt: daysAgo(14) },
      { medicationName: "Allopurinol", reason: "I no longer think I need it", respondedAt: daysAgo(17) },
    ],
    flags: ["critical", "high"],
    reviewDue: daysAhead(7),
  },
  {
    id: "p5",
    nhsNumber: "558 102 4471",
    name: "Sophie Bennett",
    dob: "1995-04-17",
    age: 29,
    sex: "Female",
    gpPractice: "Parkview Surgery",
    pharmacy: "Superdrug — North End",
    conditions: ["Migraine", "Iron deficiency anaemia"],
    allergies: [],
    medications: [
      { id: "m14", name: "Sumatriptan", dose: "50mg", form: "Tablet (PRN)", indication: "Acute migraine", startDate: "2022-10-05", expectedCollection: daysAhead(10), actualCollection: null, prescriber: "Dr S. Khan", quantity: "12 tablets", status: "active" },
      { id: "m15", name: "Ferrous sulfate", dose: "200mg", form: "Tablet (OD)", indication: "Iron deficiency", startDate: "2024-01-20", expectedCollection: daysAgo(4), actualCollection: null, prescriber: "Dr S. Khan", quantity: "28 tablets", status: "missed" },
    ],
    recentResponses: [
      { medicationName: "Ferrous sulfate", reason: "I am worried about side effects", respondedAt: daysAgo(3) },
    ],
    flags: ["moderate"],
  },
  {
    id: "p6",
    nhsNumber: "904 661 2208",
    name: "Robert McAllister",
    dob: "1947-01-22",
    age: 78,
    sex: "Male",
    gpPractice: "Beechwood Health",
    pharmacy: "Lloyds — Market Square",
    conditions: ["Parkinson's disease", "Depression", "BPH"],
    allergies: [{ substance: "Latex", reaction: "Contact dermatitis", severity: "Mild" }],
    medications: [
      { id: "m16", name: "Co-careldopa", dose: "25/100mg", form: "Tablet (TDS)", indication: "Parkinson's disease", startDate: "2019-07-09", expectedCollection: daysAgo(1), actualCollection: daysAgo(1), prescriber: "Dr M. Lewis", quantity: "84 tablets", status: "active" },
      { id: "m17", name: "Mirtazapine", dose: "15mg", form: "Tablet (OD nocte)", indication: "Depression", startDate: "2023-09-14", expectedCollection: daysAgo(6), actualCollection: null, prescriber: "Dr M. Lewis", quantity: "28 tablets", status: "missed" },
      { id: "m18", name: "Tamsulosin", dose: "400mcg", form: "Capsule MR (OD)", indication: "BPH", startDate: "2021-05-11", expectedCollection: daysAhead(3), actualCollection: null, prescriber: "Dr M. Lewis", quantity: "28 capsules", status: "active" },
    ],
    recentResponses: [
      { medicationName: "Mirtazapine", reason: "I do not understand what it is for", respondedAt: daysAgo(5) },
    ],
    flags: ["high"],
    reviewDue: daysAhead(28),
  },
];

export const returns: ReturnedMedicine[] = [
  { id: "r1", patientId: "p1", patientName: "Margaret Whitfield", medicine: "Ramipril 5mg capsules", quantity: "84 capsules (3 packs)", dateReturned: daysAgo(2), condition: "Unopened", reason: "Over-ordering", pharmacy: "Boots — High Street", loggedBy: "P. Sharma (Pharmacist)", notes: "Patient said she had a build-up at home." },
  { id: "r2", patientId: "p4", patientName: "David Thompson", medicine: "Furosemide 40mg tablets", quantity: "56 tablets (2 packs)", dateReturned: daysAgo(5), condition: "Unopened", reason: "Over-ordering", pharmacy: "Well Pharmacy — Clifton Rd", loggedBy: "J. Adeyemi (Technician)" },
  { id: "r3", patientId: "p2", patientName: "James O'Connor", medicine: "Sertraline 50mg tablets", quantity: "21 tablets", dateReturned: daysAgo(6), condition: "Partly used", reason: "Side effects", pharmacy: "Lloyds — Market Square", loggedBy: "P. Sharma (Pharmacist)", notes: "Reported nausea and insomnia." },
  { id: "r4", patientId: "p4", patientName: "David Thompson", medicine: "Allopurinol 100mg tablets", quantity: "28 tablets", dateReturned: daysAgo(9), condition: "Unopened", reason: "Medication change", pharmacy: "Well Pharmacy — Clifton Rd", loggedBy: "J. Adeyemi (Technician)" },
  { id: "r5", patientId: "p5", patientName: "Sophie Bennett", medicine: "Ferrous sulfate 200mg", quantity: "14 tablets", dateReturned: daysAgo(3), condition: "Partly used", reason: "Side effects", pharmacy: "Superdrug — North End", loggedBy: "L. Foster (Pharmacist)", notes: "GI upset." },
  { id: "r6", patientId: "p6", patientName: "Robert McAllister", medicine: "Mirtazapine 15mg tablets", quantity: "28 tablets", dateReturned: daysAgo(4), condition: "Unopened", reason: "Confusion", pharmacy: "Lloyds — Market Square", loggedBy: "P. Sharma (Pharmacist)", notes: "Carer unsure of indication." },
  { id: "r7", patientId: "p1", patientName: "Margaret Whitfield", medicine: "Metformin 500mg tablets", quantity: "112 tablets (4 packs)", dateReturned: daysAgo(20), condition: "Expired", reason: "Forgetfulness", pharmacy: "Boots — High Street", loggedBy: "P. Sharma (Pharmacist)" },
];

export const wasteAlerts: WasteAlert[] = [
  {
    id: "a1",
    patientId: "p4",
    patientName: "David Thompson",
    nhsNumber: "771 332 5099",
    type: "Repeated missed collection",
    detail: "3 medicines (Furosemide, Bisoprolol, Allopurinol) not collected in last 18 days. Patient reports oversupply at home.",
    severity: "critical",
    detectedAt: daysAgo(1),
    recommendedAction: "Urgent structured medication review within 7 days. Contact patient to assess adherence and clinical need.",
    estimatedWasteValue: 84,
  },
  {
    id: "a2",
    patientId: "p1",
    patientName: "Margaret Whitfield",
    nhsNumber: "485 777 3456",
    type: "Oversupply pattern",
    detail: "Patient returned 3 packs of Ramipril unopened citing 'enough at home'. History suggests repeat issued before previous supply finished.",
    severity: "high",
    detectedAt: daysAgo(2),
    recommendedAction: "Adjust repeat cycle. Consider pharmacist-led adherence review at next collection.",
    estimatedWasteValue: 36,
  },
  {
    id: "a3",
    patientId: "p2",
    patientName: "James O'Connor",
    nhsNumber: "612 004 8821",
    type: "Side effect cluster",
    detail: "Sertraline returned partly used; patient reported nausea and insomnia via app. Missed last collection.",
    severity: "high",
    detectedAt: daysAgo(4),
    recommendedAction: "GP review — consider alternative SSRI or dose adjustment. Document tolerability discussion.",
    estimatedWasteValue: 12,
  },
  {
    id: "a4",
    patientId: "p6",
    patientName: "Robert McAllister",
    nhsNumber: "904 661 2208",
    type: "No-longer-needed reports",
    detail: "Mirtazapine returned unopened. Patient (and carer) unclear on indication — possible communication gap.",
    severity: "high",
    detectedAt: daysAgo(4),
    recommendedAction: "Schedule medication review with carer present. Provide written indication summary.",
    estimatedWasteValue: 18,
  },
  {
    id: "a5",
    patientId: "p5",
    patientName: "Sophie Bennett",
    nhsNumber: "558 102 4471",
    type: "Side effect cluster",
    detail: "Ferrous sulfate returned partly used citing GI upset. Common cause of non-adherence.",
    severity: "moderate",
    detectedAt: daysAgo(3),
    recommendedAction: "Consider switching to ferrous fumarate or alternate-day dosing. Review at 4 weeks.",
    estimatedWasteValue: 6,
  },
  {
    id: "a6",
    patientId: "p1",
    patientName: "Margaret Whitfield",
    nhsNumber: "485 777 3456",
    type: "Frequent returns",
    detail: "2 returns in past 30 days (Metformin expired, Ramipril unopened). Cognitive impairment may be a factor.",
    severity: "moderate",
    detectedAt: daysAgo(2),
    recommendedAction: "Consider compliance aid (dosette box) and family/carer involvement.",
    estimatedWasteValue: 48,
  },
];
