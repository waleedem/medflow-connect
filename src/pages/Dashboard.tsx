import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlatform } from "@/context/PlatformContext";
import { MONTHLY_RETURNS_BASELINE } from "@/data/medicinesData";
import { evaluatePatientFlags } from "@/lib/wasteFlags";

export default function Dashboard() {
  const { patients, returns, reviews } = usePlatform();

  const patientSummaries = patients.map((patient) => ({
    patient,
    flags: evaluatePatientFlags(patient, returns),
    returnCount: returns.filter((r) => r.patientId === patient.id).length,
  }));

  const flaggedPatients = patientSummaries.filter((item) => item.flags.length > 0);
  const pendingReviews = reviews.filter((r) => r.status === "Scheduled");
  const currentMonthReturns = returns.filter((r) => r.date.startsWith("2026-11"));
  const estimatedWasteGbp = returns.reduce((sum, r) => sum + r.estimatedCostGbp, 0);

  const trendData = [
    ...MONTHLY_RETURNS_BASELINE,
    {
      month: "Nov",
      returns: currentMonthReturns.length + 10,
      costGbp: currentMonthReturns.reduce((s, r) => s + r.estimatedCostGbp, 0) + 320,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Waste &amp; alerts dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Shared prescribing, dispensing, and medicines return signals across primary and secondary care.
          </p>
        </div>
        <Button asChild>
          <Link to="/returns/new">Log a medicine return</Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary metrics">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flagged patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{flaggedPatients.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">of {patients.length} active patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{pendingReviews.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">4–6 week review window</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Returns this month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{currentMonthReturns.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">logged across network pharmacies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estimated waste cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-destructive">£{estimatedWasteGbp}</p>
            <p className="mt-1 text-xs text-muted-foreground">recorded returned medicines</p>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
            <CardTitle className="text-base font-semibold">Flagged patients needing review</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patients" className="gap-1">
                All patients <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedPatients.map(({ patient, flags }) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="font-semibold text-foreground">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">NHS {patient.nhsNumber}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {flags.map((flag) => (
                            <Badge
                              key={flag.type}
                              variant={flag.severity === "high" ? "destructive" : "secondary"}
                            >
                              {flag.label}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/patients/${patient.id}`}>Review record</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Monthly returns trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="returns" name="Returned items" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}