import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getScans, initializeData } from "@/lib/dataStore";
import type { Scan, RiskLevel } from "@/types/phishing";
import { RiskBadge } from "@/components/RiskBadge";
import { Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const filters: { label: string; value: RiskLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "High Risk", value: "high" },
  { label: "Medium Risk", value: "medium" },
  { label: "Safe", value: "safe" },
];

export default function ScansPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [filter, setFilter] = useState<RiskLevel | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    initializeData().then(() => setScans(getScans()));
  }, []);

  const filtered = scans.filter((s) => {
    if (filter !== "all" && s.riskLevel !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.subject.toLowerCase().includes(q) ||
        s.sender.toLowerCase().includes(q) ||
        s.senderName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Scan History</h2>
        <p className="text-sm text-muted-foreground">
          All scanned emails from your browser extension
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scan List */}
      <div className="rounded-lg border border-border bg-card divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No scans found.
          </div>
        ) : (
          filtered.map((scan) => (
            <Link
              key={scan.id}
              to={`/scans/${scan.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-card-foreground">
                  {scan.subject}
                </p>
                <p className="truncate text-xs text-muted-foreground mt-0.5">
                  {scan.senderName} &lt;{scan.sender}&gt;
                </p>
              </div>
              <RiskBadge level={scan.riskLevel} />
              <span className="hidden text-xs text-muted-foreground sm:flex items-center gap-1 shrink-0">
                <Clock className="h-3 w-3" />
                {new Date(scan.timestamp).toLocaleString()}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
