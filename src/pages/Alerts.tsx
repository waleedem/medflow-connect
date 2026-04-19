import { useState } from "react";
import { Card } from "@/components/ui/card";
import { wasteAlerts, type AlertSeverity } from "@/data/demo";
import { Link } from "react-router-dom";
import { SeverityBadge } from "@/components/SeverityBadge";
import { AlertTriangle, ChevronRight, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const severityOrder: Record<AlertSeverity, number> = { critical: 0, high: 1, moderate: 2, low: 3 };

const Alerts = () => {
  const [filter, setFilter] = useState<AlertSeverity | "all">("all");
  const filtered = [...wasteAlerts]
    .filter(a => filter === "all" || a.severity === filter)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  const counts = {
    all: wasteAlerts.length,
    critical: wasteAlerts.filter(a => a.severity === "critical").length,
    high: wasteAlerts.filter(a => a.severity === "high").length,
    moderate: wasteAlerts.filter(a => a.severity === "moderate").length,
    low: wasteAlerts.filter(a => a.severity === "low").length,
  };
  const totalWaste = filtered.reduce((s, a) => s + a.estimatedWasteValue, 0);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-destructive" /> Waste alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} alerts · est. £{totalWaste} avoidable waste
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "critical", "high", "moderate", "low"] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors border",
                filter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/70 border-border hover:bg-muted"
              )}
            >
              {s} <span className="ml-1 opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(a => (
          <Card key={a.id} className={cn(
            "p-0 overflow-hidden shadow-card border-l-4",
            a.severity === "critical" && "border-l-destructive",
            a.severity === "high" && "border-l-warning",
            a.severity === "moderate" && "border-l-info",
            a.severity === "low" && "border-l-muted-foreground/40",
          )}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="flex flex-col items-start gap-2">
                    <SeverityBadge severity={a.severity} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/patients/${a.patientId}`} className="font-semibold hover:text-primary">{a.patientName}</Link>
                      <span className="text-xs text-muted-foreground font-mono">NHS {a.nhsNumber}</span>
                      <span className="text-xs text-muted-foreground">· {formatDistanceToNow(new Date(a.detectedAt), { addSuffix: true })}</span>
                    </div>
                    <div className="text-sm font-medium text-foreground/90 mt-1">{a.type}</div>
                    <p className="text-sm text-muted-foreground mt-1">{a.detail}</p>
                    <div className="mt-3 bg-info-soft border border-info/15 rounded-md px-3 py-2 text-sm">
                      <span className="font-semibold text-info">Recommended action: </span>
                      <span className="text-foreground/85">{a.recommendedAction}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-semibold">£{a.estimatedWasteValue}</div>
                  <div className="text-xs text-muted-foreground">est. waste</div>
                  <Link to={`/patients/${a.patientId}`} className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-hover">
                    Open patient <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-12 text-center text-muted-foreground">No alerts at this severity.</Card>
        )}
      </div>
    </div>
  );
};

export default Alerts;
