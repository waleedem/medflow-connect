# Medicines Feedback Loop Platform - First Version

The preview is blank because nothing has been built yet: my earlier questions were never answered. This plan uses sensible defaults so we can start now.

## Defaults chosen
- Scope: full clinician dashboard with realistic demo data (no login yet; can add Lovable Cloud later)
- Style: NHS-inspired clinical (white, NHS blue accents, high contrast, accessible)
- Centerpiece: patient detail view, plus a practice-wide alerts dashboard

## Pages
1. **Alerts dashboard (home)** - summary cards (flagged patients, pending reviews, returns this month, estimated waste cost), flagged patient list, returns trend chart.
2. **Patients list** - searchable table with name, DOB, NHS number, flag status.
3. **Patient detail** - name, DOB, conditions and history, allergies, current medicines, prescribing/dispensing/collection timeline, returns log (medicine, quantity, condition, reason), waste flags with explanation, "Schedule medication review" (4-6 weeks) action.
4. **Log a return** - quick form for pharmacy staff.
5. **Medication reviews** - list of scheduled/pending reviews with suspected cause (understanding, side effects, overprescribing, forgetfulness, changing need, access barriers).

## Technical details
- React Router routes, sidebar layout, shadcn components, Recharts for trends
- Demo data in a local module; flag rules (repeated missed collections, frequent returns, oversupply) in a pure function with unit tests
- Design tokens in index.css, app title/meta in index.html
