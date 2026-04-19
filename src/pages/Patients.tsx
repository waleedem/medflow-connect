import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { patients } from "@/data/demo";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import { SeverityBadge } from "@/components/SeverityBadge";
import { format } from "date-fns";

const Patients = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.nhsNumber.replace(/\s/g, "").includes(term.replace(/\s/g, "")) ||
      p.conditions.some(c => c.toLowerCase().includes(term))
    );
  }, [q]);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl">Patients</h1>
          <p className="text-sm text-muted-foreground mt-1">{patients.length} patients across linked GP practices</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, NHS no., condition…" className="pl-9" />
        </div>
      </div>

      <Card className="p-0 overflow-hidden shadow-card">
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-xs font-semibold uppercase text-muted-foreground tracking-wide bg-muted/40 border-b">
          <div className="col-span-3">Patient</div>
          <div className="col-span-2">NHS number</div>
          <div className="col-span-3">Conditions</div>
          <div className="col-span-2">Practice</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <ul className="divide-y">
          {filtered.map(p => (
            <li key={p.id}>
              <Link to={`/patients/${p.id}`} className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-muted/40 transition-colors">
                <div className="col-span-12 md:col-span-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sex} · {p.age}y · DOB {format(new Date(p.dob), "d MMM yyyy")}</div>
                </div>
                <div className="col-span-6 md:col-span-2 text-sm font-mono text-muted-foreground">{p.nhsNumber}</div>
                <div className="col-span-12 md:col-span-3 flex flex-wrap gap-1.5">
                  {p.conditions.slice(0, 3).map(c => (
                    <span key={c} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{c}</span>
                  ))}
                  {p.conditions.length > 3 && <span className="text-xs text-muted-foreground">+{p.conditions.length - 3}</span>}
                </div>
                <div className="col-span-6 md:col-span-2 text-sm text-muted-foreground">{p.gpPractice}</div>
                <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-2">
                  {p.flags.length === 0 ? (
                    <span className="text-xs text-success font-medium">No issues</span>
                  ) : (
                    p.flags.map((f, i) => <SeverityBadge key={i} severity={f} />)
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground hidden md:block" />
                </div>
              </Link>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-muted-foreground">No patients match your search.</li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default Patients;
