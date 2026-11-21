import { cn } from "@/lib/utils";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "primary";

const TONES: Record<BadgeTone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
  primary: "bg-secondary text-secondary-foreground",
};

export function StatusBadge({
  label,
  tone = "primary",
  className,
}: {
  label: string;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className
      )}
    >
      {label}
    </span>
  );
}