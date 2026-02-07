import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addScan, getAnalysisRules } from "@/lib/dataStore";
import type { Scan, AnalysisRule } from "@/types/phishing";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/RiskBadge";
import { Search, Sparkles, ArrowRight } from "lucide-react";

function simulateAnalysis(text: string, rules: AnalysisRule[]): Omit<Scan, "id" | "timestamp"> {
  const lowerText = text.toLowerCase();
  const matchedRules = rules.filter((r) => lowerText.includes(r.keyword.toLowerCase()));

  let riskLevel: Scan["riskLevel"] = "safe";
  let confidence = 20;
  const techniques: string[] = [];
  const reasons: string[] = [];
  const dangerousPhrases: Scan["dangerousPhrases"] = [];

  if (matchedRules.length > 0) {
    const highRisk = matchedRules.some((r) => r.riskLevel === "high");
    const medRisk = matchedRules.some((r) => r.riskLevel === "medium");
    riskLevel = highRisk ? "high" : medRisk ? "medium" : "safe";
    confidence = Math.min(
      99,
      Math.max(...matchedRules.map((r) => r.confidence)) + matchedRules.length * 5
    );

    matchedRules.forEach((r) => {
      r.techniques.forEach((t) => {
        if (!techniques.includes(t)) techniques.push(t);
      });
      r.reasons.forEach((reason) => {
        if (!reasons.includes(reason)) reasons.push(reason);
      });
      dangerousPhrases.push({
        text: r.keyword,
        reason: r.reasons[0] || "Suspicious pattern detected",
      });
    });
  } else {
    reasons.push("No known phishing patterns detected in the content.");
    confidence = 85;
  }

  // Extract a subject from first line
  const firstLine = text.split("\n")[0]?.trim() || "Manual Analysis";
  const subject = firstLine.length > 60 ? firstLine.slice(0, 57) + "..." : firstLine;

  // Try to extract sender
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const sender = emailMatch ? emailMatch[0] : "unknown@manual-entry.com";

  return {
    sender,
    senderName: "Manual Entry",
    subject,
    riskLevel,
    confidence,
    body: text,
    dangerousPhrases,
    reasons,
    techniques,
    links: [],
    recommendation:
      riskLevel === "high"
        ? "This content contains high-risk phishing patterns. Do not interact with any links or provide personal information."
        : riskLevel === "medium"
        ? "This content contains some suspicious patterns. Verify the sender before taking any action."
        : "No significant phishing indicators found. Exercise normal caution.",
  };
}

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<Scan | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setResult(null);

    const rules = await getAnalysisRules();

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));

    const analysis = simulateAnalysis(text, rules);
    const scan: Scan = {
      id: `manual-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...analysis,
    };

    addScan(scan);
    setResult(scan);
    setAnalyzing(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Manual Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Paste email content below to run a simulated phishing analysis
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <Textarea
          placeholder="Paste suspicious email content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="font-mono text-sm"
        />
        <Button
          onClick={handleAnalyze}
          disabled={!text.trim() || analyzing}
          className="w-full gap-2"
        >
          {analyzing ? (
            <>
              <Sparkles className="h-4 w-4 animate-pulse" /> Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" /> Analyze Email
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="rounded-lg border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-card-foreground">
              Analysis Result
            </h3>
            <RiskBadge level={result.riskLevel} size="md" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Confidence: {result.confidence}%
            </p>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${
                  result.riskLevel === "high"
                    ? "bg-risk-high"
                    : result.riskLevel === "medium"
                    ? "bg-risk-medium"
                    : "bg-risk-safe"
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>

          {result.reasons.length > 0 && (
            <ul className="space-y-1 text-sm text-card-foreground">
              {result.reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-muted-foreground">•</span> {r}
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-card-foreground">{result.recommendation}</p>

          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => navigate(`/scans/${result.id}`)}
          >
            View Full Details <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
