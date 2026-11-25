export type TimelineEventType = "prescribed" | "dispensed" | "collected" | "missed";
export type ReturnCondition = "Unopened" | "Part-used" | "Expired" | "Damaged";
export type ReviewCause =
  | "Poor understanding"
  | "Side effects"
  | "Overprescribing"
  | "Forgetfulness"
  | "Changing clinical need"
  | "Practical barriers to collection";
export type ReviewStatus = "Scheduled" | "Completed";

export interface MedicineItem {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  monthlyUnits: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: TimelineEventType;
  medicine: string;
  source: string;
  quantity?: number;
  note: string;
}

export interface MedicineReturn {
  id: string;
  patientId: string;
  date: string;
  medicine: string;
  quantity: number;
  unit: string;
  condition: ReturnCondition;
  reason: string;
  estimatedCostGbp: number;
  loggedBy: string;
}

export interface MedicationReview {
  id: string;
  patientId: string;
  scheduledDate: string;
  dueDate: string;
  suspectedCause: ReviewCause;
  status: ReviewStatus;
  assignedTeam: string;
  notes: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  dob: string;
  nhsNumber: string;
  gpPractice: string;
  conditions: string[];
  pastHistory: string[];
  allergies: string[];
  medicines: MedicineItem[];
  timeline: TimelineEvent[];
}

export const REVIEW_CAUSES: ReviewCause[] = [
  "Poor understanding",
  "Side effects",
  "Overprescribing",
  "Forgetfulness",
  "Changing clinical need",
  "Practical barriers to collection",
];

export const RETURN_CONDITIONS: ReturnCondition[] = [
  "Unopened",
  "Part-used",
  "Expired",
  "Damaged",
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "pt-101",
    name: "Margaret Holloway",
    dob: "1948-04-12",
    nhsNumber: "485 777 3456",
    gpPractice: "Oakfield Medical Centre",
    conditions: ["COPD", "Type 2 diabetes", "Hypertension"],
    pastHistory: ["Community-acquired pneumonia (2024)", "Cataract surgery (2022)"],
    allergies: ["Penicillin (rash)"],
    medicines: [
      { id: "m-1", name: "Metformin 500mg tablets", dose: "500mg", frequency: "Twice daily", prescriber: "Dr H. Mensah", startDate: "2023-06-10", monthlyUnits: 56 },
      { id: "m-2", name: "Tiotropium 18mcg capsules", dose: "18mcg", frequency: "Once daily", prescriber: "Dr H. Mensah", startDate: "2024-02-14", monthlyUnits: 30 },
      { id: "m-3", name: "Amlodipine 5mg tablets", dose: "5mg", frequency: "Once daily", prescriber: "Dr H. Mensah", startDate: "2022-09-01", monthlyUnits: 28 },
    ],
    timeline: [
      { id: "t-1", date: "2026-11-18", type: "missed", medicine: "Metformin 500mg tablets", source: "High Street Pharmacy", note: "Uncollected after 21 days; returned to shelf." },
      { id: "t-2", date: "2026-11-01", type: "dispensed", medicine: "Metformin 500mg tablets", source: "High Street Pharmacy", quantity: 56, note: "Repeat prescription dispensed." },
      { id: "t-3", date: "2026-10-16", type: "missed", medicine: "Tiotropium 18mcg capsules", source: "High Street Pharmacy", note: "Second consecutive missed inhaler collection." },
      { id: "t-4", date: "2026-09-28", type: "prescribed", medicine: "Metformin 500mg tablets", source: "Oakfield Medical Centre", quantity: 56, note: "Auto-repeat issued." },
      { id: "t-5", date: "2026-09-12", type: "collected", medicine: "Amlodipine 5mg tablets", source: "High Street Pharmacy", quantity: 28, note: "Collected by daughter." },
    ],
  },
  {
    id: "pt-102",
    name: "David Okafor",
    dob: "1956-11-03",
    nhsNumber: "612 904 1182",
    gpPractice: "Oakfield Medical Centre",
    conditions: ["Atrial fibrillation", "Heart failure (NYHA II)"],
    pastHistory: ["Hospital admission for fluid overload (Aug 2026)", "Appendicectomy (1998)"],
    allergies: ["No known drug allergies"],
    medicines: [
      { id: "m-4", name: "Bisoprolol 2.5mg tablets", dose: "2.5mg", frequency: "Once daily", prescriber: "Dr S. Kaur", startDate: "2025-01-19", monthlyUnits: 28 },
      { id: "m-5", name: "Furosemide 40mg tablets", dose: "40mg", frequency: "Once daily", prescriber: "St Mary's Cardiology", startDate: "2026-08-22", monthlyUnits: 28 },
      { id: "m-6", name: "Apixaban 5mg tablets", dose: "5mg", frequency: "Twice daily", prescriber: "Dr S. Kaur", startDate: "2025-01-19", monthlyUnits: 56 },
    ],
    timeline: [
      { id: "t-6", date: "2026-11-15", type: "dispensed", medicine: "Furosemide 40mg tablets", source: "Canal Pharmacy", quantity: 84, note: "3-month supply dispensed despite recent hospital discharge pack." },
      { id: "t-7", date: "2026-11-02", type: "prescribed", medicine: "Furosemide 40mg tablets", source: "Oakfield Medical Centre", quantity: 84, note: "GP repeat overlapped with hospital TTO supply." },
      { id: "t-8", date: "2026-10-19", type: "collected", medicine: "Bisoprolol 2.5mg tablets", source: "Canal Pharmacy", quantity: 56, note: "Collected on time." },
    ],
  },
  {
    id: "pt-103",
    name: "Priya Patel",
    dob: "1984-07-29",
    nhsNumber: "739 218 6604",
    gpPractice: "Riverside Surgery",
    conditions: ["Asthma", "Atopic eczema"],
    pastHistory: ["Gestational diabetes (2019)"],
    allergies: ["Ibuprofen (wheeze)"],
    medicines: [
      { id: "m-7", name: "Beclometasone 100mcg inhaler", dose: "200mcg", frequency: "Twice daily", prescriber: "Dr R. Evans", startDate: "2024-05-10", monthlyUnits: 1 },
      { id: "m-8", name: "Salbutamol 100mcg inhaler", dose: "100-200mcg", frequency: "When required", prescriber: "Dr R. Evans", startDate: "2023-03-04", monthlyUnits: 1 },
    ],
    timeline: [
      { id: "t-9", date: "2026-11-10", type: "collected", medicine: "Salbutamol 100mcg inhaler", source: "Riverside Pharmacy", quantity: 1, note: "Collected at counter." },
      { id: "t-10", date: "2026-10-21", type: "prescribed", medicine: "Beclometasone 100mcg inhaler", source: "Riverside Surgery", quantity: 2, note: "Repeat issued via app." },
    ],
  },
  {
    id: "pt-104",
    name: "Thomas Reid",
    dob: "1969-02-17",
    nhsNumber: "501 382 9047",
    gpPractice: "Oakfield Medical Centre",
    conditions: ["Hypertension", "Osteoarthritis"],
    pastHistory: ["Right knee arthroscopy (2021)"],
    allergies: ["No known drug allergies"],
    medicines: [
      { id: "m-9", name: "Ramipril 5mg capsules", dose: "5mg", frequency: "Once daily", prescriber: "Dr H. Mensah", startDate: "2023-11-12", monthlyUnits: 28 },
      { id: "m-10", name: "Atorvastatin 20mg tablets", dose: "20mg", frequency: "At night", prescriber: "Dr H. Mensah", startDate: "2024-04-02", monthlyUnits: 28 },
    ],
    timeline: [
      { id: "t-11", date: "2026-11-14", type: "collected", medicine: "Ramipril 5mg capsules", source: "High Street Pharmacy", quantity: 28, note: "Collected promptly." },
      { id: "t-12", date: "2026-10-16", type: "collected", medicine: "Atorvastatin 20mg tablets", source: "High Street Pharmacy", quantity: 28, note: "Collected promptly." },
    ],
  },
];

