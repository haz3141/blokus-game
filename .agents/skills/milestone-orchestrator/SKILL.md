---
name: milestone-orchestrator
description: Use when planning or executing a multi-milestone repository task that needs phased delivery, explicit ownership, verification gates, commit boundaries, or child-agent coordination.
---

# Milestone Orchestrator

Use this skill to turn a broad repo task into a small number of concrete milestones that can be executed and verified independently.

## Workflow

1. Ground the current repo state before proposing phases.
2. Split work by subsystem or ownership, not by arbitrary file count.
3. Define a checkpoint for each milestone:
   - intended outcome
   - files or areas owned
   - commands that must pass
   - commit message boundary
4. Prefer parallel child agents only for disjoint write sets.
5. Keep one integration owner responsible for cross-cutting wiring and final verification.

## Output Expectations

- Use 3 to 7 milestones for most medium-to-large projects.
- Each milestone should be decision-complete and safe to commit alone.
- Every milestone should name the expected verification commands.
- When agent delegation is used, state which paths each agent owns and which files remain reserved for integration.

## Guardrails

- Do not let milestone plans drift into vague themes like "polish later".
- Do not merge multiple unrelated concerns into one commit boundary.
- If a milestone cannot be verified independently, split it again.
- Keep living docs current when milestones change repo structure, tooling, or workflow.
