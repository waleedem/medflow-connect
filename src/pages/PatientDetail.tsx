import { Link, useParams } from "react-router-dom";
import { patients, returns, wasteAlerts } from "@/data/demo";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Pill, PackageOpen, MessageSquare, CalendarClock, ShieldAlert, ClipboardList } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { SeverityBadge } from "@/components/SeverityBadge";
import { cn } from "@/lib/utils";

const PatientDetail = () => {
  const { id } = useParams();
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return (
      <div className="p-10">
        <Link to="/patients" className="text-primary text-sm">← Back to patients</Link>
        <h1 className="mt-4 text-xl">Patient not found</h1>
      </div>
    );
  }
  const patientReturns = returns.filter(r => r.patientId === patient.id);
  const patientAlerts = wasteAlerts.filter(a => a.patientId === patient.id);

  return (
    <div>
      <div className="bg-gradient-header text-primary-foreground">
        <div className="px-6 lg:px-10 py-6 max-w-[1400px] mx-auto">
          <Link to="/patients" className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-3">
            <ArrowLeft className="w-4 h-4" /> All patients
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl">{patient.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary-foreground/85 mt-2">
                <span><span className="text-primary-foreground/60">DOB</span> {format(new Date(patient.dob), "d MMM yyyy")} ({patient.age}y)</span>
                <span><span className="text-primary-foreground/60">Sex</span> {patient.sex}</span>
                <span><span className="text-primary-foreground/60">NHS</span> <span className="font-mono">{patient.nhsNumber}</span></span>
                <span><span className="text-primary-foreground/60">GP</span> {patient.gpPractice}</span>
                <span><span className="text-primary-foreground/60">Pharmacy</span> {patient.pharmacy}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {patient.flags.map((f, i) => <SeverityBadge key={i} severity={f} />)}
              {patient.reviewDue && (
                <div className="bg-primary-foreground/15 backdrop-blur px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                  <CalendarClock className="w-4 h-4" />
                  Review by <strong>{format(new Date(patient.reviewDue), "d MMM yyyy")}</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active alerts */}
          {patientAlerts.length > 0 && (
            <Card className="p-0 overflow-hidden shadow-card border-l-4 border-l-destructive">
              <div className="px-5 py-4 border-b flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="font-semibold">Active waste alerts</h2>
              </div>
              <div className="divide-y">
                {patientAlerts.map(a => (
                  <div key={a.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={a.severity} />
                          <span className="font-medium">{a.type}</span>
                        </div>
                        <p className="text-sm text-foreground/80 mt-2">{a.detail}</p>
                        <div className="mt-3 bg-info-soft border border-info/15 rounded-md px-3 py-2 text-sm">
                          <span className="font-semibold text-info">Recommended: </span>
                          <span className="text-foreground/80">{a.recommendedAction}</span>
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        <div className="text-base font-semibold text-foreground">£{a.estimatedWasteValue}</div>
                        est. waste
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Medications */}
          <Card className="p-0 overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Current medications</h2>
              <span className="text-xs text-muted-foreground ml-1">({patient.medications.length})</span>
            </div>
            <div className="divide-y">
              {patient.medications.map(m => {
                const statusMap = {
                  active: "bg-success-soft text-success",
                  missed: "bg-destructive-soft text-destructive",
                  discontinued: "bg-muted text-muted-foreground",
                };
                return (
                  <div key={m.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{m.name} {m.dose}</span>
                          <span className="text-xs text-muted-foreground">· {m.form}</span>
                          <span className={cn("text-xs px-2 py-0.5 rounded font-medium uppercase tracking-wide", statusMap[m.status])}>
                            {m.status === "missed" ? "Missed collection" : m.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">For: {m.indication}</div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                          <Field label="Started" value={format(new Date(m.startDate), "d MMM yyyy")} />
                          <Field label="Quantity" value={m.quantity} />
                          <Field label="Expected collection" value={format(new Date(m.expectedCollection), "d MMM")} />
                          <Field
                            label="Actual collection"
                            value={m.actualCollection ? format(new Date(m.actualCollection), "d MMM") : "—"}
                            tone={m.status === "missed" ? "destructive" : undefined}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Returns history */}
          <Card className="p-0 overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-accent" />
              <h2 className="font-semibold">Returns history</h2>
            </div>
            {patientReturns.length === 0 ? (
              <div className="px-5 py-8 text-sm text-muted-foreground text-center">No returns logged.</div>
            ) : (
              <div className="divide-y">
                {patientReturns.map(r => (
                  <div key={r.id} className="px-5 py-4 grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-12 sm:col-span-5">
                      <div className="font-medium text-sm">{r.medicine}</div>
                      <div className="text-xs text-muted-foreground">{r.quantity}</div>
                    </div>
                    <div className="col-span-6 sm:col-span-3 text-sm">
                      <div className="text-xs text-muted-foreground">Reason</div>
                      <div>{r.reason}</div>
                    </div>
                    <div className="col-span-6 sm:col-span-2 text-sm">
                      <div className="text-xs text-muted-foreground">Condition</div>
                      <div>{r.condition}</div>
                    </div>
                    <div className="col-span-12 sm:col-span-2 text-sm sm:text-right">
                      <div className="text-xs text-muted-foreground">Returned</div>
                      <div>{format(new Date(r.dateReturned), "d MMM")}</div>
                    </div>
                    {r.notes && (
                      <div className="col-span-12 text-xs italic text-muted-foreground mt-1">"{r.notes}" — {r.loggedBy}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Conditions */}
          <Card className="p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Medical history</h2>
            </div>
            <ul className="space-y-1.5">
              {patient.conditions.map(c => (
                <li key={c} className="text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>

          {/* Allergies */}
          <Card className="p-5 shadow-card border-l-4 border-l-warning">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-warning" />
              <h2 className="font-semibold">Allergies & ADRs</h2>
            </div>
            {patient.allergies.length === 0 ? (
              <div className="text-sm text-muted-foreground">No known drug allergies recorded.</div>
            ) : (
              <ul className="space-y-2.5">
                {patient.allergies.map(a => (
                  <li key={a.substance} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{a.substance}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-semibold uppercase",
                        a.severity === "Severe" && "bg-destructive text-destructive-foreground",
                        a.severity === "Moderate" && "bg-warning text-warning-foreground",
                        a.severity === "Mild" && "bg-muted text-muted-foreground"
                      )}>{a.severity}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.reaction}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Patient app responses */}
          <Card className="p-5 shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-accent" />
              <h2 className="font-semibold">Patient app responses</h2>
            </div>
            {patient.recentResponses.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent responses.</div>
            ) : (
              <ul className="space-y-3">
                {patient.recentResponses.map((r, i) => (
                  <li key={i} className="text-sm border-l-2 border-accent/40 pl-3">
                    <div className="font-medium">{r.medicationName}</div>
                    <div className="text-foreground/80 italic">"{r.reason}"</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(r.respondedAt), { addSuffix: true })}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, tone }: { label: string; value: string; tone?: "destructive" }) => (
  <div>
    <div className="text-muted-foreground uppercase tracking-wide text-[10px] font-semibold">{label}</div>
    <div className={cn("font-medium mt-0.5", tone === "destructive" && "text-destructive")}>{value}</div>
  </div>
);

export default PatientDetail;
