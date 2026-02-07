import { type RiskLevel } from "@/types/phishing";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

const config: Record<RiskLevel, { label: string; className: string; icon: React.ElementType }> = {
  high: {
    label: "High Risk",
    className: "bg-risk-high text-risk-high-foreground",
    icon: ShieldAlert,
  },
  medium: {
    label: "Medium Risk",
    className: "bg-risk-medium text-risk-medium-foreground",
    icon: AlertTriangle,
  },
  safe: {
    label: "Safe",
    className: "bg-risk-safe text-risk-safe-foreground",
    icon: ShieldCheck,
  },
};

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function RiskBadge({ level, size = "sm", showIcon = true }: RiskBadgeProps) {
  const { label, className, icon: Icon } = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-semibold",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />}
      {label}
    </span>
  );
}
