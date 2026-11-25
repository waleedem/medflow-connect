import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CalendarClock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { usePlatform } from "@/context/PlatformContext";
import { REVIEW_CAUSES, type ReviewCause, type TimelineEventType } from "@/data/medicinesData";
import { evaluatePatientFlags } from "@/lib/wasteFlags";

const EVENT_LABELS: Record<TimelineEventType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  prescribed: { label: "Prescribed", variant: "secondary" },
  dispensed: { label: "Dispensed", variant: "outline" },
  collected: { label: "Collected", variant: "default" },
  missed: { label: "Missed collection", variant: "destructive" },
};

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { patients, returns, reviews, scheduleReview } = usePlatform();

  const patient = patients.find((p) => p.id === id);
  const [open, setOpen] = useState(false);
  const [cause, setCause] = useState<ReviewCause>("Side effects");
  const [weeks, setWeeks] = useState("4");
  const [team, setTeam] = useState("Oakfield Clinical Pharmacist");
  const [notes, setNotes] = useState("");

  if (!patient) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/patients" className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to patients</Link>
        </Button>
        <Card><CardContent className="py-10 text-center text-muted-foreground">Patient record not found.</CardContent></Card>
      </div>
    );
  }

  const flags = evaluatePatientFlags(patient, returns);
  const patientReturns = returns.filter((r) => r.patientId === patient.id);
  const patientReviews = reviews.filter((r) => r.patientId === patient.id);
  const hasAllergy = patient.allergies.some((a) => !a.toLowerCase().includes("no known"));

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const created = scheduleReview({
      patientId: patient.id,
      suspectedCause: cause,
      weeksWindow: Number(weeks),
      assignedTeam: team,
      notes: notes || `Structured medication review triggered (${cause.toLowerCase()}).`,
    });
    toast.success(`Medication review scheduled (due ${created.dueDate}).`);
    setOpen(false);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/patients" className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back to patients</Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border bg-card p-5">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-foreground">{patient.name}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span>DOB: <strong className="text-foreground">{patient.dob}</strong></span>
            <span>NHS: <strong className="font-mono text-foreground">{patient.nhsNumber}</strong></span>
            <span>Practice: <strong className="text-foreground">{patient.gpPractice}</strong></span>
          </div>
          <div className="flex items-center gap-2 pt-1 text-sm">
            <ShieldAlert className={`h-4 w-4 ${hasAllergy ? "text-destructive" : "text-success"}`} aria-hidden="true" />
            <span className={hasAllergy ? "font-semibold text-destructive" : "text-muted-foreground"}>
              Allergies: {patient.allergies.join(", ")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link to={`/returns/new?patientId=${patient.id}`}>Log return</Link>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <CalendarClock className="h-4 w-4" aria-hidden="true" /> Schedule medication review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule structured medication review</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSchedule} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="review-cause">Suspected cause</Label>
                  <Select value={cause} onValueChange={(v) => setCause(v as ReviewCause)}>
                    <SelectTrigger id="review-cause"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {REVIEW_CAUSES.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="review-weeks">Target timeframe</Label>
                    <Select value={weeks} onValueChange={setWeeks}>
                      <SelectTrigger id="review-weeks"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">Within 4 weeks</SelectItem>
                        <SelectItem value="5">Within 5 weeks</SelectItem>
                        <SelectItem value="6">Within 6 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="review-team">Assigned team</Label>
                    <Input id="review-team" value={team} onChange={(e) => setTeam(e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="review-notes">Clinical notes</Label>
                  <Textarea id="review-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Key questions to explore with the patient..." rows={3} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit">Confirm review</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {flags.length > 0 && (
        <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-4" aria-label="Waste and adherence flags">
          <div className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Active waste &amp; adherence flags ({flags.length})
          </div>
          <ul className="space-y-2">
            {flags.map((flag) => (
              <li key={flag.type} className="flex flex-wrap items-baseline gap-2 text-sm">
                <Badge variant={flag.severity === "high" ? "destructive" : "secondary"}>{flag.label}</Badge>
                <span className="text-foreground">{flag.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Conditions &amp; past history</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Active conditions</p>
              <div className="flex flex-wrap gap-1.5">
                {patient.conditions.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Past medical history</p>
              <ul className="list-disc space-y-1 pl-4 text-foreground">
                {patient.pastHistory.map((h) => <li key={h}>{h}</li>)}
              </ul>
            </div>
            {patientReviews.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scheduled reviews</p>
                <ul className="space-y-1.5">
                  {patientReviews.map((rev) => (
                    <li key={rev.id} className="rounded border bg-muted/40 p-2 text-xs">
                      <span className="font-semibold text-foreground">{rev.suspectedCause}</span> · Due {rev.dueDate} ({rev.status})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-base">Current prescribed medicines</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Dose &amp; frequency</TableHead>
                    <TableHead>Prescriber</TableHead>
                    <TableHead>Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patient.medicines.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell className="font-semibold text-foreground">{med.name}</TableCell>
                      <TableCell>{med.dose} · {med.frequency}</TableCell>
                      <TableCell className="text-muted-foreground">{med.prescriber}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{med.startDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Prescribing, dispensing &amp; collection timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {patient.timeline.map((ev) => {
                const meta = EVENT_LABELS[ev.type];
                return (
                  <li key={ev.id} className="rounded-md border p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <span className="font-semibold text-foreground">{ev.medicine}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{ev.date}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{ev.source}{ev.quantity ? ` · Qty ${ev.quantity}` : ""}</p>
                    <p className="mt-1 text-foreground">{ev.note}</p>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Medicines returns log</CardTitle></CardHeader>
          <CardContent className="p-0">
            {patientReturns.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No returned medicines recorded for this patient.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date &amp; medicine</TableHead>
                      <TableHead>Qty / condition</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientReturns.map((ret) => (
                      <TableRow key={ret.id}>
                        <TableCell>
                          <div className="font-semibold text-foreground">{ret.medicine}</div>
                          <div className="text-xs text-muted-foreground">{ret.date} · £{ret.estimatedCostGbp}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>{ret.quantity} {ret.unit}</div>
                          <Badge variant="outline" className="mt-1">{ret.condition}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-foreground">{ret.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}