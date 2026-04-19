import { useState } from "react";
import { Card } from "@/components/ui/card";
import { patients, type MissedReason } from "@/data/demo";
import { Smartphone, Bell, Check, Pill, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const reasons: MissedReason[] = [
  "I forgot",
  "I no longer think I need it",
  "I am worried about side effects",
  "I do not understand what it is for",
  "I already have enough at home",
  "I was unable to collect it",
];

const PatientApp = () => {
  // Pick a patient with a missed medication for the demo
  const patient = patients.find(p => p.medications.some(m => m.status === "missed")) ?? patients[0];
  const missedMed = patient.medications.find(m => m.status === "missed") ?? patient.medications[0];

  const [view, setView] = useState<"prompt" | "reasons" | "sent">("prompt");
  const [selected, setSelected] = useState<MissedReason | null>(null);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-primary" /> Patient app preview
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Simulation of the prompt delivered to a patient when an early waste signal is detected (e.g. a missed
          collection). Patient responses feed directly back into the clinician dashboard, closing the feedback loop
          between prescribing, dispensing and real-world use.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Phone mock */}
        <div className="flex justify-center">
          <div className="relative w-[320px] h-[640px] rounded-[42px] bg-foreground p-3 shadow-elevated">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground rounded-b-2xl z-10" />
            <div className="w-full h-full rounded-[32px] bg-background overflow-hidden flex flex-col">
              {/* Status bar */}
              <div className="px-5 pt-3 pb-2 text-[10px] flex justify-between text-muted-foreground">
                <span>{format(new Date(), "HH:mm")}</span>
                <span>NHS App</span>
              </div>

              {view === "prompt" && (
                <div className="flex-1 px-5 py-4 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                      <Pill className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="text-sm font-semibold">My Medicines</div>
                  </div>

                  <Card className="p-4 border-warning/30 bg-warning-soft">
                    <div className="flex items-start gap-2">
                      <Bell className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <div className="font-semibold text-foreground">Missed collection</div>
                        <div className="text-muted-foreground mt-0.5">
                          Your {missedMed.name} {missedMed.dose} was due to be collected from {patient.pharmacy}.
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="mt-5 text-sm">
                    <div className="font-medium">Hi {patient.name.split(" ")[0]},</div>
                    <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
                      We noticed you haven't picked up your <span className="font-medium text-foreground">{missedMed.name}</span>.
                      Telling us why helps your care team make sure your medicines are right for you.
                    </p>
                  </div>

                  <button
                    onClick={() => setView("reasons")}
                    className="mt-auto bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    Tell us why <ChevronRight className="w-4 h-4" />
                  </button>
                  <button className="text-xs text-muted-foreground mt-2 py-2">Remind me later</button>
                </div>
              )}

              {view === "reasons" && (
                <div className="flex-1 px-5 py-4 flex flex-col">
                  <button onClick={() => setView("prompt")} className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <ArrowLeft className="w-3 h-3" /> Back
                  </button>
                  <div className="text-sm font-semibold">Why did you not collect it?</div>
                  <p className="text-xs text-muted-foreground mt-1">Choose the option that best fits.</p>

                  <div className="mt-3 space-y-1.5 flex-1 overflow-y-auto">
                    {reasons.map(r => (
                      <button
                        key={r}
                        onClick={() => setSelected(r)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-md border text-xs transition-colors",
                          selected === r
                            ? "border-primary bg-primary-soft text-foreground"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!selected}
                    onClick={() => setView("sent")}
                    className="mt-3 bg-primary text-primary-foreground rounded-lg py-3 text-sm font-medium disabled:opacity-40"
                  >
                    Send response
                  </button>
                </div>
              )}

              {view === "sent" && (
                <div className="flex-1 px-5 py-4 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-full bg-success-soft flex items-center justify-center mb-3">
                    <Check className="w-7 h-7 text-success" />
                  </div>
                  <div className="text-sm font-semibold">Thank you</div>
                  <p className="text-xs text-muted-foreground mt-2 max-w-[220px]">
                    Your response has been shared with your care team. They may contact you to review your medicines.
                  </p>
                  <button
                    onClick={() => { setView("prompt"); setSelected(null); }}
                    className="mt-6 text-xs text-primary"
                  >
                    Restart demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explainer */}
        <div className="space-y-4">
          <Card className="p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">The feedback loop</div>
            <h2 className="font-semibold mt-1">From early signal to clinical action</h2>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                "System detects a missed or late collection from dispensing data.",
                "Patient receives a prompt in the linked app asking why.",
                "Their response is captured and classified (forgot, side effects, no longer needed, etc).",
                "Pattern engine combines this with returns and prescribing data to flag avoidable waste.",
                "Clinician sees an alert in MediTrack and (optionally) inside their EHR with a recommended action.",
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-soft text-primary text-xs font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-foreground/85">{s}</span>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Demo patient</div>
            <div className="font-semibold mt-1">{patient.name}</div>
            <div className="text-xs text-muted-foreground">NHS {patient.nhsNumber} · {patient.gpPractice}</div>
            <div className="mt-3 text-sm">
              Triggering medication: <span className="font-medium">{missedMed.name} {missedMed.dose}</span>
            </div>
            <div className="text-xs text-muted-foreground">Indication: {missedMed.indication}</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientApp;
