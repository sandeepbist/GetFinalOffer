"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  getVerificationReviewQueue,
  submitVerificationDecision,
  type VerificationReviewRequestDTO,
} from "@/features/admin/verification-review-use-cases";

function ScopeBadge({ scope }: { scope: string }) {
  if (scope === "candidate_profile") {
    return (
      <Badge className="bg-primary/10 text-primary border-primary/25">
        <ShieldCheck className="mr-1 h-3 w-3" /> Profile
      </Badge>
    );
  }
  return (
    <Badge className="bg-highlight text-text border-border">
      <FileText className="mr-1 h-3 w-3" /> Interview
    </Badge>
  );
}

export function VerificationReviewDashboard() {
  const { data: session, isPending } = useSession();
  const [requests, setRequests] = useState<VerificationReviewRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState<VerificationReviewRequestDTO | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadQueue = useCallback(async () => {
    setLoading(true);
    const queue = await getVerificationReviewQueue();
    setRequests(queue);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isPending || !session?.user) return;
    loadQueue().catch(() => {
      toast.error("Failed to load verification queue");
      setLoading(false);
    });
  }, [isPending, session, loadQueue]);

  const openDecision = (request: VerificationReviewRequestDTO, kind: "approved" | "rejected") => {
    setDeciding(request);
    setDecision(kind);
    setNote("");
  };

  const confirmDecision = async () => {
    if (!deciding) return;
    setSubmitting(true);
    const ok = await submitVerificationDecision({
      requestId: deciding.id,
      decision,
      decisionNote: note,
    });
    setSubmitting(false);

    if (!ok) {
      toast.error("Failed to record the decision");
      return;
    }

    toast.success(decision === "approved" ? "Request approved" : "Request rejected");
    setDeciding(null);
    loadQueue().catch(() => undefined);
  };

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="border-border/70">
            <CardContent className="h-28 animate-pulse rounded-xl bg-highlight" />
          </Card>
        ))}
      </div>
    );
  }

  const pending = requests.filter((r) => r.status === "pending");
  const reviewed = requests.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-heading">
          Verification review
        </h1>
        <p className="text-sm text-text-muted">
          {pending.length} pending request{pending.length === 1 ? "" : "s"}.
          Approving sets the target verified; rejecting marks it rejected and
          the requester can re-submit.
        </p>
      </header>

      {pending.length === 0 && (
        <Card className="border-dashed border-border bg-highlight">
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <p className="text-sm font-medium text-heading">Queue is clear</p>
            <p className="text-xs text-text-muted">
              No pending verification requests right now.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {pending.map((request) => (
          <Card key={request.id} className="border-border/70 bg-surface/95">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2 text-base">
                  {request.requesterName ?? "Unknown requester"}
                  <ScopeBadge scope={request.scope} />
                </CardTitle>
                <p className="text-xs text-text-muted">
                  {request.requesterEmail} ·{" "}
                  {new Date(request.requestedAt).toLocaleString()}
                </p>
              </div>
              <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/25">
                <Clock className="mr-1 h-3 w-3" /> Pending
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-heading">{request.subject || "No subject"}</p>
                {request.notes && (
                  <p className="text-sm text-text-muted">{request.notes}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {request.documents.length === 0 && (
                  <p className="text-xs text-text-subtle">No documents attached</p>
                )}
                {request.documents.map((doc) => (
                  <Button
                    key={doc.storagePath}
                    variant="outline"
                    size="sm"
                    className="border-border bg-highlight text-text"
                    disabled={!doc.signedUrl}
                    onClick={() => {
                      if (doc.signedUrl) window.open(doc.signedUrl, "_blank", "noopener");
                    }}
                  >
                    <FileText className="mr-2 h-3.5 w-3.5" />
                    {doc.originalFileName}
                    <ExternalLink className="ml-2 h-3 w-3 text-text-subtle" />
                  </Button>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t border-border/60 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 hover:text-emerald-600"
                  onClick={() => openDecision(request, "approved")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-600"
                  onClick={() => openDecision(request, "rejected")}
                >
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviewed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-text-subtle">
            Recently reviewed
          </h2>
          <div className="space-y-2">
            {reviewed.map((request) => (
              <Card key={request.id} className="border-border/50 bg-surface/70">
                <CardContent className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-heading">
                      {request.requesterName ?? "Unknown"} — {request.subject || request.scope}
                    </p>
                    {request.documents.length > 0 && (
                      <p className="text-xs text-text-subtle">
                        {request.documents.length} document
                        {request.documents.length === 1 ? "" : "s"} on record
                      </p>
                    )}
                  </div>
                  <Badge
                    className={
                      request.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                        : "bg-red-500/10 text-red-600 border-red-500/25"
                    }
                  >
                    {request.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <Dialog
        open={deciding !== null}
        onOpenChange={(open) => {
          if (!open) setDeciding(null);
        }}
      >
        <DialogContent className="border-border/80">
          <DialogHeader>
            <DialogTitle>
              {decision === "approved" ? "Approve" : "Reject"} verification request
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-text-muted">
            {decision === "approved"
              ? "The candidate's claim will be marked verified and their profile boosted in recruiter search."
              : "The claim will be marked rejected. Add a note so the requester understands why."}
          </p>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Decision note (optional, visible to the requester's status)"
            className="min-h-24"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeciding(null)}>
              Cancel
            </Button>
            <Button
              disabled={submitting}
              className={
                decision === "approved"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
              onClick={confirmDecision}
            >
              {submitting
                ? "Saving..."
                : decision === "approved"
                  ? "Confirm approval"
                  : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
