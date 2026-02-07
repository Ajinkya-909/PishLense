import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getScans, getStats, initializeData } from "@/lib/dataStore";
import type { Scan } from "@/types/phishing";
import { StatsCard } from "@/components/StatsCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Mail,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData().then(() => {
      setScans(getScans());
      setLoading(false);
    });
  }, []);

  const stats = getStats();
  const recent = scans.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="text-sm text-muted-foreground">
          Your phishing detection summary
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Scanned"
          value={stats.total}
          icon={Mail}
        />
        <StatsCard
          title="High Risk"
          value={stats.high}
          icon={ShieldAlert}
          variant="high"
        />
        <StatsCard
          title="Medium Risk"
          value={stats.medium}
          icon={AlertTriangle}
          variant="medium"
        />
        <StatsCard
          title="Safe"
          value={stats.safe}
          icon={ShieldCheck}
          variant="safe"
        />
      </div>

      {/* Risk Distribution */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          Risk Distribution
        </h3>
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          {stats.total > 0 && (
            <>
              <div
                className="bg-risk-high transition-all"
                style={{ width: `${(stats.high / stats.total) * 100}%` }}
              />
              <div
                className="bg-risk-medium transition-all"
                style={{ width: `${(stats.medium / stats.total) * 100}%` }}
              />
              <div
                className="bg-risk-safe transition-all"
                style={{ width: `${(stats.safe / stats.total) * 100}%` }}
              />
            </>
          )}
        </div>
        <div className="mt-3 flex gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-risk-high" /> High ({stats.high})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-risk-medium" /> Medium ({stats.medium})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-risk-safe" /> Safe ({stats.safe})
          </span>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-card-foreground">
            Recent Scans
          </h3>
          <Link to="/scans">
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((scan) => (
            <Link
              key={scan.id}
              to={`/scans/${scan.id}`}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-card-foreground">
                  {scan.subject}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {scan.senderName} — {scan.sender}
                </p>
              </div>
              <RiskBadge level={scan.riskLevel} />
              <span className="hidden text-xs text-muted-foreground sm:flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(scan.timestamp).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
