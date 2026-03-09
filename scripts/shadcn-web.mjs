import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const hasWorkspaceFlag = args.includes("-c") || args.includes("--cwd");
const command = ["dlx", "shadcn@latest", ...args];

if (!hasWorkspaceFlag) {
  command.push("-c", "apps/web");
}

const result = spawnSync("pnpm", command, {
  stdio: "inherit",
  cwd: process.cwd(),
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
