import type { ReactNode } from "react";

export function SectionLabel({
  index,
  children,
  tone = "dark",
}: {
  index: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  const color = tone === "dark" ? "text-charcoal/65" : "text-warmwhite/50";
  const rule = tone === "dark" ? "bg-charcoal/25" : "bg-warmwhite/30";
  return (
    <div className={`flex items-center gap-4 ${color}`}>
      <span className="font-sans text-[11px] tracking-label">{index}</span>
      <span aria-hidden className={`h-px w-8 ${rule}`} />
      <span className="eyebrow">{children}</span>
    </div>
  );
}
