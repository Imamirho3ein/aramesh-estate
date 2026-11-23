import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  variant = "classic",
  size = "md",
}: {
  href?: string;
  variant?: "classic" | "smart" | "light";
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "sm" ? "size-9 rounded-xl" : size === "lg" ? "size-14 rounded-[1.2rem]" : "size-11 rounded-2xl";
  const title =
    size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl";
  const sub = size === "sm" ? "text-[8px]" : "text-[10px]";

  return (
    <Link href={href} className="group flex items-center gap-2.5">
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-105",
          box,
          variant === "smart"
            ? "bg-accent text-[#0a0f0c]"
            : variant === "light"
              ? "bg-white/10 text-white ring-1 ring-white/20"
              : "bg-accent text-[#f7f4ed]",
        )}
      >
        <svg viewBox="0 0 32 32" fill="none" className="size-[62%]" aria-hidden>
          <path
            d="M5.5 27V13.6L16 4.5l10.5 9.1V27"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.6 27v-7.4a4.4 4.4 0 0 1 8.8 0V27"
            stroke="currentColor"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-60" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-extrabold tracking-tight", title)}>آرامش</span>
        <span
          className={cn(
            "mt-1 font-medium tracking-[0.28em]",
            sub,
            variant === "smart" ? "text-accent" : variant === "light" ? "text-white/55" : "text-muted",
          )}
        >
          {variant === "smart" ? "SMART ESTATE" : "REAL ESTATE"}
        </span>
      </span>
    </Link>
  );
}

export function LogoMark({ variant = "classic" }: { variant?: "classic" | "smart" }) {
  return (
    <span
      className={cn(
        "grid size-10 place-items-center rounded-xl",
        variant === "smart" ? "bg-accent text-[#0a0f0c]" : "bg-accent text-[#f7f4ed]",
      )}
    >
      <svg viewBox="0 0 32 32" fill="none" className="size-6" aria-hidden>
        <path
          d="M5.5 27V13.6L16 4.5l10.5 9.1V27"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.6 27v-7.4a4.4 4.4 0 0 1 8.8 0V27"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
