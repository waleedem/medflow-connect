import { Pill, LayoutDashboard, Users, AlertTriangle, PackageOpen, Settings, LifeBuoy } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { wasteAlerts } from "@/data/demo";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/alerts", label: "Waste alerts", icon: AlertTriangle, badge: wasteAlerts.filter(a => a.severity === "critical" || a.severity === "high").length },
  { to: "/returns", label: "Returns log", icon: PackageOpen },
];

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-md bg-sidebar-primary flex items-center justify-center">
            <Pill className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sidebar-primary-foreground leading-tight">MediTrack</div>
            <div className="text-xs text-sidebar-foreground/60">Sustainable Prescribing</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge ? (
                  <span className="text-xs bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 font-semibold">{item.badge}</span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/40 cursor-pointer">
            <LifeBuoy className="w-4 h-4" /> Support
          </div>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent/40 cursor-pointer">
            <Settings className="w-4 h-4" /> Settings
          </div>
          <div className="mt-3 px-3 py-2.5 rounded-md bg-sidebar-accent/50 text-xs">
            <div className="font-medium text-sidebar-accent-foreground">Dr Rina Patel</div>
            <div className="text-sidebar-foreground/60">Riverside Medical Centre</div>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-sidebar-primary flex items-center justify-center">
              <Pill className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold">MediTrack</span>
          </div>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1">
          {nav.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <NavLink key={item.to} to={item.to} className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
              )}>
                <Icon className="w-3.5 h-3.5" />{item.label}
                {item.badge ? <span className="ml-1 bg-destructive text-destructive-foreground rounded-full px-1.5 text-[10px] font-bold">{item.badge}</span> : null}
              </NavLink>
            );
          })}
        </div>
      </div>

      <main className="flex-1 min-w-0 pt-28 md:pt-0">{children}</main>
    </div>
  );
};
