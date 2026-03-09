# Storybook Warning Notes

Date: 2026-03-09

## Warning text

```
unable to find package.json for radix-ui
```

## Reproduction

```bash
pnpm --filter @cornerfall/web storybook:build
```

The build still completes successfully after this warning.

## Root cause

- The repo uses the `radix-ui` umbrella package in the copied shadcn primitives.
- Storybook performs package metadata lookup during build.
- `radix-ui` itself resolves and imports correctly, but `radix-ui/package.json` is not exported as a public subpath.
- That metadata lookup fails even though the dependency graph is healthy, which produces the warning without breaking the build.

Evidence from the current repo state:

- `pnpm --filter @cornerfall/web ls radix-ui --depth 2` resolves a single installed version.
- `pnpm --filter @cornerfall/web exec node -e "import('radix-ui').then((mod) => console.log(Object.keys(mod).length))"` succeeds.
- `pnpm --filter @cornerfall/web exec node --input-type=module -e "await import('radix-ui/package.json', { with: { type: 'json' } })"` fails with module resolution errors.

## Why this is safe to defer

- Storybook preview and static build both complete successfully.
- The warning does not indicate duplicate Radix packages or a broken install.
- Fixing it repo-side would require a broad primitive import rewrite away from `radix-ui`, which is larger than the value of suppressing a non-fatal metadata warning.

## Future action triggers

- Storybook starts failing instead of warning.
- The repo adopts direct `@radix-ui/*` imports for other reasons.
- Storybook or shadcn publishes guidance that addresses umbrella-package metadata lookup directly.
