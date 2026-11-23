import { Suspense } from "react";
import { SmartExplore } from "@/components/smart/explore-client";

export const metadata = {
  title: "جست‌وجوی هوشمند | آرامش هوشمند",
  description:
    "جست‌وجوی زبان طبیعی املاک تهران با دستیار هوشمند، فیلتر پیشرفته، نقشه تعاملی و مقایسه.",
};

function ExploreFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-[11px] text-muted">در حال آماده‌سازی جست‌وجوی هوشمند...</span>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreFallback />}>
      <SmartExplore />
    </Suspense>
  );
}
