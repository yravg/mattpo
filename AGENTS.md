# AGENTS.md — mattpo

**What:** a Claude Code plugin and marketplace. Matt Pocock's engineering skills ([mattpocock/skills](https://github.com/mattpocock/skills)) pinned in `vendor/`, exposed under `skills/` with a yravg adapter header, plus four own skills (`mattpo`, `mattpo-mode`, `mattpo-help`, `mattpo-sync`) and one agent. MIT. Public at https://github.com/yravg/mattpo.

**Read first:** [`docs/handoff/mattpo.md`](docs/handoff/mattpo.md). It has the status, the continue prompt and the open decisions.

**Run and test** (Node 20+, python3, gh):

```
node scripts/test-snapshot.mjs
node scripts/test-sync.mjs
node scripts/sync.mjs            # read-only upstream check
claude plugin validate .         # if the Claude Code CLI is present
```

**House rules**

- Never edit `vendor/` or the upstream body below `<!-- yravg-adapter:end -->` in an exposed `skills/*/SKILL.md` by hand. Only `scripts/sync.mjs --apply` writes them. The tests compare them byte for byte with the lock.
- Own skills, `agents/`, `scripts/`, the docs and the manifests are the editable surface.
- Every release bumps `.claude-plugin/plugin.json` `version` (`node scripts/bump-version.mjs`) and adds a `CHANGELOG.md` entry. Claude Code only offers an update when the version changes.
- Upstream sync is done by `.github/workflows/upstream-sync.yml`. A refusal is a human review, never something to force through.
- No SessionStart hooks. Never run anything from `vendor/`.
