import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/data/demo";

const map: Record<AlertSeverity, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  moderate: "bg-info-soft text-info border border-info/20",
  low: "bg-muted text-muted-foreground",
};

const labelMap: Record<AlertSeverity, string> = {
  critical: "Critical",
  high: "High",
  moderate: "Moderate",
  low: "Low",
};

export const SeverityBadge = ({ severity, className }: { severity: AlertSeverity; className?: string }) => (
  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide", map[severity], className)}>
    {severity === "critical" && <span className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse-soft" />}
    {labelMap[severity]}
  </span>
);
