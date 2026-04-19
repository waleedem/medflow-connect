import { Card } from "@/components/ui/card";
import { patients, returns, wasteAlerts } from "@/data/demo";
import { AlertTriangle, PackageOpen, Pill, TrendingDown, Users, ChevronRight, Activity, Smartphone, Repeat, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import { SeverityBadge } from "@/components/SeverityBadge";
import { format, formatDistanceToNow } from "date-fns";

const Overview = () => {
  const criticalAlerts = wasteAlerts.filter(a => a.severity === "critical").length;
  const highAlerts = wasteAlerts.filter(a => a.severity === "high").length;
  const totalWaste = wasteAlerts.reduce((s, a) => s + a.estimatedWasteValue, 0);
  const missedCollections = patients.flatMap(p => p.medications).filter(m => m.status === "missed").length;
  const reviewsDue = patients.filter(p => p.reviewDue).length;
  const recentReturns = [...returns].sort((a, b) => +new Date(b.dateReturned) - +new Date(a.dateReturned)).slice(0, 5);
  const topAlerts = [...wasteAlerts].sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  }).slice(0, 4);

  return (
    <div>
      <div className="bg-gradient-header text-primary-foreground">
        <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70 font-semibold">Clinical Dashboard</div>
              <h1 className="text-2xl lg:text-3xl mt-1">Good afternoon, Dr Patel</h1>
              <p className="text-primary-foreground/80 mt-1 text-sm">Riverside Medical Centre · {format(new Date(), "EEEE d MMMM yyyy")}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/alerts" className="bg-primary-foreground text-primary px-4 py-2 rounded-md font-medium text-sm hover:bg-primary-foreground/90 transition-colors flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {criticalAlerts + highAlerts} priority alerts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Active patients" value={patients.length.toString()} hint="Caseload" tone="primary" />
          <KpiCard icon={AlertTriangle} label="Critical alerts" value={criticalAlerts.toString()} hint="Needs same-day action" tone="destructive" />
          <KpiCard icon={Activity} label="Missed collections" value={missedCollections.toString()} hint="Last 14 days" tone="warning" />
          <KpiCard icon={TrendingDown} label="Estimated waste" value={`£${totalWaste}`} hint="This month" tone="success" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top alerts */}
          <Card className="lg:col-span-2 p-0 overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Priority waste alerts</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Patients flagged for clinical review</p>
              </div>
              <Link to="/alerts" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="divide-y">
              {topAlerts.map(a => (
                <li key={a.id}>
                  <Link to={`/patients/${a.patientId}`} className="flex items-start gap-4 px-5 py-4 hover:bg-muted/40 transition-colors">
                    <div className="mt-0.5">
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{a.patientName}</span>
                        <span className="text-xs text-muted-foreground">NHS {a.nhsNumber}</span>
                      </div>
                      <div className="text-sm text-foreground/80 mt-0.5">{a.type}</div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.detail}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                      <div className="font-semibold text-foreground">£{a.estimatedWasteValue}</div>
                      <div>{formatDistanceToNow(new Date(a.detectedAt), { addSuffix: true })}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recent returns */}
          <Card className="p-0 overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Recent returns</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Across linked pharmacies</p>
              </div>
              <Link to="/returns" className="text-sm text-primary hover:text-primary-hover flex items-center gap-1">
                Log <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <ul className="divide-y">
              {recentReturns.map(r => (
                <li key={r.id} className="px-5 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-accent-soft flex items-center justify-center shrink-0">
                      <PackageOpen className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{r.medicine}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.patientName} · {r.reason}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.condition} · {formatDistanceToNow(new Date(r.dateReturned), { addSuffix: true })}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Reviews due */}
        <Card className="p-0 overflow-hidden shadow-card">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold">Recommended medication reviews</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{reviewsDue} patients flagged for structured review</p>
          </div>
          <div className="divide-y">
            {patients.filter(p => p.reviewDue).map(p => (
              <Link key={p.id} to={`/patients/${p.id}`} className="grid grid-cols-12 gap-3 px-5 py-3.5 hover:bg-muted/40 items-center">
                <div className="col-span-12 sm:col-span-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">DOB {format(new Date(p.dob), "d MMM yyyy")} · NHS {p.nhsNumber}</div>
                </div>
                <div className="col-span-6 sm:col-span-3 text-sm text-muted-foreground">{p.gpPractice}</div>
                <div className="col-span-6 sm:col-span-3 text-sm">
                  Review by <span className="font-medium text-foreground">{format(new Date(p.reviewDue!), "d MMM")}</span>
                </div>
                <div className="col-span-12 sm:col-span-2 flex sm:justify-end gap-1.5">
                  {p.flags.map((f, i) => <SeverityBadge key={i} severity={f} />)}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, hint, tone }: { icon: any; label: string; value: string; hint: string; tone: "primary" | "destructive" | "warning" | "success" }) => {
  const toneMap = {
    primary: "bg-primary-soft text-primary",
    destructive: "bg-destructive-soft text-destructive",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  };
  return (
    <Card className="p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</div>
          <div className="text-3xl font-semibold mt-2">{value}</div>
          <div className="text-xs text-muted-foreground mt-1">{hint}</div>
        </div>
        <div className={`w-10 h-10 rounded-md flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default Overview;
