# Tooling Notes

## Codex

- Global multi-agent support is enabled in `~/.codex/config.toml`.
- The official OpenAI Developer Docs MCP server is configured globally as `openaiDeveloperDocs`.
- A general-purpose docs MCP server was added globally as `context7` using `https://mcp.context7.com/mcp`.
- Repo-scoped skills were scaffolded under `.agents/skills` using the system `skill-creator` skill.

## Asset Note

- The prompt referenced an attached image for agent metadata, but no task-scoped attachment path was exposed to the repo environment during bootstrap.
- The repo will carry `.agents/assets/agent-icon.png` as a fallback metadata asset and note that the original prompt attachment could not be resolved automatically.
