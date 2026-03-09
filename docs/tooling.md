# Tooling Notes

## Codex

- Global multi-agent support is enabled in `~/.codex/config.toml`.
- The official OpenAI Developer Docs MCP server is configured globally as `openaiDeveloperDocs` and was verified in this session with a docs search.
- A general-purpose docs MCP server was added globally as `context7` using `https://mcp.context7.com/mcp`.
- The repo path was added to `~/.codex/config.toml` as a trusted project.
- Repo-scoped skills were scaffolded under `.agents/skills` using the system `skill-creator` skill.

## Asset Note

- The prompt referenced an attached image for agent metadata, but no task-scoped attachment path was exposed to the repo environment during bootstrap.
- The repo carries `.agents/assets/agent-icon.png` as a fallback metadata asset generated from a simple local SVG mark so metadata resolves cleanly.
- The original prompt attachment could not be resolved automatically, so the generated icon is a fallback rather than a copy of the prompt asset.
