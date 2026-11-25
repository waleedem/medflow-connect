import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePlatform } from "@/context/PlatformContext";
import { RETURN_CONDITIONS, type ReturnCondition } from "@/data/medicinesData";

export default function LogReturn() {
  const { patients, addReturn } = usePlatform();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get("patientId") ?? patients[0]?.id ?? "";

  const [patientId, setPatientId] = useState(initialPatientId);
  const [medicine, setMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("tablets");
  const [condition, setCondition] = useState<ReturnCondition>("Unopened");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [reason, setReason] = useState("");
  const [pharmacy, setPharmacy] = useState("High Street Pharmacy");
  const [error, setError] = useState("");

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = Number(quantity);
    const costNum = Number(estimatedCost || "0");

    if (!patientId) return setError("Select a patient.");
    if (!medicine.trim()) return setError("Enter the returned medicine name.");
    if (!Number.isFinite(qtyNum) || qtyNum <= 0) return setError("Quantity must be greater than zero.");
    if (!Number.isFinite(costNum) || costNum < 0) return setError("Estimated cost cannot be negative.");
    if (!reason.trim()) return setError("Record the patient's reason for returning the medicine.");

    setError("");
    addReturn({
      patientId,
      date: new Date().toISOString().slice(0, 10),
      medicine: medicine.trim(),
      quantity: qtyNum,
      unit: unit.trim() || "units",
      condition,
      reason: reason.trim(),
      estimatedCostGbp: Math.round(costNum),
      loggedBy: pharmacy.trim() || "Community Pharmacy",
    });

    toast.success("Returned medicine logged and shared with the prescribing team.");
    navigate(`/patients/${patientId}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Log a returned medicine</h1>
        <p className="text-sm text-muted-foreground">
          Record returned medicines at the pharmacy counter so waste patterns feed back to GP and hospital prescribers.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Return details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="return-patient">Patient</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger id="return-patient"><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name} (NHS {p.nhsNumber})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="return-medicine">Medicine</Label>
              <Input
                id="return-medicine"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
                placeholder="e.g. Metformin 500mg tablets"
                list="patient-meds-list"
              />
              <datalist id="patient-meds-list">
                {selectedPatient?.medicines.map((m) => <option key={m.id} value={m.name} />)}
              </datalist>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="return-qty">Quantity</Label>
                <Input id="return-qty" type="number" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="56" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="return-unit">Unit</Label>
                <Input id="return-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="tablets / inhalers" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="return-condition">Condition</Label>
                <Select value={condition} onValueChange={(v) => setCondition(v as ReturnCondition)}>
                  <SelectTrigger id="return-condition"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {RETURN_CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="return-cost">Estimated cost (£)</Label>
                <Input id="return-cost" type="number" min="0" step="1" value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="18" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="return-pharmacy">Logged by</Label>
                <Input id="return-pharmacy" value={pharmacy} onChange={(e) => setPharmacy(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="return-reason">Reason for return</Label>
              <Textarea
                id="return-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Side effects, duplicate repeat after hospital discharge, stopped taking..."
                rows={3}
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Save medicine return</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}