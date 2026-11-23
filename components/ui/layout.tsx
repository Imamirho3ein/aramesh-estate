import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-7 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  variant = "classic",
}: {
  children: ReactNode;
  variant?: "classic" | "smart";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
        variant === "smart"
          ? "border-accent/25 bg-accent/5 text-accent"
          : "border-accent/15 bg-soft text-accent",
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  variant = "classic",
  align = "start",
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: string;
  variant?: "classic" | "smart";
  align?: "start" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-9 flex flex-col gap-5 sm:mb-12",
        align === "center"
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <div className="mb-3">
            <Eyebrow variant={variant}>{eyebrow}</Eyebrow>
          </div>
        ) : null}
        <h2
          className={cn(
            "text-2xl font-extrabold leading-[1.35] tracking-tight sm:text-3xl lg:text-[2.4rem]",
            variant === "smart" && "text-gradient-lime",
          )}
        >
          {title}
        </h2>
        {desc ? (
          <p
            className={cn(
              "mt-3 text-sm leading-7 sm:text-[15px]",
              variant === "smart" ? "text-muted" : "text-muted",
            )}
          >
            {desc}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Stat({
  value,
  label,
  variant = "classic",
}: {
  value: ReactNode;
  label: string;
  variant?: "classic" | "smart";
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          "text-2xl font-extrabold tracking-tight sm:text-3xl",
          variant === "smart" ? "text-accent" : "text-ink",
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted sm:text-[13px]">{label}</span>
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}
