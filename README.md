# mattpo

Engineering skills from [mattpocock/skills](https://github.com/mattpocock/skills), pinned to an exact upstream commit and kept in sync every day, with a yravg manager on top. This is not Matt Pocock's plugin and it is not an endorsement.

The current upstream commit, upstream plugin version and sync time are in [`UPSTREAM.md`](UPSTREAM.md). Version history is in [`CHANGELOG.md`](CHANGELOG.md).

**Licence:** MIT. The glue (the mode, the core skill, the help skill, the sync skill, the agent, and `scripts/`) is Copyright (c) 2026 Enrico D. Marlon, see [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE). The upstream skills are MIT, Copyright (c) 2026 Matt Pocock, see [`vendor/LICENSE`](vendor/LICENSE). `skills/pr/CREDITS.md` keeps the Humanlayer / Dex Horthy credit from upstream.

## Start here

In Claude Code the command is `/mattpo:mattpo-mode`, then the outcome. Example:

`/mattpo:mattpo-mode Members save one notification preference, reload, and see that value. Ask me only what the repo cannot answer. Do not commit.`

`/mattpo-mode` is the same skill when no other command uses that bare name. It is not a second command. `/mattpo:mattpo-help` explains the toolkit and does not start work. `/mattpo:mattpo` loads the core rules. `/mattpo:mattpo-sync` checks for a newer upstream commit and pulls the latest release.

Claude Desktop has an open report that installed plugin skills can be namespaced by an install hash instead of the plugin name (anthropics/claude-code issue 86627, last updated 28 August 2026). This README does not claim that desktop path was tested.

## What is inside

| Skill | Purpose |
|---|---|
| mattpo-mode | Manager. Nine principles, eleven playbooks, one delegate. |
| mattpo | Glossary, domain model, and standards stay apart. Evidence and permissions. |
| mattpo-help | How to start. Does not do the task. |
| mattpo-sync | Upstream check, trigger the sync Action, pull the latest release. |
| 26 exposed upstream skills | Generated from the snapshot. A yravg header, then the verbatim skill. |
| ask-matt | In `vendor/` only. The mode is the router. |

Agent: `mattpo:mattpo-agent`.

Playbooks: investigation, session pickup, clarify, spec and tickets, implement, review, PR draft, retro, architecture, teach, upstream sync.

The mode writes a file you asked to change. It does not publish issues, commit, merge, deploy, send, install hooks, or apply a snapshot unless you ask for that action.

## Install

In Claude Code:

```
/plugin marketplace add yravg/mattpo
/plugin install mattpo@mattpo
```

Or from a shell:

```
claude plugin marketplace add yravg/mattpo
claude plugin install mattpo@mattpo
```

Then turn on auto-update for the `mattpo` marketplace: `/plugin` → Marketplaces → mattpo → Enable auto-update. Claude Code then pulls every new release when it starts.

Do not also install `mattpocock-skills` from the official marketplace. That copy duplicates these skills.

`/mattpo:tdd` and `/mattpo:teach` are the copies here. Other plugins ship skills with those same bare names. Use the prefix.

## How it stays in sync

```
mattpocock/skills (main)
      │  daily 01:23 UTC, or: gh workflow run upstream-sync.yml -R yravg/mattpo
      ▼
GitHub Action upstream-sync  ──  guard refuses or a test fails ──►  issue labelled upstream-sync
      │  node scripts/sync.mjs --apply, tests, patch version bump
      ▼
commit on main (vX.Y.Z+1)
      │  marketplace auto-update, or: claude plugin marketplace update mattpo && claude plugin update mattpo@mattpo
      ▼
your Claude Code (restart to load)
```

Guards in `scripts/sync.mjs`: an upstream licence change, a skill path that was added, removed or renamed, an exposed skill that depends on one that is not exposed, or a name collision is refused and never applied automatically. OWN skills (`mattpo`, `mattpo-mode`, `mattpo-help`, `mattpo-sync`) are never overwritten. The script copies files only. It never runs upstream files. There is no SessionStart hook.

To handle a refused sync: clone this repo, update `coverage.json` and `COVERAGE.md` (and read the new licence if it changed), run `node scripts/sync.mjs --apply`, run the tests, bump the version with `node scripts/bump-version.mjs`, and open a PR.

## Checks

```
node scripts/test-snapshot.mjs   # no network: the committed snapshot matches the lock
node scripts/test-sync.mjs       # no network: the sync guards
node scripts/sync.mjs            # network, read-only: compare the lock with upstream main
```

`sync.mjs` exit codes: 0 means the lock matches upstream, 1 means an update (check mode) or a refusal, 2 means the network or the payload check failed and nothing changed. It needs `gh` (signed in or with `GH_TOKEN`) and `python3`.

## Counts

At 0.1.0: 27 published upstream skills are mapped. 26 are exposed, `ask-matt` is vendor-only, and 12 unpublished upstream skills are listed in `COVERAGE.md` and not copied. `node scripts/test-snapshot.mjs` prints the current counts.
