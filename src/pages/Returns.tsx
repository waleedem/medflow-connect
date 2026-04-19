import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { returns as initialReturns, patients, type ReturnedMedicine, type PackCondition, type ReturnReason } from "@/data/demo";
import { PackageOpen, Plus, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const reasonOptions: ReturnReason[] = ["Side effects", "Medication change", "Symptom resolved", "Confusion", "Forgetfulness", "Over-ordering", "Patient deceased", "Other"];
const conditionOptions: PackCondition[] = ["Unopened", "Partly used", "Expired"];

const Returns = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<ReturnedMedicine[]>(initialReturns);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    medicine: "",
    quantity: "",
    condition: "Unopened" as PackCondition,
    reason: "Over-ordering" as ReturnReason,
    notes: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === form.patientId);
    if (!patient || !form.medicine.trim() || !form.quantity.trim()) {
      toast({ title: "Missing details", description: "Please complete patient, medicine and quantity.", variant: "destructive" });
      return;
    }
    const entry: ReturnedMedicine = {
      id: `r${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      medicine: form.medicine,
      quantity: form.quantity,
      dateReturned: new Date().toISOString(),
      condition: form.condition,
      reason: form.reason,
      pharmacy: patient.pharmacy,
      loggedBy: "Dr R. Patel",
      notes: form.notes || undefined,
    };
    setItems([entry, ...items]);
    setOpen(false);
    setForm({ patientId: "", medicine: "", quantity: "", condition: "Unopened", reason: "Over-ordering", notes: "" });
    toast({ title: "Return logged", description: `${entry.medicine} for ${entry.patientName}` });
  };

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl flex items-center gap-2"><PackageOpen className="w-6 h-6 text-accent" /> Returns log</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} medicines returned across linked pharmacies</p>
        </div>
        <Button onClick={() => setOpen(o => !o)} className="gap-2">
          <Plus className="w-4 h-4" /> Log a return
        </Button>
      </div>

      {open && (
        <Card className="p-6 mb-6 shadow-elevated animate-fade-in">
          <h2 className="font-semibold mb-4">New return entry</h2>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-1">
              <Label>Patient</Label>
              <Select value={form.patientId} onValueChange={v => setForm({ ...form, patientId: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name} · NHS {p.nhsNumber}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Medicine</Label>
              <Input className="mt-1.5" placeholder="e.g. Ramipril 5mg capsules" value={form.medicine} onChange={e => setForm({ ...form, medicine: e.target.value })} />
            </div>
            <div>
              <Label>Quantity returned</Label>
              <Input className="mt-1.5" placeholder="e.g. 28 tablets" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div>
              <Label>Pack condition</Label>
              <Select value={form.condition} onValueChange={v => setForm({ ...form, condition: v as PackCondition })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditionOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Likely reason</Label>
              <Select value={form.reason} onValueChange={v => setForm({ ...form, reason: v as ReturnReason })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {reasonOptions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea className="mt-1.5" placeholder="Any context from the patient or carer…" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="gap-2"><CheckCircle2 className="w-4 h-4" /> Save return</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 overflow-hidden shadow-card">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground tracking-wide bg-muted/40 border-b">
          <div className="col-span-3">Medicine</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-2">Reason</div>
          <div className="col-span-2">Condition</div>
          <div className="col-span-2">Pharmacy</div>
          <div className="col-span-1 text-right">Date</div>
        </div>
        <ul className="divide-y">
          {items.map(r => (
            <li key={r.id} className="grid grid-cols-12 gap-3 px-5 py-4 items-start text-sm">
              <div className="col-span-12 md:col-span-3">
                <div className="font-medium">{r.medicine}</div>
                <div className="text-xs text-muted-foreground">{r.quantity}</div>
                {r.notes && <div className="text-xs italic text-muted-foreground mt-1">"{r.notes}"</div>}
              </div>
              <div className="col-span-6 md:col-span-2">{r.patientName}</div>
              <div className="col-span-6 md:col-span-2">
                <span className="inline-block bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">{r.reason}</span>
              </div>
              <div className="col-span-6 md:col-span-2">
                <span className={
                  r.condition === "Unopened" ? "text-success font-medium" :
                  r.condition === "Expired" ? "text-destructive font-medium" : "text-warning font-medium"
                }>{r.condition}</span>
              </div>
              <div className="col-span-6 md:col-span-2 text-muted-foreground text-xs">{r.pharmacy}<div>{r.loggedBy}</div></div>
              <div className="col-span-12 md:col-span-1 md:text-right text-muted-foreground text-xs">{format(new Date(r.dateReturned), "d MMM")}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Returns;
