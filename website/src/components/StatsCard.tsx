import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: "default" | "high" | "medium" | "safe";
}

const variantStyles = {
  default: "border-border",
  high: "border-risk-high/30 bg-risk-high/5",
  medium: "border-risk-medium/30 bg-risk-medium/5",
  safe: "border-risk-safe/30 bg-risk-safe/5",
};

const iconStyles = {
  default: "text-primary",
  high: "text-risk-high",
  medium: "text-risk-medium",
  safe: "text-risk-safe",
};

export function StatsCard({ title, value, icon: Icon, variant = "default" }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5 transition-colors",
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className={cn("h-5 w-5", iconStyles[variant])} />
      </div>
      <p className="mt-2 text-3xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}
