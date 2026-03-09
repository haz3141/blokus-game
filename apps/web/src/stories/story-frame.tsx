import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StoryFrame({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "w-full rounded-[1.75rem] border border-border/70 bg-card/95 p-6 text-card-foreground shadow-lg shadow-black/10 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StorySection({
  title,
  description,
  children,
  className
}: PropsWithChildren<{ title: string; description?: string; className?: string }>) {
  return (
    <section className={cn("grid gap-4", className)}>
      <div className="grid gap-1">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function StoryGrid({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>;
}

export function TokenSwatch({
  label,
  value,
  sample
}: {
  label: string;
  value: string;
  sample?: ReactNode;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-border/70 bg-background/60 p-4">
      <div className="grid gap-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{value}</p>
      </div>
      {sample ?? <div className="h-14 rounded-xl border border-border/50" style={{ background: value }} />}
    </div>
  );
}