export const INITIAL_RETURNS: MedicineReturn[] = [
  { id: "ret-1", patientId: "pt-101", date: "2026-11-19", medicine: "Metformin 500mg tablets", quantity: 112, unit: "tablets", condition: "Unopened", reason: "Stopped taking due to stomach upset; repeats kept arriving.", estimatedCostGbp: 18, loggedBy: "High Street Pharmacy" },
  { id: "ret-2", patientId: "pt-101", date: "2026-10-22", medicine: "Tiotropium 18mcg capsules", quantity: 60, unit: "capsules", condition: "Unopened", reason: "Unsure how to use dry-powder device.", estimatedCostGbp: 67, loggedBy: "High Street Pharmacy" },
  { id: "ret-3", patientId: "pt-102", date: "2026-11-16", medicine: "Furosemide 40mg tablets", quantity: 84, unit: "tablets", condition: "Unopened", reason: "Duplicate supply after hospital discharge.", estimatedCostGbp: 14, loggedBy: "Canal Pharmacy" },
  { id: "ret-4", patientId: "pt-103", date: "2026-11-12", medicine: "Beclometasone 100mcg inhaler", quantity: 2, unit: "inhalers", condition: "Unopened", reason: "Patient prefers reliever; unclear preventer needs daily use.", estimatedCostGbp: 24, loggedBy: "Riverside Pharmacy" },
  { id: "ret-5", patientId: "pt-103", date: "2026-09-29", medicine: "Beclometasone 100mcg inhaler", quantity: 1, unit: "inhalers", condition: "Part-used", reason: "Mild hoarseness; stopped using.", estimatedCostGbp: 12, loggedBy: "Riverside Pharmacy" },
];

export const INITIAL_REVIEWS: MedicationReview[] = [
  {
    id: "rev-1",
    patientId: "pt-101",
    scheduledDate: "2026-11-20",
    dueDate: "2026-12-22",
    suspectedCause: "Side effects",
    status: "Scheduled",
    assignedTeam: "Oakfield Clinical Pharmacist",
    notes: "Review metformin GI tolerance and check tiotropium inhaler technique within 4-6 weeks.",
  },
  {
    id: "rev-2",
    patientId: "pt-102",
    scheduledDate: "2026-11-17",
    dueDate: "2026-12-18",
    suspectedCause: "Overprescribing",
    status: "Scheduled",
    assignedTeam: "Hospital-GP Medicines Reconciliation",
    notes: "Reconcile post-discharge diuretic repeat quantities and pause auto-issue.",
  },
];

export const MONTHLY_RETURNS_BASELINE = [
  { month: "Jun", returns: 9, costGbp: 295 },
  { month: "Jul", returns: 12, costGbp: 410 },
  { month: "Aug", returns: 11, costGbp: 365 },
  { month: "Sep", returns: 14, costGbp: 480 },
  { month: "Oct", returns: 13, costGbp: 445 },
];