import { AlertTriangle, CheckCircle2, XCircle, type LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiStatus = "good" | "warning" | "critical";

// Fixed status palette - never themed, never reused for series colors.
const statusIcon: Record<KpiStatus, { icon: LucideIcon; className: string }> = {
  good: { icon: CheckCircle2, className: "text-[#0ca30c]" },
  warning: { icon: AlertTriangle, className: "text-[#fab219]" },
  critical: { icon: XCircle, className: "text-[#d03b3b]" },
};

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  status?: KpiStatus;
  statusLabel?: string;
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  status,
  statusLabel,
}: KpiCardProps) {
  const Status = status ? statusIcon[status] : null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {Status && statusLabel && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Status.icon className={`size-3.5 ${Status.className}`} aria-hidden="true" />
            <span>{statusLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
