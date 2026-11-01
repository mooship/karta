@AGENTS.md

## Playwright agents

The Playwright planner, generator and healer agents are in `.claude/agents/`. Plans go in `specs/` and generated tests in `packages/web/e2e/`, starting from `packages/web/e2e/seed.spec.ts`. They use the Playwright test MCP server in `.mcp.json`, which passes `--config packages/web/playwright.config.ts` and runs it with `cmd /c` for Windows; on macOS or Linux use `"command": "npx"` with the same arguments.

## Delegating to sub-agents

Model tiers for any delegated work — both `Agent` tool calls and `agent()` calls inside a Workflow script. Set the `model` parameter explicitly on every call; never omit it, since omission silently inherits the session's model.

| Tier | Use for |
| --- | --- |
| `haiku` | Mechanical bulk work: renames, boilerplate, format conversion, log triage |
| `sonnet` | Default for well-specified implementation with clear acceptance criteria |
| `opus` | Genuinely tricky work: concurrency, subtle algorithms, adversarial verify/judge panels, gnarly debugging |

**Never use `fable` sub-agents, under any circumstance — not even with my approval.** Stick to the three tiers above; when unsure between them, pick the cheaper one and escalate on failure.

## Dynamic workflows (Workflow tool)

Applies to all sessions, on any model. Dynamic workflows are a normal tool here, not something to avoid — reach for the Workflow tool when a task has 3+ independent, parallelisable subtasks, or would benefit from a pipeline/judge panel.

Opt-in rule: if `ultracode` isn't already on for the session (no `ultracode` keyword, toggle, or an explicit orchestration request), propose the workflow in one or two sentences — its rough shape and cost — and wait for my go-ahead before invoking it. If `ultracode` is on, invoke directly.

Every `agent()` call inside a workflow script must set `model` explicitly, chosen from the tiers in "Delegating to sub-agents" above. `fable` is never valid there either — a Fable review, if genuinely warranted, runs after the workflow finishes as its own standalone `Agent` call (ask first, per above), never as a workflow stage.
