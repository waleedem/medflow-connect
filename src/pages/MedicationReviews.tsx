import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlatform } from "@/context/PlatformContext";

export default function MedicationReviews() {
  const { patients, reviews, updateReviewStatus } = usePlatform();

  const handleToggle = (reviewId: string, current: "Scheduled" | "Completed") => {
    const next = current === "Scheduled" ? "Completed" : "Scheduled";
    updateReviewStatus(reviewId, next);
    toast.success(next === "Completed" ? "Medication review marked completed." : "Medication review reopened.");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Structured medication reviews</h1>
        <p className="text-sm text-muted-foreground">
          Follow-up reviews triggered within 4–6 weeks to address adherence, side effects, overprescribing, or access barriers.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Suspected cause</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Team &amp; notes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      No medication reviews scheduled yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((rev) => {
                    const patient = patients.find((p) => p.id === rev.patientId);
                    return (
                      <TableRow key={rev.id}>
                        <TableCell>
                          {patient ? (
                            <Link to={`/patients/${patient.id}`} className="font-semibold text-primary hover:underline">
                              {patient.name}
                            </Link>
                          ) : (
                            <span className="font-semibold text-foreground">Unknown patient</span>
                          )}
                          {patient && <div className="text-xs text-muted-foreground">NHS {patient.nhsNumber}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{rev.suspectedCause}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{rev.dueDate}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="text-xs font-medium text-foreground">{rev.assignedTeam}</div>
                          <p className="text-xs text-muted-foreground">{rev.notes}</p>
                        </TableCell>
                        <TableCell>
                          {rev.status === "Completed" ? (
                            <Badge variant="outline" className="border-success/40 bg-success-soft text-success">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="default">Scheduled</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant={rev.status === "Completed" ? "outline" : "default"}
                            onClick={() => handleToggle(rev.id, rev.status)}
                            className="gap-1.5"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {rev.status === "Completed" ? "Reopen" : "Complete"}
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