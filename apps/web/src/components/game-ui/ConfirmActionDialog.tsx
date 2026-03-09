import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmActionDialogProps {
  cancelLabel?: string
  confirmLabel?: string
  confirmPending?: boolean
  confirmDisabled?: boolean
  description: ReactNode
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
  title: ReactNode
  tone?: "default" | "destructive"
}

export function ConfirmActionDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  confirmDisabled = false,
  confirmPending = false,
  description,
  onConfirm,
  onOpenChange,
  open,
  title,
  tone = "default",
}: ConfirmActionDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border border-[var(--color-border-subtle)] bg-[var(--color-bg-panel-elevated)] text-[var(--color-text)]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl tracking-[-0.03em]">{title}</DialogTitle>
          <DialogDescription className="text-[var(--color-text-muted)]">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            {cancelLabel}
          </Button>
          <Button
            disabled={confirmDisabled || confirmPending}
            onClick={onConfirm}
            variant={tone === "destructive" ? "destructive" : "default"}
          >
            {confirmPending ? "Working..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
