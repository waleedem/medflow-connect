import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlatform } from "@/context/PlatformContext";
import { evaluatePatientFlags } from "@/lib/wasteFlags";

export default function Patients() {
  const { patients, returns } = usePlatform();
  const [query, setQuery] = useState("");

  const normalized = query.trim().toLowerCase();
  const filtered = patients.filter(
    (pt) =>
      !normalized ||
      pt.name.toLowerCase().includes(normalized) ||
      pt.nhsNumber.replace(/\s+/g, "").includes(normalized.replace(/\s+/g, "")) ||
      pt.dob.includes(normalized),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Search by patient name, NHS number, or date of birth to inspect full medication history.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or NHS number..."
            aria-label="Search patients"
            className="pl-9 bg-card"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient name</TableHead>
                  <TableHead>Date of birth</TableHead>
                  <TableHead>NHS number</TableHead>
                  <TableHead>Flag status</TableHead>
                  <TableHead className="text-right">Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                      No patients match &ldquo;{query}&rdquo;.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((patient) => {
                    const flags = evaluatePatientFlags(patient, returns);
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="font-semibold text-foreground">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.gpPractice}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{patient.dob}</TableCell>
                        <TableCell className="whitespace-nowrap font-mono text-xs">{patient.nhsNumber}</TableCell>
                        <TableCell>
                          {flags.length === 0 ? (
                            <Badge variant="outline" className="border-success/40 bg-success-soft text-success">
                              No flags
                            </Badge>
                          ) : (
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
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/patients/${patient.id}`}>Open record</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}