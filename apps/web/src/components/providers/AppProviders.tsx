import type { PropsWithChildren } from "react";

import { TooltipProvider } from "@/components/ui/tooltip.js";
import { Toaster } from "@/components/ui/sonner.js";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <TooltipProvider delayDuration={180}>
      {children}
      <Toaster closeButton position="top-right" />
    </TooltipProvider>
  );
}
