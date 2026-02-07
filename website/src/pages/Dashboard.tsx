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
  TrendingUp,
  Activity,
  CheckCircle,
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
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Scanned"
          value={stats.total}
          icon={Mail}
          description="All time scans"
        />
        <StatsCard
          title="High Risk"
          value={stats.high}
          icon={ShieldAlert}
          variant="high"
          description="Needs attention"
        />
        <StatsCard
          title="Medium Risk"
          value={stats.medium}
          icon={AlertTriangle}
          variant="medium"
          description="Review recommended"
        />
        <StatsCard
          title="Safe"
          value={stats.safe}
          icon={ShieldCheck}
          variant="safe"
          description="No threats found"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Risk Distribution - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-card-foreground">
                Risk Distribution
              </h3>
              <p className="text-sm text-muted-foreground">
                Last 7 days vs prior week
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-accent font-medium">
              <TrendingUp className="h-4 w-4" />
              +12.5%
            </div>
          </div>
          
          {/* Chart area */}
          <div className="space-y-4">
            <div className="flex h-3 overflow-hidden rounded-full bg-muted">
              {stats.total > 0 && (
                <>
                  <div
                    className="bg-risk-high transition-all duration-500"
                    style={{ width: `${(stats.high / stats.total) * 100}%` }}
                  />
                  <div
                    className="bg-risk-medium transition-all duration-500"
                    style={{ width: `${(stats.medium / stats.total) * 100}%` }}
                  />
                  <div
                    className="bg-risk-safe transition-all duration-500"
                    style={{ width: `${(stats.safe / stats.total) * 100}%` }}
                  />
                </>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-risk-high" />
                <span className="text-muted-foreground">High Risk</span>
                <span className="font-semibold text-card-foreground">{stats.high}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-risk-medium" />
                <span className="text-muted-foreground">Medium</span>
                <span className="font-semibold text-card-foreground">{stats.medium}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-risk-safe" />
                <span className="text-muted-foreground">Safe</span>
                <span className="font-semibold text-card-foreground">{stats.safe}</span>
              </div>
            </div>
          </div>

          {/* Mini bar chart visualization */}
          <div className="mt-6 grid grid-cols-7 gap-2">
            {[65, 40, 80, 55, 75, 45, 90].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="relative h-20 w-full flex items-end justify-center">
                  <div 
                    className="w-full max-w-[24px] rounded-t-md bg-primary/20 transition-all hover:bg-primary/30"
                    style={{ height: `${height}%` }}
                  >
                    <div 
                      className="w-full rounded-t-md bg-primary transition-all"
                      style={{ height: `${height * 0.6}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Panel */}
        <div className="space-y-4">
          {/* Security Status Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold text-card-foreground">
                  ✓ Protected
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.safe / Math.max(stats.total, 1)) * 100)}% safe rate
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link to="/analyze">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <Activity className="h-4 w-4 text-primary" />
                  Analyze New Email
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" className="w-full justify-start gap-2 h-10">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Learn About Threats
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-semibold text-card-foreground">
              Recent Scans
            </h3>
            <p className="text-sm text-muted-foreground">
              Your latest email analyses
            </p>
          </div>
          <Link to="/scans">
            <Button variant="default" size="sm" className="gap-1.5">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recent.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No scans yet. Start by analyzing an email!
            </div>
          ) : (
            recent.map((scan) => (
              <Link
                key={scan.id}
                to={`/scans/${scan.id}`}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  scan.riskLevel === 'high' 
                    ? 'bg-risk-high/10 text-risk-high' 
                    : scan.riskLevel === 'medium' 
                    ? 'bg-risk-medium/10 text-risk-medium'
                    : 'bg-risk-safe/10 text-risk-safe'
                }`}>
                  {scan.senderName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {scan.subject}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {scan.senderName}
                  </p>
                </div>
                <RiskBadge level={scan.riskLevel} />
                <span className="hidden text-xs text-muted-foreground sm:flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(scan.timestamp).toLocaleDateString()}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
