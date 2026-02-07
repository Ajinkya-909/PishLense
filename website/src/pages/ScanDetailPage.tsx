import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getScanById, initializeData } from "@/lib/dataStore";
import type { Scan } from "@/types/phishing";
import { RiskBadge } from "@/components/RiskBadge";
import {
  ArrowLeft,
  Clock,
  User,
  Mail,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Brain,
  Link2,
  Info,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function HighlightedBody({ body, phrases }: { body: string; phrases: Scan["dangerousPhrases"] }) {
  if (!phrases.length) return <p className="whitespace-pre-wrap text-sm text-card-foreground">{body}</p>;

  let result = body;
  const parts: { text: string; isHighlighted: boolean; reason?: string }[] = [];

  // Simple approach: find and mark each phrase
  let remaining = body;
  const sortedPhrases = [...phrases].sort(
    (a, b) => remaining.toLowerCase().indexOf(a.text.toLowerCase()) - remaining.toLowerCase().indexOf(b.text.toLowerCase())
  );

  let lastIndex = 0;
  const lowerBody = body.toLowerCase();

  for (const phrase of sortedPhrases) {
    const idx = lowerBody.indexOf(phrase.text.toLowerCase(), lastIndex);
    if (idx === -1) continue;

    if (idx > lastIndex) {
      parts.push({ text: body.slice(lastIndex, idx), isHighlighted: false });
    }
    parts.push({
      text: body.slice(idx, idx + phrase.text.length),
      isHighlighted: true,
      reason: phrase.reason,
    });
    lastIndex = idx + phrase.text.length;
  }

  if (lastIndex < body.length) {
    parts.push({ text: body.slice(lastIndex), isHighlighted: false });
  }

  return (
    <p className="whitespace-pre-wrap text-sm text-card-foreground leading-relaxed">
      {parts.map((part, i) =>
        part.isHighlighted ? (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="cursor-help rounded bg-risk-high/15 px-0.5 text-risk-high underline decoration-risk-high/40 decoration-wavy">
                {part.text}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{part.reason}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}

const techniqueLabels: Record<string, string> = {
  urgency: "⏰ Urgency",
  fear: "😨 Fear",
  impersonation: "🎭 Impersonation",
  greed: "💰 Greed",
};

export default function ScanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [scan, setScan] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData().then(() => {
      if (id) setScan(getScanById(id) ?? null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading...</div>;
  }

  if (!scan) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Scan not found.</p>
        <Link to="/scans" className="mt-2 text-sm text-primary underline">
          Back to scans
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Link
        to="/scans"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to scans
      </Link>

      {/* Email Overview */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-card-foreground">{scan.subject}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {scan.senderName}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {scan.sender}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />{" "}
                {new Date(scan.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <RiskBadge level={scan.riskLevel} size="md" />
        </div>
      </div>

      {/* Risk Summary */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <AlertTriangle className="h-4 w-4" /> Risk Summary
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <RiskBadge level={scan.riskLevel} size="md" />
          <div>
            <p className="text-sm text-muted-foreground">
              Confidence: <span className="font-bold text-card-foreground">{scan.confidence}%</span>
            </p>
          </div>
          {scan.techniques.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {scan.techniques.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                >
                  {techniqueLabels[t] ?? t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${
                scan.riskLevel === "high"
                  ? "bg-risk-high"
                  : scan.riskLevel === "medium"
                  ? "bg-risk-medium"
                  : "bg-risk-safe"
              }`}
              style={{ width: `${scan.confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <Mail className="h-4 w-4" /> Email Body
          {scan.dangerousPhrases.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              (hover highlighted text for details)
            </span>
          )}
        </h3>
        <div className="rounded-md border border-border bg-muted/30 p-4 font-mono text-xs">
          <HighlightedBody body={scan.body} phrases={scan.dangerousPhrases} />
        </div>
      </div>

      {/* Why This Is Dangerous */}
      {scan.reasons.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <Brain className="h-4 w-4" /> Why This Is Dangerous
          </h3>
          <ul className="space-y-2">
            {scan.reasons.map((reason, i) => (
              <li key={i} className="flex gap-2 text-sm text-card-foreground">
                <AlertTriangle className="h-4 w-4 shrink-0 text-risk-high mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Link Analysis */}
      {scan.links.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <Link2 className="h-4 w-4" /> Link Analysis
          </h3>
          <div className="space-y-3">
            {scan.links.map((link, i) => (
              <div
                key={i}
                className="rounded-md border border-border bg-muted/30 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">
                    {link.displayText}
                  </span>
                  <RiskBadge level={link.riskLevel} size="sm" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono break-all">
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {link.actualUrl}
                </div>
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Info className="h-3 w-3 shrink-0 mt-0.5" />
                  {link.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Recommendation */}
      <div className={`rounded-lg border p-5 ${
        scan.riskLevel === "high"
          ? "border-risk-high/30 bg-risk-high/5"
          : scan.riskLevel === "medium"
          ? "border-risk-medium/30 bg-risk-medium/5"
          : "border-risk-safe/30 bg-risk-safe/5"
      }`}>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <ShieldCheck className="h-4 w-4" /> Recommended Action
        </h3>
        <p className="text-sm text-card-foreground">{scan.recommendation}</p>
      </div>
    </div>
  );
}
